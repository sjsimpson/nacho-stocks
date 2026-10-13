import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { errorMessage } from '@/lib/errors'
import { requestClassroomFn } from '@/lib/fns/admin'

export const Route = createFileRoute('/_authed/classes/request')({
  head: () => ({ meta: [{ title: 'Request a classroom · Nacho Stocks' }] }),
  component: RequestPage,
})

function RequestPage() {
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const submit = useMutation({
    mutationFn: (data: Parameters<typeof requestClassroomFn>[0]['data']) =>
      requestClassroomFn({ data }),
    onSuccess: async (result) => {
      if (!result.ok) return setError(result.error)
      toast.success('Request sent. We’ll email you when it’s reviewed.')
      await queryClient.invalidateQueries({ queryKey: ['classroom-requests'] })
      await navigate({ to: '/classes' })
    },
    onError: (e) => setError(errorMessage(e)),
  })

  const blocked = !user.email
    ? 'Add an email address to your account first. We use it to tell you when your classroom is ready.'
    : !user.emailVerified
      ? `Verify ${user.email} first. Check your inbox for the link.`
      : null

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mb-2 text-sm text-muted-foreground"
      >
        <Link to="/classes" className="hover:underline">
          Classrooms
        </Link>
      </nav>
      <PageHeader
        title="Request a classroom"
        description="Tell us about your class. We review requests to make sure classrooms are run by real teachers."
      />
      <Card className="max-w-xl">
        <CardContent>
          {blocked ? (
            <div className="space-y-4">
              <p>{blocked}</p>
              {!user.email && (
                <Button nativeButton={false} render={<Link to="/account" />}>
                  Add an email
                </Button>
              )}
            </div>
          ) : (
            <form
              method="post"
              onSubmit={(e) => {
                e.preventDefault()
                setError(null)
                const f = new FormData(e.currentTarget)
                submit.mutate({
                  schoolName: String(f.get('schoolName')),
                  className: String(f.get('className')),
                  expectedStudents: Number(f.get('expectedStudents')),
                  message: String(f.get('message') ?? '') || undefined,
                })
              }}
            >
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="schoolName">School</FieldLabel>
                  <Input
                    id="schoolName"
                    name="schoolName"
                    autoComplete="organization"
                    maxLength={120}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="className">Class name</FieldLabel>
                  <Input
                    id="className"
                    name="className"
                    placeholder="Period 3 Economics"
                    maxLength={60}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="expectedStudents">
                    About how many students?
                  </FieldLabel>
                  <Input
                    id="expectedStudents"
                    name="expectedStudents"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={500}
                    required
                    className="max-w-32"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="message">
                    Anything else? (optional)
                  </FieldLabel>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    maxLength={1000}
                    className="rounded-lg border bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                  <FieldDescription>
                    Grade level, course, or how you plan to use it.
                  </FieldDescription>
                </Field>
                {error && <FieldError role="alert">{error}</FieldError>}
                <Button type="submit" disabled={submit.isPending}>
                  {submit.isPending ? 'Sending…' : 'Send request'}
                </Button>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </>
  )
}
