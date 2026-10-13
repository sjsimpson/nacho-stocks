import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { errorMessage } from '@/lib/errors'
import { createClassFn } from '@/lib/fns/classes'
import { myClassesQuery } from '@/lib/queries'

export const Route = createFileRoute('/_authed/classes/')({
  beforeLoad: ({ context }) => {
    if (context.user.accountType !== 'teacher') throw redirect({ to: '/join' })
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(myClassesQuery()),
  head: () => ({ meta: [{ title: 'Classes · Nacho Stocks' }] }),
  component: ClassesPage,
})

function ClassesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: classes } = useSuspenseQuery(myClassesQuery())
  const [error, setError] = useState<string | null>(null)

  const create = useMutation({
    mutationFn: (name: string) => createClassFn({ data: { name } }),
    onSuccess: async (result) => {
      if (!result.ok) return setError(result.error)
      await queryClient.invalidateQueries({ queryKey: ['classes'] })
      await navigate({
        to: '/classes/$slug',
        params: { slug: result.data.slug },
      })
    },
    onError: (e) => setError(errorMessage(e)),
  })

  return (
    <>
      <PageHeader
        title="Classes"
        description="Create a class and share its code with students."
      />
      <div className="grid gap-6 md:grid-cols-[1fr_20rem]">
        <section aria-labelledby="class-list">
          <h2 id="class-list" className="sr-only">
            Your classes
          </h2>
          {classes.length ? (
            <ul className="divide-y rounded-lg border">
              {classes.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/classes/$slug"
                    params={{ slug: c.slug }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50"
                  >
                    <span className="flex-1 font-medium">{c.name}</span>
                    {c.role === 'owner' && (
                      <Badge variant="secondary">Owner</Badge>
                    )}
                    <ChevronRightIcon
                      aria-hidden
                      className="size-4 text-muted-foreground"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No classes yet. Create your first one.
            </p>
          )}
        </section>
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>New class</h2>
            </CardTitle>
            <CardDescription>For example “Period 3 Economics”.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              method="post"
              onSubmit={(e) => {
                e.preventDefault()
                setError(null)
                create.mutate(String(new FormData(e.currentTarget).get('name')))
              }}
            >
              <FieldGroup>
                <Field data-invalid={!!error}>
                  <FieldLabel htmlFor="class-name">Class name</FieldLabel>
                  <Input
                    id="class-name"
                    name="name"
                    minLength={2}
                    maxLength={60}
                    required
                    aria-invalid={!!error}
                  />
                  {error && <FieldError role="alert">{error}</FieldError>}
                </Field>
                <Button type="submit" disabled={create.isPending}>
                  {create.isPending ? 'Creating…' : 'Create class'}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
