import { describe, expect, it } from 'vitest'
import { envSchema } from './env-schema'

const valid = {
  DATABASE_URL: 'postgres://u:p@localhost:5432/db',
  BETTER_AUTH_SECRET: 'x'.repeat(32),
  EULERPOOL_API_KEY: 'key',
}

describe('envSchema', () => {
  it('accepts the required vars alone', () => {
    expect(envSchema.safeParse(valid).success).toBe(true)
  })

  it.each(['DATABASE_URL', 'BETTER_AUTH_SECRET', 'EULERPOOL_API_KEY'] as const)(
    'rejects a missing %s',
    (key) => {
      expect(envSchema.safeParse({ ...valid, [key]: undefined }).success).toBe(
        false
      )
    }
  )

  it('rejects a BETTER_AUTH_SECRET under 32 characters', () => {
    expect(
      envSchema.safeParse({ ...valid, BETTER_AUTH_SECRET: 'x'.repeat(31) })
        .success
    ).toBe(false)
  })

  it('rejects an empty EULERPOOL_API_KEY', () => {
    expect(
      envSchema.safeParse({ ...valid, EULERPOOL_API_KEY: '' }).success
    ).toBe(false)
  })
})
