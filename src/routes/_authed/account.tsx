import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import {
  USERNAME_MAX,
  USERNAME_MIN,
  checkUsername,
  usernameProblemMessage,
} from '@/lib/username'

export const Route = createFileRoute('/_authed/account')({
  head: () => ({ meta: [{ title: 'Account · Nacho Stocks' }] }),
  component: AccountPage,
})

function useFormState() {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  return { error, setError, pending, setPending }
}

function AccountPage() {
  const { user } = Route.useRouteContext()
  const router = useRouter()
  const queryClient = useQueryClient()
  const profile = useFormState()
  const email = useFormState()
  const password = useFormState()

  async function refreshSession() {
    queryClient.removeQueries({ queryKey: ['session'] })
    await router.invalidate()
  }

  async function onProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const username = String(
      new FormData(e.currentTarget).get('username')
    ).trim()
    const problem = checkUsername(username)
    if (problem) return profile.setError(usernameProblemMessage[problem])
    profile.setPending(true)
    profile.setError(null)
    const { error } = await authClient.updateUser({ username, name: username })
    profile.setPending(false)
    if (error) return profile.setError(error.message ?? 'Could not save.')
    toast.success('Username saved')
    await refreshSession()
  }

  async function onEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const newEmail = String(new FormData(e.currentTarget).get('email'))
      .trim()
      .toLowerCase()
    email.setPending(true)
    email.setError(null)
    const { error } = await authClient.changeEmail({
      newEmail,
      callbackURL: '/account',
    })
    email.setPending(false)
    if (error) return email.setError(error.message ?? 'Could not update email.')
    toast.success(`Check ${newEmail} for a verification link.`)
    await refreshSession()
  }

  async function onPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    const next = String(f.get('newPassword'))
    if (next !== String(f.get('confirmPassword'))) {
      return password.setError('New passwords don’t match.')
    }
    password.setPending(true)
    password.setError(null)
    const { error } = await authClient.changePassword({
      currentPassword: String(f.get('currentPassword')),
      newPassword: next,
      revokeOtherSessions: true,
    })
    password.setPending(false)
    if (error) {
      return password.setError(error.message ?? 'Could not change password.')
    }
    form.reset()
    toast.success('Password changed. Other devices were signed out.')
  }

  return (
    <>
      <PageHeader title="Account" />
      <div className="grid max-w-4xl gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Username</h2>
            </CardTitle>
            <CardDescription>
              Shown to your teacher and classmates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form method="post" onSubmit={onProfile}>
              <FieldGroup>
                <Field data-invalid={!!profile.error}>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    id="username"
                    name="username"
                    defaultValue={user.displayUsername ?? user.username ?? ''}
                    minLength={USERNAME_MIN}
                    maxLength={USERNAME_MAX}
                    pattern="[a-zA-Z0-9_.]+"
                    required
                  />
                  <FieldDescription>
                    Students: don’t use your real name.
                  </FieldDescription>
                  {profile.error && (
                    <FieldError role="alert">{profile.error}</FieldError>
                  )}
                </Field>
                <Button type="submit" disabled={profile.pending}>
                  Save username
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Email</h2>
            </CardTitle>
            <CardDescription>
              {user.email ? (
                <span className="flex flex-wrap items-center gap-2">
                  {user.email}
                  <Badge variant={user.emailVerified ? 'default' : 'secondary'}>
                    {user.emailVerified ? 'Verified' : 'Not verified'}
                  </Badge>
                </span>
              ) : (
                'Optional. Lets you reset your password and request a classroom.'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form method="post" onSubmit={onEmail}>
              <FieldGroup>
                <Field data-invalid={!!email.error}>
                  <FieldLabel htmlFor="email">
                    {user.email ? 'New email' : 'Email'}
                  </FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                  {email.error && (
                    <FieldError role="alert">{email.error}</FieldError>
                  )}
                </Field>
                <Button type="submit" disabled={email.pending}>
                  {user.email ? 'Change email' : 'Add email'}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Change password</h2>
            </CardTitle>
            <CardDescription>Other devices will be signed out.</CardDescription>
          </CardHeader>
          <CardContent>
            <form method="post" onSubmit={onPassword}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="currentPassword">
                    Current password
                  </FieldLabel>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="newPassword">New password</FieldLabel>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </Field>
                <Field data-invalid={!!password.error}>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm new password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  {password.error && (
                    <FieldError role="alert">{password.error}</FieldError>
                  )}
                </Field>
                <Button type="submit" disabled={password.pending}>
                  Change password
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
