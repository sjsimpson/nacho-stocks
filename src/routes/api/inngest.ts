import { createFileRoute } from '@tanstack/react-router'
import { serve } from 'inngest/edge'
import { functions, inngest } from '@/lib/server/jobs'

const handler = serve({ client: inngest, functions })

export const Route = createFileRoute('/api/inngest')({
  server: {
    handlers: {
      GET: ({ request }) => handler(request),
      POST: ({ request }) => handler(request),
      PUT: ({ request }) => handler(request),
    },
  },
})
