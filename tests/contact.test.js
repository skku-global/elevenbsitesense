import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { createContactHandler, allowedOrigins } from '../server/contact-handler.js'
import { createMailSender, ContactMailError } from '../server/contact-mail.js'
import { retryWindowMs, lockDurationMs } from '../server/contact-store.js'
import { RedisFixture } from './helpers/redis.js'

const valid = { name: 'Seyi Ade', email: 'seyi@example.com', phone: '08034456275', service: 'swimming-pool-construction', message: 'Please quote for a swimming pool at my residential property.' }
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

function setup(options = {}) {
  const redis = new RedisFixture()
  const env = { VERCEL: '1', VERCEL_ENV: 'production', RESEND_API_KEY: 'test-only-resend-key', UPSTASH_REDIS_REST_URL: 'https://test-db.upstash.io', UPSTASH_REDIS_REST_TOKEN: 'test-only-redis-token', CONTACT_FROM: 'Eleven B Site-Sense <info@elevenbsitesense.com>', CONTACT_TO: 'info@elevenbsitesense.com', AUTOREPLY: 'true', ...options.env }
  const attempts = [], deliveries = new Map(), logs = [], background = [], events = []
  const controls = { ...options }
  const fetchImpl = async (url, config) => {
    if (url.includes('.upstash.io')) {
      const command = JSON.parse(config.body)
      if (controls.storageDown || (controls.failCommit && command[1].includes('local patch')) || (controls.failAckCommit && command[1].includes('local patch') && JSON.parse(command.at(-1)).acknowledgement === 'sent')) throw new Error('private storage detail')
      if (controls.storageStatus) return json({ error: 'private storage detail' }, controls.storageStatus)
      if (controls.storageError) return json({ error: controls.storageError })
      return redis.fetch(url, config)
    }
    assert.equal(url, 'https://api.resend.com/emails')
    const key = config.headers['Idempotency-Key']
    const payload = JSON.parse(config.body)
    const stage = key.endsWith('/notification') ? 'notification' : 'acknowledgement'
    attempts.push({ key, payload, stage })
    if (controls.beforeSend) await controls.beforeSend(stage, payload)
    if (controls.failStage === stage) throw new Error(`${env.RESEND_API_KEY} ${valid.email} private mail failure`)
    if (controls.rejectStage === stage) return json({ message: controls.providerMessage ?? 'private provider detail', privateField: 'Never log the full response body' }, controls.providerStatus ?? 503)
    if (deliveries.has(key)) { assert.equal(deliveries.get(key), config.body); return json({ id: key }) }
    deliveries.set(key, config.body)
    if (controls.failAfterAccept && stage === 'notification') { controls.failAfterAccept = false; throw new Error('connection lost after acceptance') }
    return json({ id: key })
  }
  const handler = createContactHandler({ getEnv: () => env, fetchImpl, now: () => redis.now, logger: { error: (...args) => logs.push(args) }, schedule: (task) => { events.push('scheduled'); background.push(task) } })
  const request = async ({ id = randomUUID(), body = valid, origin = 'https://elevenbsitesense.com', headers = {}, method = 'POST' } = {}) => {
    const response = { code: null, body: null, headers: {}, setHeader(name, value) { this.headers[name] = value }, status(code) { this.code = code; return this }, json(body) { events.push('response'); this.body = body; return this } }
    await handler({ method, headers: { origin, 'content-type': 'application/json', 'idempotency-key': id, 'x-real-ip': '203.0.113.10', ...headers }, socket: { remoteAddress: '127.0.0.1' }, body }, response)
    return response
  }
  return { redis, env, attempts, deliveries, logs, background, events, controls, request, handler, drain: () => Promise.all(background) }
}

