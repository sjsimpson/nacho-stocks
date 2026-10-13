import { createFileRoute } from '@tanstack/react-router'

// Imported lazily so server-only code stays out of the client route tree.
const getHandler = async () => {
  const [{ serve }, { functions, inngest }] = await Promise.all([
    import('inngest/edge'),
    import('@/lib/server/jobs'),
  ])
  return serve({ client: inngest, functions })
}

export const Route = createFileRoute('/api/inngest')({
  server: {
    handlers: {
      GET: async ({ request }) => (await getHandler())(request),
      POST: async ({ request }) => (await getHandler())(request),
      PUT: async ({ request }) => (await getHandler())(request),
    },
  },
})
