import { createFileRoute } from '@tanstack/react-router'
import { PublicLayout } from '@/components/public-layout'

export const Route = createFileRoute('/about')({
  head: () => ({ meta: [{ title: 'About · Nacho Stocks' }] }),
  component: About,
})

function About() {
  const { user } = Route.useRouteContext()
  return (
    <PublicLayout user={user}>
      <article className="mx-auto max-w-2xl space-y-4 px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">
          About Nacho Stocks
        </h1>
        <p>
          Nacho Stocks is a paper-trading playground. It started as a personal
          project for people who are nervous about trading stocks and want a
          safe place to practice.
        </p>
        <p>
          It is now built for financial education. Teachers create a class and
          share a join code. Students trade with play money, and teachers can
          follow each student’s portfolio.
        </p>
        <p className="text-sm text-muted-foreground">
          Prices are delayed and for learning only. Nothing here is investment
          advice.
        </p>
      </article>
    </PublicLayout>
  )
}