test('required notification precedes a branded acknowledgement to the submitted email', async () => {
  const { request, drain, attempts } = setup()
  const response = await request()
  await drain()
  assert.equal(response.code, 200)
  assert.equal(response.body.status, 'accepted')
  assert.deepEqual(attempts.map((attempt) => attempt.stage), ['notification', 'acknowledgement'])
  assert.deepEqual(attempts[0].payload.to, ['info@elevenbsitesense.com'])
  assert.equal(attempts[0].payload.reply_to, valid.email)
  const acknowledgement = attempts[1].payload
  assert.deepEqual(acknowledgement.to, [valid.email])
  assert.equal(acknowledgement.from, 'Eleven B Site-Sense <info@elevenbsitesense.com>')
  assert.equal(acknowledgement.reply_to, 'info@elevenbsitesense.com')
  for (const phrase of ['Thank you for contacting Eleven B Site-Sense Nigeria Limited', 'We have received your enquiry', 'review your message and respond', 'Swimming Pool Construction', 'https://elevenbsitesense.com', '#162d3e', '#bc9c67']) assert.ok(acknowledgement.html.includes(phrase), phrase)
  assert.ok(acknowledgement.text.includes('We have received your enquiry'))
  assert.equal(acknowledgement.headers['Auto-Submitted'], 'auto-replied')
  assert.ok(!acknowledgement.html.includes(valid.message))
  assert.ok(!acknowledgement.html.includes('RESEND_API_KEY'))
})

test('successful notification response is available while acknowledgement work is still running', async () => {
  let release
  const gate = new Promise((resolve) => { release = resolve })
  const app = setup({ beforeSend: (stage) => stage === 'acknowledgement' ? gate : undefined })
  const response = await app.request()
  assert.equal(response.body.ok, true)
  assert.equal(app.deliveries.size, 1)
  assert.deepEqual(app.events, ['scheduled', 'response'])
  release()
  await app.drain()
  assert.equal(app.deliveries.size, 2)
})

test('an acknowledgement receipt failure recovers with no duplicate notification or acknowledgement', async () => {
  const app = setup({ failAckCommit: true })
  const id = randomUUID()
  assert.equal((await app.request({ id })).code, 200)
  await app.drain()
  assert.equal(app.deliveries.size, 2)
  app.controls.failAckCommit = false
  app.redis.now += lockDurationMs + 1
  assert.equal((await app.request({ id })).code, 200)
  await app.drain()
  assert.equal(app.deliveries.size, 2)
  assert.deepEqual(app.attempts.map((attempt) => attempt.stage), ['notification', 'acknowledgement', 'acknowledgement'])
  assert.equal(app.attempts[1].key, app.attempts[2].key)
})

test('acknowledgement failures are safely logged without changing enquiry success', async () => {
  for (const controls of [{ failStage: 'acknowledgement' }, { rejectStage: 'acknowledgement' }]) {
    const app = setup(controls)
    const id = randomUUID()
    const response = await app.request({ id })
    const body = JSON.stringify(response.body)
    await app.drain()
    assert.equal(response.code, 200)
    assert.equal(JSON.stringify(response.body), body)
    assert.ok(app.logs.some(([event]) => event === 'contact_acknowledgement_failed'))
    const log = JSON.stringify(app.logs)
    for (const secret of [app.env.RESEND_API_KEY, app.env.UPSTASH_REDIS_REST_TOKEN, valid.email, valid.message]) assert.ok(!log.includes(secret))
    await app.request({ id })
    await app.drain()
    assert.equal(app.attempts.length, 2)
  }
})

test('never acknowledges when required notification fails', async () => {
  for (const controls of [{ failStage: 'notification' }, { rejectStage: 'notification' }]) {
    const app = setup(controls)
    const response = await app.request()
    await app.drain()
    assert.equal(response.code, 502)
    assert.equal(response.body.ok, false)
    assert.deepEqual(app.attempts.map((attempt) => attempt.stage), ['notification'])
  }
})

test('same reference produces only one notification and one acknowledgement across retries', async () => {
  const app = setup()
  const id = randomUUID()
  assert.equal((await app.request({ id })).code, 200)
  await app.drain()
  for (let index = 0; index < 3; index++) assert.equal((await app.request({ id })).code, 200)
  await app.drain()
  assert.equal(app.attempts.length, 2)
  assert.notEqual(app.attempts[0].key, app.attempts[1].key)
  app.redis.now += 30 * 24 * 60 * 60 * 1000
  assert.equal((await app.request({ id })).code, 200)
  assert.equal(app.attempts.length, 2)
})

test('unknown provider acceptance is recovered using the same provider key', async () => {
  const app = setup({ failAfterAccept: true })
  const id = randomUUID()
  assert.equal((await app.request({ id })).code, 502)
  assert.equal(app.deliveries.size, 1)
  assert.equal((await app.request({ id })).code, 200)
  await app.drain()
  assert.equal(app.deliveries.size, 2)
  assert.equal(app.attempts[0].key, app.attempts[1].key)
})

