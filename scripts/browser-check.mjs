import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

// Dependency-free browser checks using Chromium's DevTools protocol.
// Start Vite first. BROWSER_PATH and SITE_URL can override the defaults.
const root = fileURLToPath(new URL('../', import.meta.url))
const baseUrl = process.env.SITE_URL || 'http://127.0.0.1:5173'
const output = path.join(root, 'artifacts', 'verification')
const browserPath = [
  process.env.BROWSER_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find(existsSync)
assert.ok(browserPath, 'Install Chrome/Edge or set BROWSER_PATH to a Chromium executable.')
await mkdir(output, { recursive: true })
const port = Number(process.env.BROWSER_DEBUG_PORT || 9237)
const browser = spawn(browserPath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--no-sandbox', '--disable-dev-shm-usage', '--disable-features=RendererCodeIntegrity',
  '--disable-extensions', '--noerrdialogs', '--disable-breakpad',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${path.join(root, '.browser-checks', 'profile')}`,
  'about:blank',
], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] })
let browserDiagnostics = ''
browser.stderr.on('data', (chunk) => { browserDiagnostics = (browserDiagnostics + chunk.toString()).slice(-8000) })

let socket
let sequence = 0
const pending = new Map()
const jsErrors = []
const externalFailures = new Set()
const requestUrls = new Map()
const checked = []

async function command(method, params = {}) {
  const id = ++sequence
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${method}`)) }, 20000)
    pending.set(id, { resolve: (result) => { clearTimeout(timer); resolve(result) }, reject: (error) => { clearTimeout(timer); reject(error) } })
    socket.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(expression) {
  const response = await command('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text)
  return response.result?.value
}

async function waitFor(expression, label, timeout = 12000) {
  const end = Date.now() + timeout
  while (Date.now() < end) {
    try { if (await evaluate(expression)) return } catch { /* New document may still be loading. */ }
    await delay(100)
  }
  throw new Error(`Browser check timed out: ${label}`)
}

async function navigate(route) {
  await command('Page.navigate', { url: `${baseUrl}${route}` })
  const expected = new URL(`${baseUrl}${route}`).pathname
  await waitFor(`location.pathname === ${JSON.stringify(expected)} && document.readyState !== 'loading' && !!document.querySelector('main h1') && document.querySelector('main h1').getClientRects().length > 0 && !document.querySelector('.page-loading')`, route)
  await delay(120)
}

async function viewport(width, height = 900) {
  await command('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 700 })
  await command('Emulation.setTouchEmulationEnabled', { enabled: width < 700 })
}

async function screenshot(name, full = false) {
  await delay(250)
  const metrics = await command('Page.getLayoutMetrics')
  const clip = full ? { x: 0, y: 0, width: metrics.cssContentSize.width, height: metrics.cssContentSize.height, scale: 1 } : undefined
  const response = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full, ...(clip ? { clip } : {}) })
  await writeFile(path.join(output, `${name}.png`), Buffer.from(response.data, 'base64'))
}

