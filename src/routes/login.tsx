import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useState } from 'react'
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuthRefresh } from '@/hooks/use-auth-refresh'
import { authClient } from '@/lib/auth-client'

const searchSchema = z.object({ redirect: z.string().optional() })

/** Only allow same-site redirects. */
const safeRedirect = (to?: string) =>
  to && to.startsWith('/') && !to.startsWith('//') ? to : '/portfolio'

export const Route = createFileRoute('/login')({
  validateSearch: searchSchema,
  beforeLoad: ({ context, search }) => {
    if (context.user) throw redirect({ href: safeRedirect(search.redirect) })
  },
  head: () => ({ meta: [{ title: 'Log in · Nacho Stocks' }] }),
  component: Login,
})

function Login() {
  const { user } = Route.useRouteContext()
  const { redirect: to } = Route.useSearch()
  const navigate = useNavigate()
  const refresh = useAuthRefresh()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const identifier = String(form.get('identifier')).trim()
    const password = String(form.get('password'))
    setPending(true)
    setError(null)
    const result = identifier.includes('@')
      ? await authClient.signIn.email({ email: identifier, password })
      : await authClient.signIn.username({ username: identifier, password })
    setPending(false)
    if (result.error) {
      // Only bad credentials get the generic message; surface anything else
      // (origin, rate limit, server error) so it can be diagnosed.
      setError(
        result.error.status === 401
          ? 'Wrong username or password.'
          : (result.error.message ?? 'Could not log in. Try again.')
      )
      return
    }
    await refresh()
    await navigate({ href: safeRedirect(to) })
  }

  return (
    <PublicLayout user={user}>
      <div className="mx-auto max-w-sm px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>
              <h1>Log in</h1>
            </CardTitle>
            <CardDescription>Use your username or email.</CardDescription>
          </CardHeader>
          <CardContent>
            <form method="post" onSubmit={onSubmit} noValidate>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="identifier">
                    Username or email
                  </FieldLabel>
                  <Input
                    id="identifier"
                    name="identifier"
                    autoComplete="username"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </Field>
                {error && <FieldError role="alert">{error}</FieldError>}
                <Button type="submit" disabled={pending}>
                  {pending ? 'Logging in…' : 'Log in'}
                </Button>
                <p className="text-center text-sm">
                  <Link
                    to="/forgot-password"
                    className="underline underline-offset-2"
                  >
                    Forgot your password?
                  </Link>
                </p>
                <p className="text-center text-sm">
                  New here?{' '}
                  <Link to="/signup" className="underline underline-offset-2">
                    Sign up
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
