import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { NotFound } from '@/components/not-found'
import { PageHeader } from '@/components/page-header'
import { PortfolioView } from '@/components/portfolio-view'
import { studentPortfolioQuery } from '@/lib/queries'

export const Route = createFileRoute('/_authed/classes/$slug/students/$userId')(
  {
    loader: async ({ context, params }) => {
      const data = await context.queryClient.ensureQueryData(
        studentPortfolioQuery(params.slug, params.userId)
      )
      if (!data) throw notFound()
      return {
        title: `@${data.student.displayUsername ?? data.student.username}`,
      }
    },
    head: ({ loaderData }) => ({
      meta: [{ title: `${loaderData?.title ?? 'Student'} · Nacho Stocks` }],
    }),
    notFoundComponent: () => (
      <NotFound message="That student isn’t in this class." />
    ),
    component: StudentPage,
  }
)

function StudentPage() {
  const { slug, userId } = Route.useParams()
  const { data } = useSuspenseQuery(studentPortfolioQuery(slug, userId))
  if (!data) return null
  const handle = `@${data.student.displayUsername ?? data.student.username}`

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mb-2 text-sm text-muted-foreground"
      >
        <ol className="flex gap-1">
          <li>
            <Link to="/classes" className="hover:underline">
              Classes
            </Link>
            <span aria-hidden> /</span>
          </li>
          <li>
            <Link
              to="/classes/$slug"
              params={{ slug }}
              className="hover:underline"
            >
              {data.class.name}
            </Link>
          </li>
        </ol>
      </nav>
      <PageHeader
        title={handle}
        description="Read-only view of this student’s portfolio."
      />
      <PortfolioView
        portfolio={data.portfolio}
        history={data.history}
        owner={`${handle}’s`}
      />
    </>
  )
}
