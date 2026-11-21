import test from 'node:test'
import assert from 'node:assert/strict'
import { diagnosticDetails, redactDiagnosticMessage } from '../server/contact-diagnostics.js'

test('diagnostics redact literal and escaped credentials, configured values, and customer data', () => {
  const secrets = ['re_example_TEST123456789', 'token/with+special=characters', 'Seyi <Ade> & "Company"', 'info@elevenbsitesense.com']
  const escaped = secrets.flatMap((value) => [value, encodeURIComponent(value), JSON.stringify(value).slice(1, -1), value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]))])
  const message = redactDiagnosticMessage(`Domain verification failed. ${escaped.join(' | ')}\nBearer unexpected-token other@example.com`, secrets)
  assert.ok(message.startsWith('Domain verification failed.'))
  assert.ok(message.includes('[REDACTED]'))
  for (const value of [...escaped, 'unexpected-token', 'other@example.com']) assert.ok(!message.includes(value))
  assert.ok(!message.includes('\n'))
  assert.ok(message.length <= 500)
})

test('diagnostics redact before truncation and tolerate unpaired Unicode surrogates', () => {
  const longSecret = `re_${'a'.repeat(600)}`
  assert.equal(redactDiagnosticMessage(`Denied: ${longSecret}`, [longSecret]), 'Denied: [REDACTED]')
  const malformed = 'Customer\ud800'
  assert.equal(redactDiagnosticMessage(`Rejected ${malformed}`, [malformed]), 'Rejected [REDACTED]')
})

test('diagnostic metadata includes only controlled fields, variable names, and sanitized messages', () => {
  const error = Object.assign(new Error('private error detail'), {
    reason: 'missing_environment_variables', code: 'provider_rejected', provider: 'resend', status: 403,
    variables: ['RESEND_API_KEY', 'private-value'], providerMessage: 'Denied private-value', secret: 'private-value',
  })
  assert.deepEqual(diagnosticDetails(error, ['private-value']), {
    reason: 'missing_environment_variables', code: 'provider_rejected', provider: 'resend', status: 403,
    variables: ['RESEND_API_KEY'], message: 'Denied [REDACTED]',
  })
  assert.deepEqual(diagnosticDetails({ reason: 'private-value', code: 'private-value', provider: 'private-value', variables: 'private-value' }), {})
})