test('concurrent functions cannot send the same enquiry twice', async () => {
  let release
  const gate = new Promise((resolve) => { release = resolve })
  const app = setup({ beforeSend: (stage) => stage === 'notification' ? gate : undefined })
  const id = randomUUID()
  const first = app.request({ id })
  for (let attempt = 0; attempt < 50 && !app.attempts.length; attempt++) await new Promise((resolve) => setImmediate(resolve))
  if (!app.attempts.length) { release(); assert.fail(`Notification did not start: ${JSON.stringify((await first).body)}`) }
  const second = await app.request({ id })
  assert.equal(second.code, 409)
  assert.equal(second.body.code, 'enquiry_in_progress')
  release()
  assert.equal((await first).code, 200)
  await app.drain()
  assert.equal(app.deliveries.size, 2)
})

test('changed content cannot reuse a completed reference', async () => {
  const app = setup()
  const id = randomUUID()
  await app.request({ id })
  await app.drain()
  const response = await app.request({ id, body: { ...valid, message: 'A completely different enquiry about another building project.' } })
  assert.equal(response.code, 409)
  assert.equal(response.body.code, 'idempotency_conflict')
  assert.equal(app.attempts.length, 2)
})

test('rate limits new enquiries independently from delivery retries', async () => {
  const app = setup()
  for (let index = 0; index < 5; index++) { assert.equal((await app.request()).code, 200); await app.drain() }
  const limited = await app.request()
  assert.equal(limited.code, 429)
  assert.ok(Number(limited.headers['Retry-After']) > 0)
  assert.equal(app.deliveries.size, 10)
})

test('only approved production, exact preview and development origins are allowed', () => {
  assert.deepEqual([...allowedOrigins({})], ['https://elevenbsitesense.com', 'https://www.elevenbsitesense.com', 'https://elevenbsitesense.vercel.app'])
  const preview = allowedOrigins({ VERCEL_ENV: 'preview', VERCEL_URL: 'eleven-preview.vercel.app' })
  assert.ok(preview.has('https://eleven-preview.vercel.app'))
  assert.ok(!preview.has('https://unrelated.vercel.app'))
  assert.ok(allowedOrigins({ VERCEL_ENV: 'development' }).has('http://localhost:3000'))
  assert.ok(!allowedOrigins({ VERCEL_ENV: 'production', NODE_ENV: 'development' }).has('http://localhost:3000'))
})

test('the exact production Vercel origin is accepted while lookalikes remain blocked', async () => {
  const app = setup()
  const accepted = await app.request({ origin: 'https://elevenbsitesense.vercel.app' })
  await app.drain()
  assert.equal(accepted.code, 200)
  assert.equal(accepted.body.status, 'accepted')
  const mailAttempts = app.attempts.length
  for (const origin of ['https://elevenbsitesense-preview.vercel.app', 'https://elevenbsitesense.vercel.app.attacker.example', 'https://www.elevenbsitesense.vercel.app', 'http://elevenbsitesense.vercel.app', 'https://elevenbsitesense.vercel.app:444', 'https://elevenbsitesense.vercel.app/path', '']) {
    const rejected = await app.request({ origin })
    assert.equal(rejected.code, 403)
    assert.equal(rejected.body.code, 'origin_not_allowed')
  }
  assert.equal(app.attempts.length, mailAttempts)
})

test('invalid origins, methods, JSON, sizes and fields never reach either provider', async () => {
  const app = setup()
  for (const [request, status] of [[{ method: 'GET' }, 405], [{ origin: '' }, 403], [{ origin: 'https://unrelated.vercel.app' }, 403], [{ origin: 'https://elevenbsitesense.com.attacker.example' }, 403], [{ headers: { 'content-type': 'text/plain' } }, 415], [{ body: '{bad JSON' }, 400], [{ body: [] }, 400], [{ body: { ...valid, from: 'attacker@example.com' } }, 400], [{ body: { ...valid, phone: 'invalid phone' } }, 400], [{ body: { ...valid, service: 'untrusted' } }, 400], [{ body: { ...valid, message: 'x'.repeat(20_000) } }, 413], [{ id: 'bad-reference' }, 400]]) assert.equal((await app.request(request)).code, status)
  assert.equal(app.attempts.length, 0)
  assert.equal(app.redis.values.size, 0)
})

