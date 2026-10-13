import { createServerFn } from '@tanstack/react-start'
import { getSession } from '@/lib/server/session'

/** Current user or null. Used by route `beforeLoad` guards. */
export const fetchSessionUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSession()
    if (!session) return null
    const { id, name, username, displayUsername, email, accountType } =
      session.user
    return {
      id,
      name,
      username: username ?? null,
      displayUsername: displayUsername ?? null,
      email: email.endsWith('.invalid') ? null : email,
      accountType: accountType as 'student' | 'teacher',
    }
  }
)

export type SessionUser = NonNullable<
  Awaited<ReturnType<typeof fetchSessionUser>>
>
