import { randomUUID } from 'node:crypto'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { APIError } from 'better-auth/api'
import { auth } from './auth'

/** Students may skip email. BetterAuth requires one, so use a non-routable placeholder. */
export const placeholderEmail = () => `${randomUUID()}@students.invalid`

export async function signUp(body: {
  email?: string
  username: string
  password: string
}) {
  try {
    await auth.api.signUpEmail({
      body: {
        email: body.email || placeholderEmail(),
        name: body.username,
        username: body.username,
        password: body.password,
      },
      headers: getRequestHeaders(),
    })
    return { ok: true as const }
  } catch (e) {
    if (e instanceof APIError) return { ok: false as const, error: e.message }
    throw e
  }
}
