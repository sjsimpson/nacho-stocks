import { Link, createFileRoute } from '@tanstack/react-router'
import { LineChartIcon, ShieldCheckIcon, UsersIcon } from 'lucide-react'
import { PublicLayout } from '@/components/public-layout'
import { Button } from '@/components/ui/button'
import { formatCents } from '@/lib/money'
import { STARTING_CASH_CENTS } from '@/lib/constants'

export const Route = createFileRoute('/')({ component: Home })

const features = [
  {
    icon: LineChartIcon,
    title: 'Real market prices',
    body: 'Trade real US stocks at delayed market prices with play money.',
  },
  {
    icon: UsersIcon,
    title: 'Built for classrooms',
    body: 'Teachers create a class, share a join code, and follow every student’s portfolio.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'No email needed',
    body: 'Students sign up with a username only. Teachers can reset passwords.',
  },
]

function Home() {
  const { user } = Route.useRouteContext()
  return (
    <PublicLayout user={user}>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Learn to invest without the risk
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start with {formatCents(STARTING_CASH_CENTS)} in paper money. Buy,
          sell, and watch your portfolio grow.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          {user ? (
            <Button
              size="lg"
              nativeButton={false}
              render={<Link to="/portfolio" />}
            >
              Go to my portfolio
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                nativeButton={false}
                render={<Link to="/signup" />}
              >
                Get started
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<Link to="/login" />}
              >
                Log in
              </Button>
            </>
          )}
        </div>
      </section>
      <section
        aria-labelledby="features"
        className="mx-auto max-w-5xl px-4 pb-20"
      >
        <h2 id="features" className="sr-only">
          Features
        </h2>
        <ul className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <li key={f.title} className="rounded-xl border p-6">
              <f.icon aria-hidden className="mb-3 size-6 text-primary" />
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </PublicLayout>
  )
}