test('mail content is escaped and client-supplied service titles are ignored', async () => {
  const app = setup()
  await app.request({ body: { ...valid, name: '<script>Person</script>', message: '<script>alert(1)</script> Please quote for this building project.', serviceTitle: 'Injected subject', source: 'Untrusted website' } })
  await app.drain()
  assert.ok(app.attempts[0].payload.html.includes('&lt;script&gt;'))
  assert.ok(!app.attempts[0].payload.html.includes('<script>'))
  assert.ok(app.attempts[0].payload.subject.includes('Swimming Pool Construction'))
  assert.ok(!app.attempts[0].payload.subject.includes('Injected subject'))
})

test('honeypot submissions and disabled acknowledgements send no unwanted mail', async () => {
  const trapped = setup()
  assert.equal((await trapped.request({ body: { ...valid, company_website: 'bot.example' } })).code, 200)
  assert.equal(trapped.attempts.length, 0)
  const disabled = setup({ env: { AUTOREPLY: 'false' } })
  await disabled.request()
  await disabled.drain()
  assert.equal(disabled.attempts.length, 1)
  const unset = setup({ env: { AUTOREPLY: undefined } })
  await unset.request()
  await unset.drain()
  assert.equal(unset.attempts.length, 1)
})

test('missing credentials or unavailable storage cannot bypass coordination', async () => {
  for (const options of [{ env: { RESEND_API_KEY: '' } }, { env: { UPSTASH_REDIS_REST_TOKEN: '' } }, { storageDown: true }]) {
    const app = setup(options)
    assert.equal((await app.request()).code, 503)
    assert.equal(app.attempts.length, 0)
  }
})

test('missing configuration logs every required variable name without values or provider calls', async () => {
  for (const missing of [['RESEND_API_KEY'], ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'], ['RESEND_API_KEY', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']]) {
    const app = setup({ env: Object.fromEntries(missing.map((name) => [name, '  '])) })
    const id = randomUUID()
    const response = await app.request({ id })
    assert.equal(response.code, 503)
    assert.deepEqual(response.body, { ok: false, code: 'service_unavailable' })
    assert.deepEqual(app.logs, [['contact_configuration_error', { enquiryId: id, reason: 'missing_environment_variables', variables: missing }]])
    assert.equal(app.attempts.length, 0)
    assert.equal(app.redis.values.size, 0)
    const log = JSON.stringify(app.logs)
    for (const value of [app.env.CONTACT_FROM, app.env.CONTACT_TO, app.env.RESEND_API_KEY, app.env.UPSTASH_REDIS_REST_URL, app.env.UPSTASH_REDIS_REST_TOKEN].filter((value) => value.trim())) assert.ok(!log.includes(value))
  }
})

test('invalid configuration logs only the affected variable names and controlled reasons', async () => {
  for (const [env, variable, reason] of [
    [{ CONTACT_FROM: '"Eleven B Site-Sense <info@elevenbsitesense.com>"' }, 'CONTACT_FROM', 'invalid_sender_format'],
    [{ CONTACT_FROM: 'Company <info@unapproved.example>' }, 'CONTACT_FROM', 'sender_domain_not_allowed'],
    [{ CONTACT_TO: 'invalid destination' }, 'CONTACT_TO', 'invalid_destination_address'],
    [{ UPSTASH_REDIS_REST_URL: 'https://unapproved.example/private' }, 'UPSTASH_REDIS_REST_URL', 'invalid_storage_endpoint'],
    [{ CONTACT_ALLOWED_ORIGINS: 'https://elevenbsitesense.com/private' }, 'CONTACT_ALLOWED_ORIGINS', 'invalid_origin_configuration'],
    [{ VERCEL_ENV: 'preview', VERCEL_URL: 'invalid host' }, 'VERCEL_URL', 'invalid_preview_origin_configuration'],
  ]) {
    const app = setup({ env })
    assert.equal((await app.request()).code, 503)
    const [[event, details]] = app.logs
    assert.equal(event, 'contact_configuration_error')
    assert.deepEqual(details.variables, [variable])
    assert.equal(details.reason || details.code, reason)
    assert.ok(!JSON.stringify(app.logs).includes(env[variable]))
    assert.equal(app.attempts.length, 0)
  }
})

