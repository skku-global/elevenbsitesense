import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { company } from '../src/data/company.js'

const root = new URL('../dist/', import.meta.url)
const html = await readFile(new URL('index.html', root), 'utf8')
assert.ok(html.includes('info@elevenbsitesense.com'))
assert.ok(html.includes('https://elevenbsitesense.com/social-card.png'))
assert.ok(html.includes('rel="canonical" href="https://elevenbsitesense.com/"'))
assert.ok(html.includes(company.companyName))

let count = 0
async function inspect(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, item.name)
    if (item.isDirectory()) await inspect(target)
    else if (/\.(js|html|css)$/.test(item.name)) {
      const contents = await readFile(target, 'utf8')
      for (const marker of ['RESEND_API_KEY', 'UPSTASH_REDIS_REST_TOKEN', 'api.resend.com/emails', 'test-only-resend-key', 'server-only-build-sentinel']) assert.ok(!contents.includes(marker), `Server-only material was bundled: ${item.name}`)
      for (const name of ['RESEND_API_KEY', 'UPSTASH_REDIS_REST_TOKEN']) if (process.env[name]?.length >= 12) assert.ok(!contents.includes(process.env[name]), `A server credential was bundled: ${item.name}`)
      assert.ok(!contents.includes('ganiyutaiwo2020@gmail.com'), `Outdated contact email: ${item.name}`)
      count++
    }
  }
}
await inspect(fileURLToPath(root))
console.log(`Checked ${count} production files: official company metadata present; server credentials and mail implementation excluded.`)
