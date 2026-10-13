import { betterAuth } from 'better-auth'
import { APIError } from 'better-auth/api'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins/admin'
import { organization } from 'better-auth/plugins/organization'
import { username } from 'better-auth/plugins/username'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { and, count, eq } from 'drizzle-orm'
import { db, schema } from '@/db'
import { MAX_CLASSES_PER_STUDENT, STARTING_CASH_CENTS } from '@/lib/constants'
import { USERNAME_MAX, USERNAME_MIN, checkUsername } from '@/lib/username'
import { sendEmail } from './email'
import * as templates from './email/templates'
import { env } from './env'

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: ({ user, url }) =>
      sendEmail({ to: user.email, ...templates.resetPassword(url) }),
  },
  emailVerification: {
    // Placeholder student addresses are skipped inside sendEmail.
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: ({ user, url }) =>
      sendEmail({ to: user.email, ...templates.verifyEmail(url) }),
  },
  user: {
    // Students without an email can add one later. Unverified (placeholder)
    // addresses are replaced directly; verified ones need confirmation.
    changeEmail: { enabled: true, updateEmailWithoutVerification: true },
    additionalFields: {
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
    admin(),
    organization({
      // Classrooms are created only by admins approving a request (server
      // calls without a session count as system actions and skip this check).
      allowUserToCreateOrganization: false,
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
