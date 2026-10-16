import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NotFound } from '@/components/not-found'
import { sessionQuery } from '@/lib/queries'
import appCss from '../styles.css?url'

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => ({
    user: await context.queryClient.fetchQuery(sessionQuery()),
  }),
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Nacho Stocks' },
      {
        name: 'description',
        content: 'Practice investing with paper money. Built for classrooms.',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
