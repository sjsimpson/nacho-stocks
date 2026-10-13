import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { PublicLayout } from '@/components/public-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/reset-password')({
  validateSearch: z.object({
    token: z.string().optional(),
    error: z.string().optional(),
  }),
  head: () => ({ meta: [{ title: 'Reset password · Nacho Stocks' }] }),
  component: ResetPassword,
})

function ResetPassword() {
  const { user } = Route.useRouteContext()
  const { token, error: linkError } = Route.useSearch()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const newPassword = String(f.get('password'))
    if (newPassword !== String(f.get('confirm'))) {
      return setError('Passwords don’t match.')
    }
    setPending(true)
    setError(null)
    const result = await authClient.resetPassword({
      newPassword,
      token: token!,
    })
    setPending(false)
    if (result.error) {
      return setError(result.error.message ?? 'Could not reset password.')
    }
    toast.success('Password reset. Log in with your new password.')
    await navigate({ to: '/login' })
  }

  const invalid = !token || linkError

  return (
    <PublicLayout user={user}>
      <div className="mx-auto max-w-sm px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>
              <h1>Choose a new password</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invalid ? (
              <p>
                This reset link is invalid or expired.{' '}
                <Link
                  to="/forgot-password"
                  className="underline underline-offset-2"
                >
                  Request a new one
                </Link>
                .
              </p>
            ) : (
              <form method="post" onSubmit={onSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="password">New password</FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                  </Field>
                  <Field data-invalid={!!error}>
                    <FieldLabel htmlFor="confirm">Confirm password</FieldLabel>
                    <Input
                      id="confirm"
                      name="confirm"
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                    {error && <FieldError role="alert">{error}</FieldError>}
                  </Field>
                  <Button type="submit" disabled={pending}>
                    Reset password
                  </Button>
                </FieldGroup>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  )
}
