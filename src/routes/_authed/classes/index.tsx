import { Link, createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ChevronRightIcon } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { RequestStatus } from '@/components/request-status'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { myClassesQuery, myRequestsQuery } from '@/lib/queries'

export const Route = createFileRoute('/_authed/classes/')({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(myClassesQuery()),
      context.queryClient.ensureQueryData(myRequestsQuery()),
    ]),
  head: () => ({ meta: [{ title: 'Classrooms · Nacho Stocks' }] }),
  component: ClassesPage,
})

function ClassesPage() {
  const { data: all } = useSuspenseQuery(myClassesQuery())
  const { data: requests } = useSuspenseQuery(myRequestsQuery())
  const teaching = all.filter((c) => c.role !== 'member')
  const hasPending = requests.some((r) => r.status === 'pending')

  return (
    <>
      <PageHeader
        title="Classrooms I teach"
        description="See your students’ portfolios and manage your classrooms."
        actions={
          !hasPending && (
            <Button
              nativeButton={false}
              render={<Link to="/classes/request" />}
            >
              Request a classroom
            </Button>
          )
        }
      />

      <div className="max-w-3xl space-y-8">
        <section aria-labelledby="teaching-heading">
          <h2 id="teaching-heading" className="sr-only">
            Your classrooms
          </h2>
          {teaching.length ? (
            <ul className="divide-y rounded-lg border">
              {teaching.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/classes/$slug"
                    params={{ slug: c.slug }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50"
                  >
                    <span className="flex-1 font-medium">{c.name}</span>
                    <Badge variant="secondary">
                      {c.role === 'owner' ? 'Owner' : 'Co-teacher'}
                    </Badge>
                    <ChevronRightIcon
                      aria-hidden
                      className="size-4 text-muted-foreground"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="font-medium">You don’t teach any classrooms yet.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Teachers can request a classroom. We review each request to keep
                students safe.
              </p>
            </div>
          )}
        </section>

        {requests.length > 0 && (
          <section aria-labelledby="requests-heading" className="space-y-3">
            <h2 id="requests-heading" className="text-lg font-semibold">
              Your requests
            </h2>
            <ul className="divide-y rounded-lg border">
              {requests.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center gap-3 px-4 py-3"
                >
                  <div className="flex-1">
                    <p className="font-medium">{r.className}</p>
                    <p className="text-sm text-muted-foreground">
                      {r.schoolName} ·{' '}
                      <time dateTime={r.createdAt}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </time>
                    </p>
                    {r.rejectionReason && (
                      <p className="text-sm text-muted-foreground">
                        {r.rejectionReason}
                      </p>
                    )}
                  </div>
                  <RequestStatus status={r.status} />
                  {r.slug && (
                    <Button
                      size="sm"
                      variant="outline"
                      nativeButton={false}
                      render={
                        <Link to="/classes/$slug" params={{ slug: r.slug }} />
                      }
                    >
                      Open
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  )
}
