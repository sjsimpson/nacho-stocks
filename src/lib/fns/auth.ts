import { randomUUID } from 'node:crypto'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { APIError } from 'better-auth/api'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db, schema } from '@/db'
import { auth } from '@/lib/server/auth'
import { checkUsername, usernameProblemMessage } from '@/lib/username'

const username = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    const problem = checkUsername(value)
    if (problem)
      ctx.addIssue({ code: 'custom', message: usernameProblemMessage[problem] })
  })
const password = z.string().min(8, 'Password must be at least 8 characters.')

/** Students have no email. BetterAuth requires one, so use a non-routable placeholder. */
export const placeholderEmail = () => `${randomUUID()}@students.invalid`

async function signUp(body: {
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

export const signUpStudent = createServerFn({ method: 'POST' })
  .validator(z.object({ username, password }))
  .handler(({ data }) =>
    signUp({
      email: placeholderEmail(),
      name: data.username,
      username: data.username,
      password: data.password,
      accountType: 'student',
    })
  )

export const signUpTeacher = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      name: z.string().trim().min(1, 'Name is required.').max(80),
      email: z.string().trim().email('Enter a valid email.'),
      username,
      password,
    })
  )
  .handler(({ data }) => signUp({ ...data, accountType: 'teacher' }))
