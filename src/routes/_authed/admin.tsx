import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import {
  Link,
  createFileRoute,
  notFound,
  useNavigate,
} from '@tanstack/react-router'
import { toast } from 'sonner'
import { DataTable, columnHelper } from '@/components/data-table'
import { PageHeader } from '@/components/page-header'
import { RequestStatus } from '@/components/request-status'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDebounced } from '@/hooks/use-debounced'
import { authClient } from '@/lib/auth-client'
import { errorMessage } from '@/lib/errors'
import {
  type AdminDashboard,
  approveRequestFn,
  createClassroomForFn,
  rejectRequestFn,
  searchUsersFn,
} from '@/lib/fns/admin'
import { adminDashboardQuery } from '@/lib/queries'

export const Route = createFileRoute('/_authed/admin')({
  beforeLoad: ({ context }) => {
    // Hide the page entirely from non-admins.
    if (!context.user.isAdmin) throw notFound()
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminDashboardQuery()),
  head: () => ({ meta: [{ title: 'Admin · Nacho Stocks' }] }),
  component: AdminPage,
})

type Request = AdminDashboard['requests'][number]
type Classroom = AdminDashboard['classrooms'][number]

function AdminPage() {
  const { data } = useSuspenseQuery(adminDashboardQuery())
  const pending = data.requests.filter((r) => r.status === 'pending')
  const reviewed = data.requests.filter((r) => r.status !== 'pending')

  return (
    <>
      <PageHeader
        title="Admin"
        description="Review classroom requests and support users."
      />
      <Tabs defaultValue="requests">
        <TabsList className="mb-6">
          <TabsTrigger value="requests">
            Requests
            {pending.length > 0 && (
              <Badge className="ml-1">{pending.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="requests" className="space-y-8">
          <section aria-labelledby="pending-heading" className="space-y-3">
            <h2 id="pending-heading" className="text-lg font-semibold">
              Pending
            </h2>
            {pending.length ? (
              <ul className="grid gap-4 md:grid-cols-2">
                {pending.map((r) => (
                  <li key={r.id}>
                    <PendingRequest request={r} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No pending requests.</p>
            )}
          </section>
          {reviewed.length > 0 && (
            <section aria-labelledby="reviewed-heading" className="space-y-3">
              <h2 id="reviewed-heading" className="text-lg font-semibold">
                Reviewed
              </h2>
              <DataTable
                columns={reviewedColumns}
                data={reviewed}
                caption="Reviewed classroom requests"
                pageSize={10}
              />
            </section>
          )}
        </TabsContent>
        <TabsContent value="classrooms" className="space-y-6">
          <CreateClassroom />
          <DataTable
            columns={classroomColumns}
            data={data.classrooms}
            caption="All classrooms"
            empty="No classrooms yet."
            pageSize={20}
          />
        </TabsContent>
        <TabsContent value="users">
          <UserSearch />
        </TabsContent>
      </Tabs>
    </>
  )
}

function useInvalidateAdmin() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['admin'] })
}

function PendingRequest({ request: r }: { request: Request }) {
  const invalidate = useInvalidateAdmin()
  const [rejecting, setRejecting] = useState(false)

  const approve = useMutation({
    mutationFn: () => approveRequestFn({ data: { requestId: r.id } }),
    onSuccess: async (result) => {
      if (!result.ok) return toast.error(result.error)
      toast.success(`Created “${r.className}” for @${r.username}`)
      await invalidate()
    },
    onError: (e) => toast.error(errorMessage(e)),
  })

  const reject = useMutation({
    mutationFn: (reason: string) =>
      rejectRequestFn({
        data: { requestId: r.id, reason: reason || undefined },
      }),
    onSuccess: async (result) => {
      if (!result.ok) return toast.error(result.error)
      toast.success('Request rejected')
      setRejecting(false)
      await invalidate()
    },
    onError: (e) => toast.error(errorMessage(e)),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3>{r.className}</h3>
        </CardTitle>
        <CardDescription>{r.schoolName}</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-muted-foreground">Teacher</dt>
          <dd>
            @{r.username} · {r.email}
          </dd>
          <dt className="text-muted-foreground">Students</dt>
          <dd>~{r.expectedStudents}</dd>
          <dt className="text-muted-foreground">Requested</dt>
          <dd>
            <time dateTime={r.createdAt}>
              {new Date(r.createdAt).toLocaleString()}
            </time>
          </dd>
        </dl>
        {r.message && (
          <blockquote className="mt-3 border-l-2 pl-3 text-sm text-muted-foreground">
            {r.message}
          </blockquote>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        <Button onClick={() => approve.mutate()} disabled={approve.isPending}>
          Approve
        </Button>
        <Button variant="outline" onClick={() => setRejecting(true)}>
          Reject
        </Button>
      </CardFooter>

      <Dialog open={rejecting} onOpenChange={setRejecting}>
        <DialogContent>
          <form
            method="post"
            onSubmit={(e) => {
              e.preventDefault()
              reject.mutate(
                String(new FormData(e.currentTarget).get('reason') ?? '')
              )
            }}
          >
            <DialogHeader>
              <DialogTitle>Reject “{r.className}”?</DialogTitle>
              <DialogDescription>
                @{r.username} gets an email. Add a reason if it helps them.
              </DialogDescription>
            </DialogHeader>
            <Field className="my-4">
              <FieldLabel htmlFor={`reason-${r.id}`}>
                Reason (optional)
              </FieldLabel>
              <Input id={`reason-${r.id}`} name="reason" maxLength={500} />
            </Field>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejecting(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={reject.isPending}
              >
                Reject
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

const req = columnHelper<Request>()
const reviewedColumns = [
  req.accessor('className', { header: 'Class' }),
  req.accessor('schoolName', { header: 'School' }),
  req.accessor('username', {
    header: 'Teacher',
    cell: (c) => `@${c.getValue()}`,
  }),
  req.accessor('status', {
    header: 'Status',
    cell: (c) => <RequestStatus status={c.getValue()} />,
  }),
  req.accessor('createdAt', {
    header: 'Requested',
    cell: (c) => new Date(c.getValue()).toLocaleDateString(),
  }),
]

const cls = columnHelper<Classroom>()
const classroomColumns = [
  cls.accessor('name', {
    header: 'Classroom',
    cell: (c) => (
      <Link
        to="/classes/$slug"
        params={{ slug: c.row.original.slug }}
        className="font-medium underline-offset-2 hover:underline"
      >
        {c.getValue()}
      </Link>
    ),
  }),
  cls.accessor('owner', {
    header: 'Owner',
    cell: (c) => (c.getValue() ? `@${c.getValue()}` : '—'),
  }),
  cls.accessor('students', { header: 'Students', meta: { align: 'right' } }),
  cls.accessor('createdAt', {
    header: 'Created',
    cell: (c) => new Date(c.getValue()).toLocaleDateString(),
  }),
]

function CreateClassroom() {
  const invalidate = useInvalidateAdmin()
  const [error, setError] = useState<string | null>(null)
  const create = useMutation({
    mutationFn: (data: { ownerIdentifier: string; name: string }) =>
      createClassroomForFn({ data }),
    onSuccess: async (result) => {
      if (!result.ok) return setError(result.error)
      toast.success('Classroom created')
      setError(null)
      await invalidate()
    },
    onError: (e) => setError(errorMessage(e)),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Create a classroom</h2>
        </CardTitle>
        <CardDescription>
          Skip the request flow, e.g. for testing or pilots.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          method="post"
          onSubmit={(e) => {
            e.preventDefault()
            const f = new FormData(e.currentTarget)
            create.mutate({
              ownerIdentifier: String(f.get('owner')),
              name: String(f.get('name')),
            })
          }}
        >
          <FieldGroup className="md:flex-row md:items-end">
            <Field>
              <FieldLabel htmlFor="owner">Owner username or email</FieldLabel>
              <Input id="owner" name="owner" required autoComplete="off" />
            </Field>
            <Field>
              <FieldLabel htmlFor="class-name">Class name</FieldLabel>
              <Input
                id="class-name"
                name="name"
                minLength={2}
                maxLength={60}
                required
              />
            </Field>
            <Button type="submit" disabled={create.isPending}>
              Create
            </Button>
          </FieldGroup>
          {error && (
            <FieldError role="alert" className="mt-2">
              {error}
            </FieldError>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

function UserSearch() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [input, setInput] = useState('')
  const q = useDebounced(input.trim(), 300)
  const { data = [], isFetching } = useQuery({
    queryKey: ['admin', 'users', q],
    queryFn: () => searchUsersFn({ data: { q } }),
    enabled: q.length > 0,
  })

  const columns = useMemo(() => {
    const u = columnHelper<(typeof data)[number]>()
    return [
      u.accessor('username', {
        header: 'Username',
        cell: (c) => `@${c.getValue()}`,
      }),
      u.accessor('email', {
        header: 'Email',
        cell: (c) =>
          c.getValue() ? (
            <span className="flex items-center gap-2">
              {c.getValue()}
              {!c.row.original.emailVerified && (
                <Badge variant="secondary">Unverified</Badge>
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      }),
      u.accessor('role', {
        header: 'Role',
        cell: (c) => (c.getValue() === 'admin' ? <Badge>Admin</Badge> : 'User'),
      }),
      u.display({
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: (c) =>
          c.row.original.role === 'admin' ? null : (
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                const { error } = await authClient.admin.impersonateUser({
                  userId: c.row.original.id,
                })
                if (error)
                  return toast.error(error.message ?? 'Could not impersonate.')
                queryClient.clear()
                await navigate({ to: '/portfolio', reloadDocument: true })
              }}
            >
              View as user
            </Button>
          ),
      }),
    ]
  }, [navigate, queryClient])

  return (
    <section aria-labelledby="users-heading" className="space-y-4">
      <h2 id="users-heading" className="sr-only">
        Users
      </h2>
      <search className="block max-w-md">
        <label htmlFor="user-search" className="sr-only">
          Search users
        </label>
        <Input
          id="user-search"
          type="search"
          placeholder="Search by username or email"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </search>
      {q && (
        <div aria-busy={isFetching}>
          <DataTable
            columns={columns}
            data={data}
            caption="User search results"
            empty="No users found."
          />
        </div>
      )}
    </section>
  )
}
