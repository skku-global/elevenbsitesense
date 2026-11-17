import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { company, getCompanySchema } from '../src/data/company.js'

// Generate local sharing artwork and the static HTML metadata from one identity.
// These assets are bundled by Vite; the production build requires no browser.
const root = fileURLToPath(new URL('../', import.meta.url))
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const title = `Construction & Building Services | ${company.brandName}`
const description = `${company.brandName} brings building, swimming pools, P.O.P. ceilings, interiors, tiling, paving, and painting together. Discuss your next project.`
const imageAlt = `${company.brandName} architectural wordmark. ${company.slogan}`
const mark = '<path d="M7 40V15L22 7v33M22 40V23l19-10v27H7" stroke="currentColor" stroke-width="1.7"/><path d="M14 19v21M31 18v22M7 32h34" stroke="currentColor" stroke-width="1.3"/>'
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <title>${escape(company.companyName)}</title>
  <rect width="1200" height="630" fill="#fcfbf8"/>
  <rect x="48" y="46" width="1104" height="538" fill="none" stroke="#e3e4de"/>
  <path d="M48 46h96" stroke="#bc9c67" stroke-width="3"/>
  <g transform="translate(77 90) scale(1.35)" fill="none" color="#86652f">${mark}</g>
  <text x="160" y="123" fill="#162d3e" font-family="Segoe UI, sans-serif" font-size="30" font-weight="600" letter-spacing="1.5">${escape(company.brandName)}</text>
  <path d="M161 147h24" stroke="#86652f"/>
  <text x="197" y="152" fill="#86652f" font-family="Segoe UI, sans-serif" font-size="12" letter-spacing="3">${escape(company.legalSuffix)}</text>
  <g transform="translate(817 198) scale(5.8)" fill="none" color="#bc9c67" opacity="0.22">${mark}</g>
  <text x="80" y="306" fill="#162d3e" font-family="Georgia, serif" font-size="72" letter-spacing="-1.2">We Build It</text>
  <text x="80" y="379" fill="#162d3e" font-family="Georgia, serif" font-size="72" letter-spacing="-1.2">Better.</text>
  <text x="83" y="433" fill="#647078" font-family="Segoe UI, sans-serif" font-size="16" letter-spacing="0.6">BUILDING · POOLS · INTERIORS · PAVING · PAINTING</text>
  <path d="M80 489h1040" stroke="#e3e4de"/>
  <text x="82" y="526" fill="#162d3e" font-family="Segoe UI, sans-serif" font-size="13" font-weight="600" letter-spacing="1">${escape(company.companyName)}</text>
  <text x="82" y="551" fill="#647078" font-family="Segoe UI, sans-serif" font-size="12">RC ${escape(company.rcNumber)} · Registered ${escape(company.registrationDate)} · ${escape(company.registrationStatus)}</text>
</svg>`
const svgPath = path.join(root, 'public', 'social-card.svg')
const pngPath = path.join(root, 'public', company.socialImage.replace(/^\//, ''))
await writeFile(svgPath, svg)

const metadata = [
  ['name', 'description', description],
  ['name', 'application-name', company.brandName],
  ['property', 'og:site_name', company.companyName],
  ['property', 'og:title', title],
  ['property', 'og:description', description],
  ['property', 'og:type', 'website'],
  ['property', 'og:locale', 'en_NG'],
  ['property', 'og:image', company.websiteUrl ? new URL(company.socialImage, company.websiteUrl).href : company.socialImage],
  ['property', 'og:image:alt', imageAlt],
  ['property', 'og:image:width', '1200'],
  ['property', 'og:image:height', '630'],
  ['name', 'twitter:card', 'summary_large_image'],
  ['name', 'twitter:title', title],
  ['name', 'twitter:description', description],
  ['name', 'twitter:image', company.websiteUrl ? new URL(company.socialImage, company.websiteUrl).href : company.socialImage],
  ['name', 'twitter:image:alt', imageAlt],
]
const indexPath = path.join(root, 'index.html')
let html = await readFile(indexPath, 'utf8')
html = html.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
for (const [attribute, name, value] of metadata) {
  const tag = `<meta ${attribute}="${name}" content="${escape(value)}" />`
  const existing = new RegExp(`<meta\\s+${attribute}="${name}"[^>]*>`, 'i')
  html = existing.test(html) ? html.replace(existing, () => tag) : html.replace('  </head>', `    ${tag}\n  </head>`)
}
const schema = `<script id="company-identity-schema" type="application/ld+json">${JSON.stringify(getCompanySchema()).replaceAll('<', '\\u003c')}</script>`
html = /<script id="company-identity-schema"[^>]*>[\s\S]*?<\/script>/.test(html) ? html.replace(/<script id="company-identity-schema"[^>]*>[\s\S]*?<\/script>/, () => schema) : html.replace('  </head>', `    ${schema}\n  </head>`)
await writeFile(indexPath, html)

const browser = [
  process.env.BROWSER_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find(existsSync)
if (!browser) throw new Error('SVG and HTML metadata generated. Set BROWSER_PATH to Chrome/Edge to export the PNG sharing card.')
const profile = path.join(root, '.browser-checks', 'brand-assets-profile')
await mkdir(profile, { recursive: true })
execFileSync(browser, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--no-sandbox', '--disable-dev-shm-usage', '--disable-features=RendererCodeIntegrity',
  '--disable-extensions', '--noerrdialogs', '--disable-breakpad', '--hide-scrollbars',
  `--user-data-dir=${profile}`, '--window-size=1200,630', '--force-device-scale-factor=1',
  `--screenshot=${pngPath}`, pathToFileURL(svgPath).href,
], { windowsHide: true, timeout: 30000, stdio: 'ignore' })
if (!existsSync(pngPath)) throw new Error('The browser did not export the PNG sharing card.')
console.log('Generated local social-card.svg, social-card.png, and branded HTML metadata.')
