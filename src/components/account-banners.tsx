import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import type { SessionUser } from '@/lib/fns/session'

/** Impersonation and unverified-email notices shown above every signed-in page. */
export function AccountBanners({ user }: { user: SessionUser }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [sending, setSending] = useState(false)

  if (user.impersonating) {
    return (
      <div
        role="status"
        className="flex flex-wrap items-center gap-3 bg-amber-100 px-4 py-2 text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-100"
      >
        <span className="flex-1">
          You are viewing the app as <strong>@{user.username}</strong>.
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={async () => {
            await authClient.admin.stopImpersonating()
            queryClient.clear()
            await router.invalidate()
            await router.navigate({ to: '/admin' })
          }}
        >
          Stop impersonating
        </Button>
      </div>
    )
  }

  if (user.email && !user.emailVerified) {
    return (
      <div
        role="status"
        className="flex flex-wrap items-center gap-3 bg-muted px-4 py-2 text-sm"
      >
        <span className="flex-1">
          Check <strong>{user.email}</strong> for a link to verify your email.
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={sending}
          onClick={async () => {
            setSending(true)
            const { error } = await authClient.sendVerificationEmail({
              email: user.email!,
              callbackURL: '/portfolio',
            })
            setSending(false)
            if (error) toast.error(error.message ?? 'Could not send email.')
            else toast.success('Verification email sent.')
          }}
        >
          Resend email
        </Button>
      </div>
    )
  }

  return null
}
