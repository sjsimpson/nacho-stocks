import { randomUUID } from 'node:crypto'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { APIError } from 'better-auth/api'
import { eq } from 'drizzle-orm'
import { db, schema } from '@/db'
import { auth } from './auth'

/** Students have no email. BetterAuth requires one, so use a non-routable placeholder. */
export const placeholderEmail = () => `${randomUUID()}@students.invalid`

export async function signUp(body: {
  email: string
  name: string
  username: string
  password: string
  accountType: 'student' | 'teacher'
}) {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email: body.email,
        name: body.name,
        username: body.username,
        password: body.password,
      },
      headers: getRequestHeaders(),
    })
    // accountType is `input: false`, so set it after creation.
    await db
      .update(schema.user)
      .set({ accountType: body.accountType })
      .where(eq(schema.user.id, result.user.id))
    return { ok: true as const }
  } catch (e) {
    if (e instanceof APIError) return { ok: false as const, error: e.message }
    throw e
  }
}
