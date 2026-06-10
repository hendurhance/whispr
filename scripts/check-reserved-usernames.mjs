#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const TS_FILE = 'utils/validation.ts'
const SQL_FILE = 'migrations/006-username-rules.sql'

function quoted(block) {
  return [...block.matchAll(/'([^']+)'/g)].map((m) => m[1])
}

function extract(file, regex, label) {
  const text = readFileSync(join(root, file), 'utf8')
  const match = text.match(regex)
  if (!match) {
    console.error(`✗ Could not locate ${label} in ${file} — did its shape change? Update this check.`)
    process.exit(2)
  }
  return new Set(quoted(match[1]))
}

const fromTs = extract(TS_FILE, /RESERVED_USERNAMES\s*=\s*\[([\s\S]*?)\]\s*as const/, 'RESERVED_USERNAMES')
const fromSql = extract(SQL_FILE, /=\s*any\s*\(\s*array\[([\s\S]*?)\]\s*\)/, 'reserved array')

const missingInSql = [...fromTs].filter((u) => !fromSql.has(u)).sort()
const missingInTs = [...fromSql].filter((u) => !fromTs.has(u)).sort()

if (missingInSql.length || missingInTs.length) {
  console.error('✗ Reserved-username lists are OUT OF SYNC:')
  if (missingInSql.length) console.error(`  • in ${TS_FILE} but NOT in ${SQL_FILE}: ${missingInSql.join(', ')}`)
  if (missingInTs.length) console.error(`  • in ${SQL_FILE} but NOT in ${TS_FILE}: ${missingInTs.join(', ')}`)
  console.error(`\n  Keep RESERVED_USERNAMES (${TS_FILE}) and the trigger array (${SQL_FILE}) identical.`)
  process.exit(1)
}

console.log(`✓ Reserved usernames in sync — ${fromTs.size} entries match across ${TS_FILE} and ${SQL_FILE}.`)
