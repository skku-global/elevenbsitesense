import { createHash, createHmac, randomUUID } from 'node:crypto'
import { isIP } from 'node:net'
import { ipAddress } from '@vercel/functions'
import { normalizeEnquiry, validateEnquiry, getEnquiryServiceTitle, isSubmissionId, isEmail } from '../src/data/enquiry.js'
import { createContactStore } from './contact-store.js'
import { createMailSender, notificationEmail, acknowledgementEmail, defaultContactFrom, defaultContactTo } from './contact-mail.js'

const productionOrigins = ['https://elevenbsitesense.com', 'https://www.elevenbsitesense.com']
const payloadLimit = 16 * 1024
const allowedFields = new Set(['name', 'email', 'phone', 'service', 'message', 'company_website', 'serviceTitle', 'source'])
const header = (req, name) => typeof req.headers?.[name] === 'string' ? req.headers[name] : ''

export function allowedOrigins(env) {
  const result = new Set(productionOrigins)
  for (const value of (env.CONTACT_ALLOWED_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean)) {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.origin !== value) throw new Error('Invalid origin configuration')
    result.add(value)
  }
  if (env.VERCEL_ENV === 'preview') {
    for (const host of [env.VERCEL_URL, env.VERCEL_BRANCH_URL].filter(Boolean)) {
      const url = new URL(`https://${host}`)
      if (url.hostname.endsWith('.vercel.app') && url.origin === `https://${host}`) result.add(url.origin)
    }
  }
  if (env.VERCEL_ENV === 'development' || (!env.VERCEL_ENV && env.NODE_ENV === 'development')) {
    for (const host of ['localhost', '127.0.0.1']) for (const port of [3000, 5173, 4173, 4183]) result.add(`http://${host}:${port}`)
  }
  return result
}

function clientAddress(req, env) {
  // Use Vercel's documented client-IP helper. Other runtimes use the socket.
  const forwarded = env.VERCEL === '1' ? ipAddress(new Headers({ 'x-real-ip': header(req, 'x-real-ip') })) || '' : ''
  return isIP(forwarded) ? forwarded : req.socket?.remoteAddress || 'unknown'
}

const fingerprint = (values) => createHash('sha256').update(JSON.stringify(values)).digest('hex')
const acceptance = (res, id) => res.status(200).json({ ok: true, status: 'accepted', enquiryId: id })
const rejection = (res, status, code, extra = {}) => res.status(status).json({ ok: false, code, ...extra })

export function createContactHandler({ getEnv = () => process.env, fetchImpl = fetch, schedule, logger = console, now = Date.now } = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store')
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return rejection(res, 405, 'method_not_allowed') }

    let env
    try {
      env = getEnv()
      if (!allowedOrigins(env).has(header(req, 'origin'))) return rejection(res, 403, 'origin_not_allowed')
    } catch { return rejection(res, 503, 'service_unavailable') }
    if (!/^application\/json(?:\s*;|$)/i.test(header(req, 'content-type'))) return rejection(res, 415, 'unsupported_content_type')
    if (Number(header(req, 'content-length')) > payloadLimit) return rejection(res, 413, 'payload_too_large')

    let body
    try {
      const raw = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
      if (typeof raw !== 'string') return rejection(res, 400, 'validation_error')
      if (Buffer.byteLength(raw, 'utf8') > payloadLimit) return rejection(res, 413, 'payload_too_large')
      body = JSON.parse(raw)
      if (!body || Array.isArray(body) || typeof body !== 'object' || Object.keys(body).some((field) => !allowedFields.has(field))) return rejection(res, 400, 'validation_error')
    } catch { return rejection(res, 400, 'validation_error') }

    const id = header(req, 'idempotency-key').toLowerCase()
    if (!isSubmissionId(id)) return rejection(res, 400, 'invalid_submission_reference')
    if (typeof body.company_website === 'string' && body.company_website.trim()) return acceptance(res, id)
    if (body.company_website !== undefined && typeof body.company_website !== 'string') return rejection(res, 400, 'validation_error')
    const fieldErrors = validateEnquiry(body)
    if (Object.keys(fieldErrors).length) return rejection(res, 400, 'validation_error', { fieldErrors })

    let store, send, from, to
    try {
      from = env.CONTACT_FROM || defaultContactFrom
      to = env.CONTACT_TO || defaultContactTo
      const fromEmail = from.match(/<([^<>]+)>$/)?.[1]
      if (/[\r\n]/.test(from) || !isEmail(fromEmail) || !fromEmail.endsWith('@elevenbsitesense.com') || !isEmail(to) || !env.RESEND_API_KEY?.trim()) throw new Error('Invalid mail configuration')
      store = createContactStore({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN, fetchImpl })
      send = createMailSender({ key: env.RESEND_API_KEY, fetchImpl })
    } catch { return rejection(res, 503, 'service_unavailable') }

    const values = normalizeEnquiry(body)
    const serviceTitle = getEnquiryServiceTitle(values.service)
    const owner = randomUUID()
    const safeLog = (event, error) => logger.error(event, { enquiryId: id, ...(error?.code ? { code: error.code } : {}), ...(Number.isInteger(error?.status) ? { status: error.status } : {}) })
    let reservation
    try {
      reservation = await store.reserve({ id, owner, fingerprint: fingerprint(values), now: now(), autoreply: env.AUTOREPLY === 'true', ipHash: createHmac('sha256', env.UPSTASH_REDIS_REST_TOKEN).update(clientAddress(req, env)).digest('hex') })
    } catch { safeLog('contact_storage_unavailable'); return rejection(res, 503, 'service_unavailable') }
    if (reservation.code === 'completed') {
      if (reservation.acknowledgementExpired) safeLog('contact_acknowledgement_retry_expired')
      return acceptance(res, id)
    }
    if (reservation.code !== 'ready') {
      if (reservation.retryAfter) res.setHeader('Retry-After', String(reservation.retryAfter))
      return rejection(res, reservation.code === 'rate_limited' ? 429 : 409, reservation.code)
    }

    const update = async (patch) => {
      try { return await store.update(id, owner, patch) }
      catch { safeLog('contact_receipt_update_failed'); return false }
    }
    const record = reservation.record
    if (record.notification !== 'sent') {
      try {
        await send({ from, to: [to], reply_to: values.email, ...notificationEmail(values, serviceTitle, id) }, `contact/${id}/notification`)
      } catch (error) {
        safeLog('contact_notification_failed', error)
        await update({ release: true })
        return rejection(res, 502, 'notification_unavailable')
      }
      if (!await update({ notification: 'sent' })) {
        // Resend has accepted the required message. Skip optional work when its
        // receipt cannot be committed; the provider key protects recovery retries.
        return acceptance(res, id)
      }
    }

    if (record.acknowledgement === 'pending' && env.AUTOREPLY === 'true') {
      const acknowledgement = (async () => {
        let state = 'sent'
        try {
          await send({ from, to: [values.email], reply_to: to, ...acknowledgementEmail(values, serviceTitle) }, `contact/${id}/acknowledgement`)
        } catch (error) { state = 'failed'; safeLog('contact_acknowledgement_failed', error) }
        await update({ acknowledgement: state, release: true })
      })()
      if (schedule) {
        // Register Vercel's background lifetime before ending the HTTP response.
        try { schedule(acknowledgement) }
        catch { safeLog('contact_background_schedule_failed'); await acknowledgement }
      } else await acknowledgement
    } else await update({ acknowledgement: record.acknowledgement === 'pending' ? 'disabled' : record.acknowledgement, release: true })
    return acceptance(res, id)
  }
}
