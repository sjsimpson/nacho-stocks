/**
 * Bootstraps the first admin (or recovers access). Point DATABASE_URL at the
 * target database. Later admins are managed from /admin > Users.
 * Usage: pnpm admin:grant <username|email>
 */
import { eq, or } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { user } from '../src/db/auth-schema'

const identifier = process.argv[2]?.trim().toLowerCase()
if (!identifier) {
  console.error('Usage: pnpm admin:grant <username|email>')
  process.exit(1)
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool)
const rows = await db
  .update(user)
  .set({ role: 'admin' })
  .where(or(eq(user.username, identifier), eq(user.email, identifier)))
  .returning({ username: user.username })
await pool.end()

if (rows.length === 0) {
  console.error(`No user "${identifier}"`)
  process.exit(1)
}
console.log(`@${rows[0]!.username} is now an admin. Sign out and back in.`)
