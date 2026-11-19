/**
 * Validates env vars against the app's schema; runs first in `vercel-build`.
 * Usage: pnpm env:check
 */
import { z } from 'zod'
import { envSchema } from '../src/lib/server/env-schema'

const result = envSchema.safeParse(process.env)
if (!result.success) {
  console.error(
    `Invalid environment variables:\n${z.prettifyError(result.error)}`
  )
  process.exit(1)
}
console.log('Environment variables OK')
