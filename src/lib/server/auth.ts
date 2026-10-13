import { betterAuth } from 'better-auth'
import { APIError } from 'better-auth/api'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { organization } from 'better-auth/plugins/organization'
import { username } from 'better-auth/plugins/username'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { and, count, eq } from 'drizzle-orm'
import { db, schema } from '@/db'
import { MAX_CLASSES_PER_STUDENT, STARTING_CASH_CENTS } from '@/lib/constants'
import { USERNAME_MAX, USERNAME_MIN, checkUsername } from '@/lib/username'
import { env } from './env'

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  user: {
    additionalFields: {
      accountType: {
        type: 'string',
        required: false,
        defaultValue: 'student',
        input: false,
      },
      cashCents: {
        type: 'number',
        required: false,
        defaultValue: STARTING_CASH_CENTS,
        input: false,
      },
    },
  },
  plugins: [
    username({
      minUsernameLength: USERNAME_MIN,
      maxUsernameLength: USERNAME_MAX,
      usernameValidator: (name) => checkUsername(name) === null,
    }),
    organization({
      allowUserToCreateOrganization: (user) => user.accountType === 'teacher',
      // Invitations are unused; students join with a class code.
      schema: {
        organization: {
          additionalFields: {
            joinCode: {
              type: 'string',
              required: true,
              unique: true,
              input: true,
            },
          },
        },
      },
      organizationHooks: {
        beforeAddMember: async ({ member }) => {
          if (member.role !== 'member') return
          const [row] = await db
            .select({ n: count() })
            .from(schema.member)
            .where(
              and(
                eq(schema.member.userId, member.userId),
                eq(schema.member.role, 'member')
              )
            )
          if ((row?.n ?? 0) >= MAX_CLASSES_PER_STUDENT) {
            throw new APIError('BAD_REQUEST', {
              message: 'You are already in a class.',
            })
          }
        },
      },
    }),
    tanstackStartCookies(),
  ],
})

export type Session = typeof auth.$Infer.Session
