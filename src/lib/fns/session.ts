import { createServerFn } from '@tanstack/react-start'
import { countTeaching } from '@/lib/server/classes'
import { isPlaceholderEmail } from '@/lib/server/email'
import { getSession } from '@/lib/server/session'

/** Current user or null. Used by route `beforeLoad` guards. */
export const fetchSessionUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSession()
    if (!session) return null
    const u = session.user
    return {
      id: u.id,
      name: u.name,
      username: u.username ?? null,
      displayUsername: u.displayUsername ?? null,
      /** Null for students who signed up without an email. */
      email: isPlaceholderEmail(u.email) ? null : u.email,
      emailVerified: u.emailVerified,
      isAdmin: u.role === 'admin',
      /** Number of classrooms this user owns or co-teaches. */
      teaching: await countTeaching(u.id),
      impersonating: Boolean(session.session.impersonatedBy),
    }
  }
)

export type SessionUser = NonNullable<
  Awaited<ReturnType<typeof fetchSessionUser>>
>
