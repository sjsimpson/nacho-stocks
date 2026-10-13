import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { CopyIcon, RefreshCwIcon } from 'lucide-react'
import { toast } from 'sonner'
import { DataTable, columnHelper } from '@/components/data-table'
import { Change } from '@/components/money'
import { NotFound } from '@/components/not-found'
import { PageHeader } from '@/components/page-header'
import { StudentActions } from '@/components/student-actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type ClassDashboard, regenerateJoinCodeFn } from '@/lib/fns/classes'
import { formatCents } from '@/lib/money'
import { classDashboardQuery } from '@/lib/queries'

export const Route = createFileRoute('/_authed/classes/$slug/')({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(
      classDashboardQuery(params.slug)
    )
    if (!data) throw notFound()
    return { title: data.class.name }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? 'Class'} · Nacho Stocks` }],
  }),
  notFoundComponent: () => (
    <NotFound message="That class doesn’t exist or isn’t yours." />
  ),
  component: ClassPage,
})

type Row = ClassDashboard['roster'][number]

function useColumns(organizationId: string, slug: string) {
  const col = columnHelper<Row>()
  return [
    col.accessor((r) => r.displayUsername ?? r.username ?? '', {
      id: 'username',
      header: 'Student',
      cell: (c) => (
        <Link
          to="/classes/$slug/students/$userId"
          params={{ slug, userId: c.row.original.userId }}
          className="font-medium underline-offset-2 hover:underline"
        >
          @{c.getValue()}
        </Link>
      ),
    }),
    col.accessor('totalCents', {
      header: 'Total value',
      meta: { align: 'right' },
      cell: (c) => formatCents(c.getValue()),
    }),
    col.accessor('returnRatio', {
      header: 'Return',
      meta: { align: 'right' },
      cell: (c) => <Change ratio={c.getValue()} />,
    }),
    col.accessor('cashCents', {
      header: 'Cash',
      meta: { align: 'right' },
      cell: (c) => formatCents(c.getValue()),
    }),
    col.accessor('holdingsCents', {
      header: 'Stocks',
      meta: { align: 'right' },
      cell: (c) => formatCents(c.getValue()),
    }),
    col.display({
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: (c) => (
        <StudentActions
          member={c.row.original}
          organizationId={organizationId}
          slug={slug}
        />
      ),
    }),
  ]
}

function ClassPage() {
  const { slug } = Route.useParams()
  const queryClient = useQueryClient()
  const { data } = useSuspenseQuery(classDashboardQuery(slug))
  const cls = data!.class
  const students = data!.roster.filter((m) => m.role === 'member')
  const teachers = data!.roster.filter((m) => m.role !== 'member')
  const columns = useColumns(cls.id, slug)

  const regenerate = useMutation({
    mutationFn: () =>
      regenerateJoinCodeFn({ data: { organizationId: cls.id } }),
    onSuccess: async (r) => {
      if (!r.ok) return toast.error(r.error)
      toast.success('New join code created. The old code no longer works.')
      await queryClient.invalidateQueries({ queryKey: ['classes', slug] })
    },
  })

  const joinUrl =
    typeof window === 'undefined'
      ? ''
      : `${window.location.origin}/signup?code=${cls.joinCode}`

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mb-2 text-sm text-muted-foreground"
      >
        <Link to="/classes" className="hover:underline">
          Classes
        </Link>
      </nav>
      <PageHeader
        title={cls.name}
        description={`${students.length} ${students.length === 1 ? 'student' : 'students'}`}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <section aria-labelledby="roster-heading" className="min-w-0 space-y-3">
          <h2 id="roster-heading" className="text-lg font-semibold">
            Students
          </h2>
          <DataTable
            columns={columns}
            data={students}
            caption={`Students in ${cls.name}`}
            empty="No students yet. Share the join code to get started."
            initialSorting={[{ id: 'totalCents', desc: true }]}
          />
        </section>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <h2>Join code</h2>
              </CardTitle>
              <CardDescription>
                Students enter this when they sign up.
              </CardDescription>
              <CardAction>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Create a new join code"
                  disabled={regenerate.isPending}
                  onClick={() => regenerate.mutate()}
                >
                  <RefreshCwIcon />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-center font-mono text-3xl font-semibold tracking-[0.3em]">
                {cls.joinCode}
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={async () => {
                  await navigator.clipboard.writeText(joinUrl)
                  toast.success('Signup link copied')
                }}
              >
                <CopyIcon /> Copy signup link
              </Button>
            </CardContent>
          </Card>

          <section aria-labelledby="teachers-heading">
            <h2 id="teachers-heading" className="mb-2 font-semibold">
              Teachers
            </h2>
            <ul className="space-y-2">
              {teachers.map((t) => (
                <li
                  key={t.memberId}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="flex-1 truncate">{t.name}</span>
                  <Badge variant="secondary">
                    {t.role === 'owner' ? 'Owner' : 'Co-teacher'}
                  </Badge>
                  {data!.myRole === 'owner' && t.role !== 'owner' && (
                    <StudentActions
                      member={t}
                      organizationId={cls.id}
                      slug={slug}
                    />
                  )}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </>
  )
}
