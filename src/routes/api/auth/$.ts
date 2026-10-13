import { createFileRoute } from '@tanstack/react-router'
import { auth } from '@/lib/server/auth'

// Accounts are created only through our signup server functions, which set
// accountType server-side. Block BetterAuth's public signup endpoint.
const BLOCKED = ['/sign-up/email']

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => auth.handler(request),
      POST: ({ request }) => {
        const { pathname } = new URL(request.url)
        if (BLOCKED.some((p) => pathname.endsWith(p))) {
          return new Response('Use the signup page.', { status: 403 })
        }
        return auth.handler(request)
      },
    },
  },
})
