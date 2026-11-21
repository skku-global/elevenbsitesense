import test from 'node:test'
import assert from 'node:assert/strict'
import { validateEnquiry, normalizeEnquiry, readEnquiryResponse, createSubmissionId, isSubmissionId, getEnquiryServiceTitle } from '../src/data/enquiry.js'
import { serviceOptions } from '../src/data/serviceOptions.js'

const valid = { name: 'Seyi Ade', email: 'seyi@example.com', phone: '+234 803 445 6275', service: 'tiling', message: 'Please quote for tiling a new residential building.' }

test('all eight services and the combined-service option validate', () => {
  assert.equal(serviceOptions.length, 8)
  for (const service of [...serviceOptions.map((option) => option.slug), 'not-sure']) assert.deepEqual(validateEnquiry({ ...valid, service }), {})
  assert.equal(getEnquiryServiceTitle('not-sure'), 'Multiple services / not sure yet')
})

test('rejects short, oversized, incorrectly typed and injected fields without truncating them', () => {
  for (const patch of [{ name: 'X' }, { name: 'X'.repeat(101) }, { name: 'Name\r\nBcc: injected@example.com' }, { email: 'invalid' }, { email: 'x'.repeat(255) + '@example.com' }, { phone: 'bad phone' }, { phone: [] }, { service: 'unknown-service' }, { service: {} }, { message: '1234567890' }, { message: 'X'.repeat(3001) }, { message: ['not', 'a', 'string'] }]) assert.ok(Object.keys(validateEnquiry({ ...valid, ...patch })).length)
  assert.ok(Object.keys(validateEnquiry(null)).length)
})

test('permits Unicode names, optional phones and valid emails longer than 150 characters', () => {
  const email = 'seyi@' + ['a'.repeat(50), 'b'.repeat(50), 'c'.repeat(50), 'com'].join('.')
  assert.deepEqual(validateEnquiry({ ...valid, name: 'Àdébáyọ̀ Taiwo', phone: '', email }), {})
  assert.equal(normalizeEnquiry({ ...valid, email }).email, email)
})

test('normalizes whitespace and line endings consistently', () => {
  assert.deepEqual(normalizeEnquiry({ ...valid, name: ' Seyi Ade ', message: ' First line\r\nSecond line ' }), { ...valid, name: 'Seyi Ade', message: 'First line\nSecond line' })
})

test('creates a valid, fresh reference for each new enquiry', () => {
  const first = createSubmissionId()
  assert.ok(isSubmissionId(first))
  assert.notEqual(createSubmissionId(), first)
})

test('requires explicit JSON acceptance for the matching enquiry reference', async () => {
  const id = createSubmissionId()
  const response = new Response(JSON.stringify({ ok: true, status: 'accepted', enquiryId: id }), { headers: { 'Content-Type': 'application/json' } })
  assert.equal((await readEnquiryResponse(response, id)).enquiryId, id)
  for (const response of [new Response('<html>SPA fallback</html>', { headers: { 'Content-Type': 'text/html' } }), new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } }), new Response(JSON.stringify({ ok: true, status: 'accepted', enquiryId: createSubmissionId() }), { headers: { 'Content-Type': 'application/json' } }), new Response('not JSON', { headers: { 'Content-Type': 'application/json' } })]) await assert.rejects(readEnquiryResponse(response, id))
})

test('exposes controlled field errors and retry guidance', async () => {
  const response = new Response(JSON.stringify({ ok: false, code: 'validation_error', fieldErrors: { email: 'Please check your email.', secret: 'internal detail' } }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  await assert.rejects(readEnquiryResponse(response, createSubmissionId()), (error) => { assert.deepEqual(error.fieldErrors, { email: 'Please check your email.' }); return true })
  const limited = new Response(JSON.stringify({ ok: false, code: 'rate_limited' }), { status: 429, headers: { 'Content-Type': 'application/json' } })
  await assert.rejects(readEnquiryResponse(limited, createSubmissionId()), /wait a little/i)
})
