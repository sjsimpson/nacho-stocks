import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
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
  const password = useFormState()

  async function onProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const username = String(f.get('username')).trim()
    const problem = checkUsername(username)
    if (problem) return profile.setError(usernameProblemMessage[problem])
    profile.setPending(true)
    profile.setError(null)
    const { error } = await authClient.updateUser({
      username,
      ...(user.accountType === 'teacher'
        ? { name: String(f.get('name')).trim() }
        : { name: username }),
    })
    profile.setPending(false)
    if (error) return profile.setError(error.message ?? 'Could not save.')
    toast.success('Profile saved')
    queryClient.removeQueries({ queryKey: ['session'] })
    await router.invalidate()
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
    if (error)
      return password.setError(error.message ?? 'Could not change password.')
    form.reset()
    toast.success('Password changed. Other devices were signed out.')
  }

  return (
    <>
      <PageHeader
        title="Account"
        description={
          user.accountType === 'teacher' ? 'Teacher account' : 'Student account'
        }
      />
      <div className="grid max-w-4xl gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Profile</h2>
            </CardTitle>
            {user.email && <CardDescription>{user.email}</CardDescription>}
          </CardHeader>
          <CardContent>
            <form method="post" onSubmit={onProfile}>
              <FieldGroup>
                {user.accountType === 'teacher' && (
                  <Field>
                    <FieldLabel htmlFor="name">Full name</FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={user.name}
                      required
                    />
                  </Field>
                )}
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
                  {user.accountType === 'student' && (
                    <FieldDescription>
                      Don’t use your real name.
                    </FieldDescription>
                  )}
                  {profile.error && (
                    <FieldError role="alert">{profile.error}</FieldError>
                  )}
                </Field>
                <Button type="submit" disabled={profile.pending}>
                  Save profile
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
