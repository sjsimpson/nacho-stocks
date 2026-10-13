import { createFileRoute } from '@tanstack/react-router'

// Accounts are created only through our signup server functions, which set
// accountType server-side. Block BetterAuth's public signup endpoint.
const BLOCKED = ['/sign-up/email']

// Imported lazily so server-only code stays out of the client route tree.
const getAuth = () => import('@/lib/server/auth').then((m) => m.auth)

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }) => (await getAuth()).handler(request),
      POST: async ({ request }) => {
        const { pathname } = new URL(request.url)
        if (BLOCKED.some((p) => pathname.endsWith(p))) {
          return new Response('Use the signup page.', { status: 403 })
        }
        return (await getAuth()).handler(request)
      },
    },
  },
})
