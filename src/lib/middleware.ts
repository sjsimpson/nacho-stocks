import { createMiddleware } from '@tanstack/react-start'
import { getSession } from '@/lib/server/session'

// Kept apart from server modules: the client bundle imports this file, and the
// Start compiler strips the `.server()` body (and its server imports) there.

/** Server fn middleware: rejects anonymous calls, adds `user` to context. */
export const authed = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const session = await getSession()
    if (!session) throw new Error('Not signed in.')
    return next({ context: { user: session.user } })
  }
)