async function inspect(route, width) {
  await navigate(route)
  const result = await evaluate(`(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content,
    wordmark: document.querySelector('.site-header .brand-wordmark strong')?.textContent.trim(),
    legalSuffix: document.querySelector('.site-header .brand-wordmark > span')?.textContent.trim(),
    socialTitle: document.querySelector('meta[property="og:title"]')?.content,
    socialSiteName: document.querySelector('meta[property="og:site_name"]')?.content,
    twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content,
    footerIdentity: document.querySelector('.footer-bottom > p')?.textContent.trim(),
    footerRegistration: document.querySelector('.footer-registration')?.textContent.trim(),
    headings: document.querySelectorAll('main h1').length,
    heading: document.querySelector('main h1')?.textContent.trim(),
    headers: document.querySelectorAll('.site-header').length,
    announcementStrips: document.querySelectorAll('.topbar').length,
    navbarShells: document.querySelectorAll('.navbar').length,
    width: innerWidth,
    contentWidth: document.documentElement.scrollWidth,
    links: [...document.querySelectorAll('a[href]')].filter(a => a.origin === location.origin).map(a => a.pathname),
    unnamedButtons: [...document.querySelectorAll('button')].filter(b => !b.textContent.trim() && !b.getAttribute('aria-label')).length,
  }))()`)
  assert.equal(result.headings, 1, `${route}: expected exactly one main heading`)
  assert.equal(result.headers, 1, `${route}: expected exactly one site header`)
  assert.equal(result.announcementStrips, 1, `${route}: expected exactly one announcement strip`)
  assert.equal(result.navbarShells, 1, `${route}: expected exactly one navigation bar`)
  assert.ok(result.title && result.description?.length > 30, `${route}: missing SEO metadata`)
  assert.ok(result.contentWidth <= result.width + 1, `${route} at ${width}px has horizontal overflow: ${result.contentWidth}px`)
  assert.equal(result.unnamedButtons, 0, `${route}: button without an accessible name`)
  checked.push({ route, width, title: result.title, heading: result.heading, description: result.description, wordmark: result.wordmark, legalSuffix: result.legalSuffix, socialTitle: result.socialTitle, socialSiteName: result.socialSiteName, twitterTitle: result.twitterTitle, footerIdentity: result.footerIdentity, footerRegistration: result.footerRegistration })
  return result
}

