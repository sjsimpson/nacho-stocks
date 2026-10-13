import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { PublicLayout } from '@/components/public-layout'
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthRefresh } from '@/hooks/use-auth-refresh'
import { signUpStudent, signUpTeacher } from '@/lib/fns/auth'
import { joinClassFn } from '@/lib/fns/classes'
import { errorMessage } from '@/lib/errors'
import { USERNAME_MAX, USERNAME_MIN } from '@/lib/username'

const search = z.object({
  as: z.enum(['student', 'teacher']).optional(),
  code: z.string().optional(),
})

export const Route = createFileRoute('/signup')({
  validateSearch: search,
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: '/portfolio' })
  },
  head: () => ({ meta: [{ title: 'Sign up · Nacho Stocks' }] }),
  component: Signup,
})

function Signup() {
  const { user } = Route.useRouteContext()
  const { as = 'student', code } = Route.useSearch()
  const navigate = useNavigate()
  const refresh = useAuthRefresh()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function submit(
    run: () => Promise<{ ok: boolean; error?: string }>,
    joinCode?: string
  ) {
    setPending(true)
    setError(null)
    try {
      const result = await run()
      if (!result.ok) {
        setError(result.error ?? 'Could not sign up.')
        return
      }
      if (joinCode) {
        const joined = await joinClassFn({ data: { code: joinCode } })
        if (joined.ok) toast.success(`Joined ${joined.data.name}`)
        else toast.error(joined.error)
      }
      await refresh()
      await navigate({ to: '/portfolio' })
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setPending(false)
    }
  }

  function onStudent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const joinCode = String(f.get('code') ?? '').trim()
    void submit(
      () =>
        signUpStudent({
          data: {
            username: String(f.get('username')),
            password: String(f.get('password')),
          },
        }),
      joinCode || undefined
    )
  }

  function onTeacher(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    void submit(() =>
      signUpTeacher({
        data: {
          name: String(f.get('name')),
          email: String(f.get('email')),
          username: String(f.get('username')),
          password: String(f.get('password')),
        },
      })
    )
  }

  const usernameField = (id: string) => (
    <Field>
      <FieldLabel htmlFor={id}>Username</FieldLabel>
      <Input
        id={id}
        name="username"
        autoComplete="username"
        minLength={USERNAME_MIN}
        maxLength={USERNAME_MAX}
        pattern="[a-zA-Z0-9_.]+"
        required
      />
      <FieldDescription>
        {USERNAME_MIN}-{USERNAME_MAX} letters, numbers, _ or . Don’t use your
        real name.
      </FieldDescription>
    </Field>
  )

  const passwordField = (id: string) => (
    <Field>
      <FieldLabel htmlFor={id}>Password</FieldLabel>
      <Input
        id={id}
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <FieldDescription>At least 8 characters.</FieldDescription>
    </Field>
  )

  const footer = (
    <>
      {error && <FieldError role="alert">{error}</FieldError>}
      <Button type="submit" disabled={pending}>
        {pending ? 'Creating account…' : 'Create account'}
      </Button>
      <p className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="underline underline-offset-2">
          Log in
        </Link>
      </p>
    </>
  )

  return (
    <PublicLayout user={user}>
      <div className="mx-auto max-w-sm px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>
              <h1>Create an account</h1>
            </CardTitle>
            <CardDescription>Students don’t need an email.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={as} onValueChange={() => setError(null)}>
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="teacher">Teacher</TabsTrigger>
              </TabsList>
              <TabsContent value="student">
                <form onSubmit={onStudent}>
                  <FieldGroup>
                    {usernameField('student-username')}
                    {passwordField('student-password')}
                    <Field>
                      <FieldLabel htmlFor="code">
                        Class code (optional)
                      </FieldLabel>
                      <Input
                        id="code"
                        name="code"
                        defaultValue={code}
                        autoComplete="off"
                        className="uppercase"
                      />
                    </Field>
                    {footer}
                  </FieldGroup>
                </form>
              </TabsContent>
              <TabsContent value="teacher">
                <form onSubmit={onTeacher}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="name">Full name</FieldLabel>
                      <Input
                        id="name"
                        name="name"
                        autoComplete="name"
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="email">School email</FieldLabel>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                      />
                    </Field>
                    {usernameField('teacher-username')}
                    {passwordField('teacher-password')}
                    {footer}
                  </FieldGroup>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  )
}
