import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { createContactStore, ContactStoreError, lockDurationMs, retryWindowMs } from '../server/contact-store.js'
import { RedisFixture } from './helpers/redis.js'

function setup() {
  const redis = new RedisFixture()
  const store = createContactStore({ url: 'https://test-db.upstash.io', token: 'test-only-token', fetchImpl: redis.fetch.bind(redis) })
  const input = { id: randomUUID(), fingerprint: 'payload-fingerprint', ipHash: 'client-a', owner: 'owner-a', now: redis.now, autoreply: true }
  return { redis, store, input, reserve: (patch = {}) => store.reserve({ ...input, now: redis.now, ...patch }) }
}

test('reserves one enquiry atomically and preserves millisecond timestamps', async () => {
  const { redis, reserve } = setup()
  const result = await reserve()
  assert.equal(result.code, 'ready')
  assert.equal(result.record.createdAt, redis.now)
  assert.equal(result.record.lockUntil, redis.now + lockDurationMs)
  assert.equal(result.record.acknowledgement, 'pending')
})

test('one reservation wins concurrent attempts for the same enquiry', async () => {
  const { reserve } = setup()
  const results = await Promise.all(Array.from({ length: 10 }, (_, index) => reserve({ owner: `worker-${index}` })))
  assert.equal(results.filter((result) => result.code === 'ready').length, 1)
  assert.equal(results.filter((result) => result.code === 'enquiry_in_progress').length, 9)
})

test('rejects reused keys with changed content', async () => {
  const { reserve } = setup()
  await reserve()
  assert.equal((await reserve({ fingerprint: 'different-content' })).code, 'idempotency_conflict')
})

test('only the current lease owner may commit a receipt', async () => {
  const { redis, store, input, reserve } = setup()
  await reserve()
  assert.equal(await store.update(input.id, 'wrong-worker', { notification: 'sent' }), false)
  redis.now += lockDurationMs + 1
  assert.equal((await reserve({ owner: 'worker-b' })).code, 'ready')
  assert.equal(await store.update(input.id, input.owner, { notification: 'sent' }), false)
  assert.equal(await store.update(input.id, 'worker-b', { notification: 'sent' }), true)
})

test('completed receipts survive beyond provider key expiry', async () => {
  const { redis, store, input, reserve } = setup()
  await reserve()
  await store.update(input.id, input.owner, { notification: 'sent', acknowledgement: 'sent', release: true })
  redis.now += 30 * 24 * 60 * 60 * 1000
  assert.equal((await reserve()).code, 'completed')
  assert.equal(redis.expiry.has(`contact:{enquiries}:v1:receipt:${input.id}`), false)
})

test('old, uncertain notifications are blocked instead of being resent', async () => {
  const { redis, reserve } = setup()
  await reserve()
  redis.now += retryWindowMs
  assert.equal((await reserve()).code, 'retry_expired')
})

test('accepted enquiries return success while an acknowledgement is in progress', async () => {
  const { store, input, reserve } = setup()
  await reserve()
  await store.update(input.id, input.owner, { notification: 'sent' })
  assert.equal((await reserve({ owner: 'worker-b' })).code, 'completed')
})

test('expired optional work is abandoned without losing notification acceptance', async () => {
  const { redis, store, input, reserve } = setup()
  await reserve()
  await store.update(input.id, input.owner, { notification: 'sent' })
  redis.now += retryWindowMs
  const result = await reserve()
  assert.equal(result.code, 'completed')
  assert.equal(result.acknowledgementExpired, true)
  assert.equal((await reserve()).code, 'completed')
})

test('five new enquiries per client per ten minutes, while retries do not consume new-enquiry quota', async () => {
  const { redis, store, input, reserve } = setup()
  for (let index = 0; index < 5; index++) assert.equal((await reserve({ id: randomUUID() })).code, 'ready')
  assert.equal((await reserve()).code, 'rate_limited')
  assert.equal((await reserve({ ipHash: 'client-b' })).code, 'ready')
  await store.update(input.id, input.owner, { release: true })
  assert.equal((await reserve({ ipHash: 'client-b' })).code, 'ready')
  redis.now += 600_001
  assert.equal((await reserve({ id: randomUUID() })).code, 'ready')
})

test('limits repeated requests and global new-enquiry volume', async () => {
  const { redis, reserve } = setup()
  await reserve()
  for (let index = 0; index < 29; index++) assert.equal((await reserve()).code, 'enquiry_in_progress')
  assert.equal((await reserve()).code, 'rate_limited')
  redis.now += 600_001
  redis.call(['SET', 'contact:{enquiries}:v1:new:global', '100'])
  const result = await reserve({ id: randomUUID(), ipHash: 'new-client' })
  assert.equal(result.code, 'rate_limited')
})

test('storage configuration, malformed responses and timeouts fail closed', async () => {
  assert.throws(() => createContactStore({ url: 'http://test-db.upstash.io', token: 'token' }), ContactStoreError)
  assert.throws(() => createContactStore({ url: 'https://unexpected.example', token: 'token' }), ContactStoreError)
  const { input } = setup()
  for (const body of [{ error: 'private provider error' }, { result: '{}' }, { result: '{"code":"ready"}' }]) {
    const store = createContactStore({ url: 'https://test-db.upstash.io', token: 'token', fetchImpl: async () => new Response(JSON.stringify(body)) })
    await assert.rejects(store.reserve(input), ContactStoreError)
  }
  const timeout = createContactStore({ url: 'https://test-db.upstash.io', token: 'token', timeoutMs: 5, fetchImpl: (_url, { signal }) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true })) })
  await assert.rejects(timeout.reserve(input), ContactStoreError)
})