try {
  let tabs
  for (let attempt = 0; attempt < 80; attempt++) {
    try { tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); break } catch { await delay(250) }
  }
  assert.ok(tabs?.length, 'The headless browser did not start.')
  const tab = tabs.find((item) => item.type === 'page')
  socket = new WebSocket(tab.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (message.id) {
      const request = pending.get(message.id)
      if (request) {
        pending.delete(message.id)
        if (message.error) request.reject(new Error(message.error.message))
        else request.resolve(message.result)
      }
    }
    if (message.method === 'Runtime.exceptionThrown') jsErrors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text)
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') jsErrors.push(message.params.args.map((arg) => arg.value || arg.description).join(' '))
    if (message.method === 'Network.requestWillBeSent') requestUrls.set(message.params.requestId, message.params.request.url)
    if (message.method === 'Network.loadingFailed') {
      const url = requestUrls.get(message.params.requestId)
      if (url?.startsWith('https://images.unsplash.com') || url?.startsWith('https://images.pexels.com') || url?.startsWith('https://fonts.')) externalFailures.add(new URL(url).hostname)
    }
  })
  console.log('Headless browser connected.')
  console.log('Browser version:', (await command('Browser.getVersion')).product)
  await command('Page.enable')
  await command('Runtime.enable')
  await command('Network.enable')
  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  const serviceSlugs = [...(await readFile(path.join(root, 'src/data/services.js'), 'utf8')).matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1])
  const projectSlugs = [...(await readFile(path.join(root, 'src/data/projects.js'), 'utf8')).matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1])
  assert.equal(serviceSlugs.length, 8, 'All eight service routes must exist.')
  assert.equal(projectSlugs.length, 6, 'The demonstration portfolio must contain six concepts.')
  const primary = ['/', '/about', '/services', '/projects', '/testimonials', '/faq', '/contact']
  const valid = [...primary, ...serviceSlugs.map((slug) => `/services/${slug}`), ...projectSlugs.map((slug) => `/projects/${slug}`)]
  const routes = [...valid, '/a-page-that-does-not-exist', '/services/not-a-service', '/projects/not-a-project']

  console.log('Checking every route at desktop and mobile widths…')
  for (const width of [1440, 375]) {
    await viewport(width, width === 375 ? 812 : 900)
    for (const route of routes) {
      const result = await inspect(route, width)
      for (const link of result.links) assert.ok(valid.includes(link) || link === route, `${route}: unexpected local link ${link}`)
    }
    console.log(`Passed ${routes.length} routes at ${width}px.`)
  }
  for (const width of [320, 768, 1024, 1920]) {
    await viewport(width)
    for (const route of [...primary, `/services/${serviceSlugs[0]}`, `/projects/${projectSlugs[0]}`]) await inspect(route, width)
    console.log(`Passed representative layouts at ${width}px.`)
  }
  for (const width of [710, 1101]) {
    await viewport(width)
    await inspect('/', width)
    await screenshot(`brand-header-${width}`)
  }

  for (const route of ['/contact', '/about', '/']) {
    await navigate(route)
    const contact = await evaluate(`(() => ({
      phoneLinks: [...document.querySelectorAll('.company-phone-link')].map(a => a.getAttribute('href')),
      whatsappLinks: [...document.querySelectorAll('.company-whatsapp-link')].map(a => a.getAttribute('href')),
      emailLinks: [...document.querySelectorAll('.company-email-link')].map(a => a.getAttribute('href')),
      address: document.querySelector('.footer-contact .office-address').textContent,
      schema: JSON.parse(document.querySelector('#company-identity-schema').textContent),
      slogan: document.querySelector('.topbar span').textContent,
      quotes: document.querySelectorAll('main .testimonial-card').length,
    }))()`)
    for (const phone of ['2348034456275', '2348072791980', '2348124025129']) {
      assert.ok(contact.phoneLinks.includes(`tel:+${phone}`), `${route}: missing international phone link`)
      assert.ok(contact.whatsappLinks.some(link => new URL(link).pathname === `/${phone}`), `${route}: missing WhatsApp link`)
    }
    assert.ok(contact.emailLinks.includes('mailto:ganiyutaiwo2020@gmail.com'))
    assert.ok(contact.address.includes('4th Floor, Lister Building, Ring Road,') && contact.address.includes('Ibadan, Oyo State, Nigeria.'))
    assert.equal(contact.schema.legalName, 'ELEVEN B SITE-SENSE NIGERIA LIMITED')
    assert.equal(contact.schema.identifier.value, '7650068')
    assert.equal(contact.schema.email, 'ganiyutaiwo2020@gmail.com')
    assert.equal(contact.schema.contactPoint.length, 3)
    assert.equal(contact.slogan, 'WE BUILD IT BETTER.')
    assert.equal(contact.quotes, 0, 'Unapproved testimonials must never be published')
  }
  console.log('Official identity, three phone/WhatsApp numbers, email, address and honest feedback verified.')

  await viewport(1440)
  await navigate('/')
  await evaluate(`(() => { window.__originalSiteHeader = document.querySelector('.site-header'); return true; })()`)
  for (const route of ['/about', '/services', '/projects', '/testimonials', '/faq', '/contact', '/']) {
    await evaluate(`[...document.querySelectorAll('.desktop-nav a')].find(a => a.pathname === ${JSON.stringify(route)}).click()`)
    await waitFor(`location.pathname === ${JSON.stringify(route)} && !!document.querySelector('main h1') && !document.querySelector('.page-loading')`, `client navigation to ${route}`)
    assert.equal(await evaluate(`document.querySelector('.site-header') === window.__originalSiteHeader`), true, `${route}: the shared header should remain mounted`)
    assert.equal(await evaluate(`document.querySelectorAll('.site-header').length`), 1)
    assert.equal(await evaluate(`document.querySelectorAll('.topbar').length`), 1)
  }
  console.log('Single persistent header and announcement strip verified during client navigation.')
  const expectedSubjects = ['construction', 'swimming-pool', 'pop-ceiling', 'interior-design', 'tiling', 'interlock-paving', 'stamped-paving', 'painting']
  const serviceImageChecks = []
  for (const [index, slug] of serviceSlugs.entries()) {
    await navigate(`/services/${slug}`)
    await waitFor(`document.querySelector('.service-detail-hero .site-image').classList.contains('is-loaded')`, `${slug}: loaded service image or fallback`)
    const details = await evaluate(`(() => { const image = document.querySelector('.service-detail-hero .site-image'); const img = image.querySelector('img'); return { subject: image.dataset.mediaSubject, source: image.dataset.imageSource, src: img?.currentSrc, alt: img?.alt, naturalWidth: img?.naturalWidth, quoteHref: document.querySelector('.service-detail-hero .button').getAttribute('href') }; })()`)
    assert.equal(details.subject, expectedSubjects[index], `${slug}: wrong image subject`)
    assert.ok(details.naturalWidth > 0, `${slug}: broken service image`)
    assert.ok(!details.src.includes('architecture-fallback'), `${slug}: generic house fallback is forbidden`)
    assert.equal(details.quoteHref, `/contact?service=${slug}`)
    if (slug === 'pop-ceiling-installation') {
      assert.equal(await evaluate(`document.querySelectorAll('.service-detail-gallery figure').length`), 2)
      for (const galleryIndex of [0, 1]) {
        await evaluate(`document.querySelectorAll('.service-detail-gallery figure')[${galleryIndex}].scrollIntoView()`)
        await waitFor(`document.querySelectorAll('.service-detail-gallery .site-image')[${galleryIndex}].classList.contains('is-loaded')`, 'loaded ceiling detail image')
        assert.ok(await evaluate(`document.querySelectorAll('.service-detail-gallery img')[${galleryIndex}].naturalWidth > 0`))
      }
    }
    serviceImageChecks.push({ slug, ...details })
  }
  assert.equal(new Set(serviceImageChecks.map(image => image.src)).size, 8, 'Each service must have its own image.')
  await writeFile(path.join(output, 'service-image-report.json'), JSON.stringify({ images: serviceImageChecks, localIllustrationsVerified: true, note: 'All eight services use bundled subject-specific illustrations. These design references are not company project photographs.' }, null, 2))
  console.log('Eight distinct service subjects, loaded previews, and quote links verified.')
  await navigate('/services/pop-ceiling-installation')
  await screenshot('pop-ceiling-desktop')
  await screenshot('pop-ceiling-desktop-full', true)
  await viewport(375, 812)
  await screenshot('pop-ceiling-mobile')
  await viewport(1440)
  await navigate('/')
  await waitFor(`document.querySelector('.home-hero-image').classList.contains('is-loaded')`, 'hero image or local fallback')
  await screenshot('home-desktop')
  await screenshot('home-desktop-full', true)
  await navigate('/projects')
  await evaluate(`document.querySelectorAll('.project-filters button')[2].click()`)
  await waitFor(`document.querySelectorAll('main .project-card').length === 2`, 'interior project filter')
  assert.equal(await evaluate(`new URLSearchParams(location.search).get('category')`), 'Interiors')
  await evaluate(`document.querySelector('.project-filters button').click()`)
  await waitFor(`document.querySelectorAll('main .project-card').length === 6`, 'reset portfolio filter')

  await navigate('/faq')
  await evaluate(`document.querySelector('.faq-item button').click()`)
  assert.equal(await evaluate(`document.querySelector('.faq-item button').getAttribute('aria-expanded')`), 'true')
  assert.equal(await evaluate(`document.querySelector('.faq-panel').hidden`), false)
  await evaluate(`document.querySelector('.faq-item button').focus()`)
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowDown', code: 'ArrowDown' })
  assert.equal(await evaluate(`document.activeElement.id`), 'faq-button-consultation')
  await evaluate(`(() => { const input = document.querySelector('#faq-search'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'this-term-will-not-match'); input.dispatchEvent(new Event('input', { bubbles: true })); })()`)
  await waitFor(`!!document.querySelector('.empty-state')`, 'FAQ no-results feedback')
  await evaluate(`document.querySelector('.empty-state button').click()`)
  await waitFor(`document.querySelectorAll('.faq-item').length === 12`, 'reset FAQ search')

  await navigate(`/contact?service=${serviceSlugs[1]}`)
  assert.equal(await evaluate(`document.querySelector('[name="service"]').value`), serviceSlugs[1])
  await evaluate(`document.querySelector('form').requestSubmit()`)
  await waitFor(`document.querySelectorAll('[aria-invalid="true"]').length === 3`, 'required field validation')
  assert.equal(await evaluate(`document.activeElement.name`), 'name')
  await evaluate(`(() => {
    const values = { name: 'Website Check', email: 'check@example.com', phone: 'invalid phone', message: 'A website verification enquiry for a residential building consultation.' };
    for (const [name, value] of Object.entries(values)) { const input = document.querySelector('[name="' + name + '"]'); const prototype = input.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(prototype, 'value').set.call(input, value); input.dispatchEvent(new Event('input', { bubbles: true })); }
  })()`)
  await evaluate(`document.querySelector('form').requestSubmit()`)
  await waitFor(`!!document.querySelector('#phone-error')`, 'invalid phone feedback')
  await evaluate(`(() => { const input = document.querySelector('[name="phone"]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ''); input.dispatchEvent(new Event('input', { bubbles: true })); })()`)
  await evaluate(`document.querySelector('form').requestSubmit()`)
  await waitFor(`!!document.querySelector('.form-success')`, 'validated enquiry preview')
  assert.ok((await evaluate(`document.querySelector('.form-success').textContent`)).includes('nothing has been sent'), 'Preview must never claim a real submission.')
  const sharing = await evaluate(`(() => ({
    whatsapp: document.querySelector('.form-success a[href^="https://wa.me/"]').getAttribute('href'),
    email: document.querySelector('.form-success a[href^="mailto:"]').getAttribute('href'),
  }))()`)
  const preparedWhatsApp = new URL(sharing.whatsapp)
  assert.equal(preparedWhatsApp.pathname, '/2348034456275')
  assert.ok(preparedWhatsApp.searchParams.get('text').includes('Website Check'))
  assert.ok(preparedWhatsApp.searchParams.get('text').includes('Swimming Pool Construction'))
  assert.ok(preparedWhatsApp.searchParams.get('text').includes('residential building consultation'))
  assert.ok(sharing.email.startsWith('mailto:ganiyutaiwo2020@gmail.com?'))
  const preparedEmail = new URLSearchParams(sharing.email.split('?')[1])
  assert.ok(preparedEmail.get('subject').includes('Swimming Pool Construction'))
  assert.equal(preparedEmail.get('body'), preparedWhatsApp.searchParams.get('text'))
  await screenshot('contact-enquiry-preview')
  await evaluate(`[...document.querySelectorAll('.form-success button')].find(button => button.textContent.includes('Edit enquiry')).click()`)
  await waitFor(`!!document.querySelector('form')`, 'edit enquiry')
  assert.equal(await evaluate(`document.querySelector('[name="name"]').value`), 'Website Check')

  await navigate('/')
  await evaluate(`document.querySelector('.dropdown-toggle').click()`)
  assert.equal(await evaluate(`document.querySelector('#services-dropdown').hidden`), false)
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' })
  assert.equal(await evaluate(`document.querySelector('#services-dropdown').hidden`), true)
  assert.ok((await evaluate(`document.querySelector('.whatsapp-trigger').getAttribute('href')`)).startsWith('https://wa.me/2348034456275?text='))

  await viewport(375, 812)
  await navigate('/')
  await screenshot('home-mobile')
  await evaluate(`document.querySelector('.mobile-menu-toggle').click()`)
  await waitFor(`document.querySelector('.mobile-menu-toggle').getAttribute('aria-expanded') === 'true'`, 'open mobile navigation')
  assert.equal(await evaluate(`document.body.style.overflow`), 'hidden')
  assert.equal(await evaluate(`document.activeElement.getAttribute('aria-label')`), 'Close mobile navigation')
  await screenshot('mobile-navigation')
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' })
  await waitFor(`document.querySelector('.mobile-menu-toggle').getAttribute('aria-expanded') === 'false'`, 'close mobile menu with Escape')
  assert.equal(await evaluate(`document.querySelector('.mobile-menu-toggle').getAttribute('aria-expanded')`), 'false')
  assert.notEqual(await evaluate(`document.body.style.overflow`), 'hidden')
  await evaluate(`document.querySelector('.mobile-menu-toggle').click()`)
  await evaluate(`document.querySelector('.mobile-service-heading button').click()`)
  await waitFor(`document.querySelector('#mobile-service-links').hidden === false`, 'mobile services submenu')
  await evaluate(`document.querySelector('#mobile-service-links a').click()`)
  await waitFor(`location.pathname === '/services/${serviceSlugs[0]}' && !!document.querySelector('main h1')`, 'mobile service navigation')
  await waitFor(`document.querySelector('.mobile-menu-toggle').getAttribute('aria-expanded') === 'false'`, 'menu closes after service navigation')
  assert.equal(await evaluate(`document.querySelector('.mobile-menu-toggle').getAttribute('aria-expanded')`), 'false')
  assert.notEqual(await evaluate(`document.body.style.overflow`), 'hidden')

  await navigate('/')
  if (await evaluate(`document.querySelector('.home-hero-image').dataset.imageSource === 'photograph'`)) {
    await evaluate(`document.querySelector('.home-hero-image img').dispatchEvent(new Event('error'))`)
  }
  await waitFor(`document.querySelector('.home-hero-image img').naturalWidth > 0 && document.querySelector('.home-hero-image img').alt.includes('illustration')`, 'local image fallback')
  await screenshot('image-fallback-mobile')
  await evaluate(`document.querySelector('.home-hero-image img').dispatchEvent(new Event('error'))`)
  await waitFor(`!!document.querySelector('.home-hero-image .image-unavailable') && !document.querySelector('.home-hero-image img')`, 'terminal fallback does not show a broken image')
  await navigate('/contact')
  await screenshot('contact-mobile', true)
  await viewport(1440)
  await navigate('/about')
  await evaluate(`document.querySelector('.company-registration').scrollIntoView({ block: 'center', behavior: 'instant' })`)
  await screenshot('company-registration-desktop')
  await viewport(375, 812)
  await navigate('/about')
  await evaluate(`document.querySelector('.company-registration').scrollIntoView({ block: 'center', behavior: 'instant' })`)
  await screenshot('company-registration-mobile')
  assert.deepEqual(jsErrors, [], 'Browser JavaScript or React console errors were found.')
  const report = { passed: true, routeChecks: checked.length, routes: checked, interactions: ['official company identity and contacts', 'project filters', 'FAQ accordion and keyboard navigation', 'FAQ search and reset', 'required and invalid phone validation', 'prepared enquiry sharing and editing', 'service preselection', 'desktop dropdown and Escape', 'direct WhatsApp link', 'mobile menu, Escape, submenu and route cleanup', 'local image fallback'], externalAssetFailures: [...externalFailures] }
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2))
  console.log(`Passed ${checked.length} route/layout checks and all interaction checks. No JavaScript console errors.`)
  console.log(`Screenshots and report: ${output}`)
  if (externalFailures.size) console.log(`External assets blocked by this environment: ${[...externalFailures].join(', ')}. Local image fallbacks verified.`)
} catch (error) {
  if (socket?.readyState === WebSocket.OPEN) await screenshot('check-failure').catch(() => {})
  await writeFile(path.join(output, 'failure.json'), JSON.stringify({ message: error.message, checked, jsErrors, browserDiagnostics }, null, 2))
  console.error(error.message)
  process.exitCode = 1
} finally {
  if (socket?.readyState === WebSocket.OPEN) await command('Browser.close').catch(() => {})
  socket?.close()
  if (!browser.killed) browser.kill()
}