test('Resend rejection logs status and a redacted message while preserving enquiry and acknowledgement behavior', async () => {
  for (const stage of ['notification', 'acknowledgement']) {
    const app = setup({ rejectStage: stage, providerStatus: 403 })
    const sensitiveValues = [app.env.RESEND_API_KEY, app.env.UPSTASH_REDIS_REST_TOKEN, app.env.UPSTASH_REDIS_REST_URL, app.env.CONTACT_FROM, app.env.CONTACT_TO, app.env.AUTOREPLY, ...Object.values(valid)]
    app.controls.providerMessage = `The sending domain is not verified. ${sensitiveValues.join(' | ')}`
    const id = randomUUID()
    const response = await app.request({ id })
    await app.drain()
    assert.equal(response.code, stage === 'notification' ? 502 : 200)
    const [[event, details]] = app.logs
    assert.equal(event, `contact_${stage}_failed`)
    assert.equal(details.enquiryId, id)
    assert.equal(details.provider, 'resend')
    assert.equal(details.code, 'provider_rejected')
    assert.equal(details.status, 403)
    assert.ok(details.message.startsWith('The sending domain is not verified.'))
    assert.ok(details.message.includes('[REDACTED]'))
    const log = JSON.stringify(app.logs)
    for (const value of sensitiveValues) assert.ok(!log.includes(value), `Leaked: ${value}`)
    assert.ok(!log.includes('Never log the full response body'))
    assert.ok(!JSON.stringify(response.body).includes(details.message))
    assert.equal(app.attempts.length, stage === 'notification' ? 1 : 2)
    if (stage === 'acknowledgement') {
      assert.equal((await app.request({ id })).code, 200)
      await app.drain()
      assert.equal(app.attempts.length, 2)
    }
  }
})

test('Redis failures log a controlled cause without leaking storage or customer details', async () => {
  for (const [options, expected] of [
    [{ storageDown: true }, { code: 'storage_request_failed' }],
    [{ storageStatus: 401 }, { code: 'storage_http_error', status: 401, variables: ['UPSTASH_REDIS_REST_TOKEN'] }],
    [{ storageError: 'ERR command denied: test-only-redis-token https://test-db.upstash.io' }, { code: 'storage_command_rejected', message: 'ERR command denied: [REDACTED] [REDACTED]' }],
  ]) {
    const app = setup(options)
    const id = randomUUID()
    assert.equal((await app.request({ id })).code, 503)
    assert.deepEqual(app.logs, [['contact_storage_unavailable', { enquiryId: id, provider: 'upstash', ...expected }]])
    assert.equal(app.attempts.length, 0)
    const log = JSON.stringify(app.logs)
    for (const value of [app.env.RESEND_API_KEY, app.env.UPSTASH_REDIS_REST_TOKEN, app.env.UPSTASH_REDIS_REST_URL, valid.email, valid.message, 'private storage detail']) assert.ok(!log.includes(value))
  }
})

test('a receipt commit failure after required acceptance preserves success and skips optional delivery', async () => {
  const app = setup({ failCommit: true })
  const id = randomUUID()
  assert.equal((await app.request({ id })).code, 200)
  assert.equal(app.attempts.length, 1)
  app.controls.failCommit = false
  app.redis.now += lockDurationMs + 1
  assert.equal((await app.request({ id })).code, 200)
  await app.drain()
  assert.equal(app.deliveries.size, 2)
})

test('uncertain retries older than the provider-safe window send no duplicate notification', async () => {
  const app = setup({ failAfterAccept: true })
  const id = randomUUID()
  await app.request({ id })
  app.redis.now += retryWindowMs
  const response = await app.request({ id })
  assert.equal(response.code, 409)
  assert.equal(response.body.code, 'retry_expired')
  assert.equal(app.attempts.length, 1)
})

test('provider timeouts and malformed acceptance are controlled errors', async () => {
  const sender = createMailSender({ key: 'test-only-key', timeoutMs: 5, fetchImpl: (_url, { signal }) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true })) })
  await assert.rejects(sender({}, 'test-key'), (error) => error instanceof ContactMailError && error.code === 'provider_timeout')
  const malformed = createMailSender({ key: 'test-only-key', fetchImpl: async () => json({ ok: true }) })
  await assert.rejects(malformed({}, 'test-key'), (error) => error.code === 'invalid_provider_response')
})

test('non-JSON Resend failures retain HTTP status without exposing arbitrary response content', async () => {
  const sender = createMailSender({ key: 'test-only-key', fetchImpl: async () => new Response('private error page test-only-key', { status: 502 }) })
  await assert.rejects(sender({}, 'test-key'), (error) => {
    assert.equal(error.code, 'provider_rejected')
    assert.equal(error.status, 502)
    assert.equal(error.providerMessage, 'Resend returned a non-JSON error response')
    return true
  })
})
