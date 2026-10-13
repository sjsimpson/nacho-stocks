import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from './auth'

export async function getSession() {
  return auth.api.getSession({ headers: getRequestHeaders() })
}

/** Server fn middleware: rejects anonymous calls, adds `user` to context. */
export const authed = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const session = await getSession()
    if (!session) throw new Error('Not signed in.')
    return next({ context: { user: session.user } })
  }
)
