import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MoreHorizontalIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FieldError } from '@/components/ui/field'
import { authClient } from '@/lib/auth-client'
import { errorMessage } from '@/lib/errors'
import { setAdminFn } from '@/lib/fns/admin'

type User = {
  id: string
  username: string | null
  role: string | null
}

/** Row menu on the admin Users tab: impersonate, grant or revoke admin. */
export function UserActions({ user }: { user: User }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const name = `@${user.username}`
  const isAdmin = user.role === 'admin'

  const close = () => {
    setConfirming(false)
    setError(null)
  }

  const toggle = useMutation({
    mutationFn: () =>
      setAdminFn({ data: { userId: user.id, admin: !isAdmin } }),
    onSuccess: async (result) => {
      if (!result.ok) return setError(result.error)
      toast.success(
        isAdmin ? `${name} is no longer an admin` : `${name} is now an admin`
      )
      await queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      close()
    },
    onError: (e) => setError(errorMessage(e)),
  })

  async function impersonate() {
    const res = await authClient.admin.impersonateUser({ userId: user.id })
    if (res.error) {
      return toast.error(res.error.message ?? 'Could not impersonate.')
    }
    queryClient.clear()
    await navigate({ to: '/portfolio', reloadDocument: true })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Actions for ${name}`}
            />
          }
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!isAdmin && (
            <DropdownMenuItem onClick={impersonate}>
              View as user
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            variant={isAdmin ? 'destructive' : 'default'}
            onClick={() => setConfirming(true)}
          >
            {isAdmin ? 'Remove admin' : 'Make admin'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirming} onOpenChange={(o) => !o && close()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isAdmin
                ? `Remove admin from ${name}?`
                : `Make ${name} an admin?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isAdmin
                ? 'They keep their account and classrooms but lose access to this page.'
                : 'Admins can approve classrooms, manage every class, and view as any user.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && <FieldError role="alert">{error}</FieldError>}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant={isAdmin ? 'destructive' : 'default'}
              disabled={toggle.isPending}
              onClick={() => toggle.mutate()}
            >
              {isAdmin ? 'Remove admin' : 'Make admin'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
