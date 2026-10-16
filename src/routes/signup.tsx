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
import { useAuthRefresh } from '@/hooks/use-auth-refresh'
import { errorMessage } from '@/lib/errors'
import { signUpFn } from '@/lib/fns/auth'
import { joinClassFn } from '@/lib/fns/classes'
import { USERNAME_MAX, USERNAME_MIN } from '@/lib/username'

export const Route = createFileRoute('/signup')({
  validateSearch: z.object({ code: z.string().optional() }),
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: '/portfolio' })
  },
  head: () => ({ meta: [{ title: 'Sign up · Nacho Stocks' }] }),
  component: Signup,
})

function Signup() {
  const { user } = Route.useRouteContext()
  const { code } = Route.useSearch()
  const navigate = useNavigate()
  const refresh = useAuthRefresh()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const email = String(f.get('email') ?? '').trim()
    const joinCode = String(f.get('code') ?? '').trim()
    setPending(true)
    setError(null)
    try {
      const result = await signUpFn({
        data: {
          username: String(f.get('username')),
          password: String(f.get('password')),
          email,
        },
      })
      if (!result.ok) {
        setError(result.error)
        return
      }
      if (joinCode) {
        const joined = await joinClassFn({ data: { code: joinCode } })
        if (joined.ok) toast.success(`Joined ${joined.data.name}`)
        else toast.error(joined.error)
      }
      if (email) toast.info(`Check ${email} to verify your email.`)
      await refresh()
      await navigate({ to: '/portfolio' })
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setPending(false)
    }
  }

  return (
    <PublicLayout user={user}>
      <div className="mx-auto max-w-sm px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>
              <h1>Create an account</h1>
            </CardTitle>
            <CardDescription>
              Free. Start with $10,000 in paper money.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form method="post" onSubmit={onSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    id="username"
                    name="username"
                    autoComplete="username"
                    minLength={USERNAME_MIN}
                    maxLength={USERNAME_MAX}
                    pattern="[a-zA-Z0-9_.]+"
                    required
                  />
                  <FieldDescription>
                    {USERNAME_MIN}-{USERNAME_MAX} letters, numbers, _ or .
                    Students: don’t use your real name.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <FieldDescription>At least 8 characters.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email (optional)</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                  />
                  <FieldDescription>
                    Lets you reset your password. Teachers need one to request a
                    classroom.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="code">Class code (optional)</FieldLabel>
                  <Input
                    id="code"
                    name="code"
                    defaultValue={code}
                    autoComplete="off"
                    className="uppercase"
                  />
                </Field>
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
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  )
}
