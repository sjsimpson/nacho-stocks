import { createFileRoute, redirect } from '@tanstack/react-router'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/page-header'
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
import { MAX_CLASSES_PER_STUDENT } from '@/lib/constants'
import { errorMessage } from '@/lib/errors'
import { joinClassFn } from '@/lib/fns/classes'
import { myClassesQuery } from '@/lib/queries'

export const Route = createFileRoute('/_authed/join')({
  beforeLoad: ({ context }) => {
    if (context.user.accountType === 'teacher')
      throw redirect({ to: '/classes' })
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(myClassesQuery()),
  head: () => ({ meta: [{ title: 'My class · Nacho Stocks' }] }),
  component: JoinPage,
})

function JoinPage() {
  const queryClient = useQueryClient()
  const { data: classes } = useSuspenseQuery(myClassesQuery())
  const [error, setError] = useState<string | null>(null)
  const canJoin = classes.length < MAX_CLASSES_PER_STUDENT

  const join = useMutation({
    mutationFn: (code: string) => joinClassFn({ data: { code } }),
    onSuccess: async (result) => {
      if (!result.ok) return setError(result.error)
      toast.success(`Joined ${result.data.name}`)
      await queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
    onError: (e) => setError(errorMessage(e)),
  })

  return (
    <>
      <PageHeader
        title="My class"
        description="Your teacher can see your portfolio once you join their class."
      />
      <div className="grid max-w-3xl gap-6 md:grid-cols-2">
        {classes.length > 0 && (
          <section aria-labelledby="my-classes">
            <h2 id="my-classes" className="mb-3 text-lg font-semibold">
              {classes.length === 1 ? 'Your class' : 'Your classes'}
            </h2>
            <ul className="space-y-2">
              {classes.map((c) => (
                <li
                  key={c.id}
                  className="rounded-lg border px-4 py-3 font-medium"
                >
                  {c.name}
                </li>
              ))}
            </ul>
          </section>
        )}
        {canJoin && (
          <Card>
            <CardHeader>
              <CardTitle>
                <h2>Join a class</h2>
              </CardTitle>
              <CardDescription>
                Enter the code your teacher gave you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setError(null)
                  join.mutate(String(new FormData(e.currentTarget).get('code')))
                }}
              >
                <FieldGroup>
                  <Field data-invalid={!!error}>
                    <FieldLabel htmlFor="code">Class code</FieldLabel>
                    <Input
                      id="code"
                      name="code"
                      autoComplete="off"
                      className="font-mono tracking-widest uppercase"
                      required
                      aria-invalid={!!error}
                    />
                    {error && <FieldError role="alert">{error}</FieldError>}
                  </Field>
                  <Button type="submit" disabled={join.isPending}>
                    {join.isPending ? 'Joining…' : 'Join class'}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
