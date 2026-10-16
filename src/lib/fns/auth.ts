import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { signUp } from '@/lib/server/signup'
import { checkUsername, usernameProblemMessage } from '@/lib/username'

// Public BetterAuth signup is blocked (see routes/api/auth/$.ts) so every
// account goes through this validation.
export const signUpFn = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      username: z
        .string()
        .trim()
        .superRefine((value, ctx) => {
          const problem = checkUsername(value)
          if (problem) {
            ctx.addIssue({
              code: 'custom',
              message: usernameProblemMessage[problem],
            })
          }
        }),
      password: z.string().min(8, 'Password must be at least 8 characters.'),
      email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Enter a valid email.')
        .optional()
        .or(z.literal('').transform(() => undefined)),
    })
  )
  .handler(({ data }) => signUp(data))
