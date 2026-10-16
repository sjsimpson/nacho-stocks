import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PublicLayout } from '@/components/public-layout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/forgot-password')({
  head: () => ({ meta: [{ title: 'Forgot password · Nacho Stocks' }] }),
  component: ForgotPassword,
})

function ForgotPassword() {
  const { user } = Route.useRouteContext()
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = String(new FormData(e.currentTarget).get('email')).trim()
    setPending(true)
    // Same response whether or not the account exists, to avoid leaking emails.
    await authClient.requestPasswordReset({
      email,
      redirectTo: '/reset-password',
    })
    setPending(false)
    setSentTo(email)
  }

  return (
    <PublicLayout user={user}>
      <div className="mx-auto max-w-sm px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>
              <h1>Forgot your password?</h1>
            </CardTitle>
            <CardDescription>
              We’ll email you a reset link. No email on your account? Ask your
              teacher to reset it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sentTo ? (
              <p role="status">
                If an account uses <strong>{sentTo}</strong>, a reset link is on
                its way.
              </p>
            ) : (
              <form method="post" onSubmit={onSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                    />
                  </Field>
                  <Button type="submit" disabled={pending}>
                    Send reset link
                  </Button>
                </FieldGroup>
              </form>
            )}
            <p className="mt-4 text-center text-sm">
              <Link to="/login" className="underline underline-offset-2">
                Back to log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  )
}
