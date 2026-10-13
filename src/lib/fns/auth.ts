import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { placeholderEmail, signUp } from '@/lib/server/signup'
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
