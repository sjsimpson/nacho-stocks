import { Link } from '@tanstack/react-router'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { errorMessage } from '@/lib/errors'
import {
  removeMemberFn,
  renameStudentFn,
  resetStudentPasswordFn,
  setMemberRoleFn,
} from '@/lib/fns/classes'
import { USERNAME_MAX, USERNAME_MIN } from '@/lib/username'

type Member = {
  memberId: string
  userId: string
  role: string
  username: string | null
  displayUsername: string | null
}

type Action = 'rename' | 'password' | 'promote' | 'remove' | null

/** Row menu on the class roster: view, rename, reset password, promote, remove. */
export function StudentActions({
  member,
  organizationId,
  slug,
}: {
  member: Member
  organizationId: string
  slug: string
}) {
  const queryClient = useQueryClient()
  const [action, setAction] = useState<Action>(null)
  const [error, setError] = useState<string | null>(null)
  const name = `@${member.displayUsername ?? member.username}`
  const isStudent = member.role === 'member'

  const close = () => {
    setAction(null)
    setError(null)
  }

  const run = useMutation({
    mutationFn: async (
      fn: () => Promise<{ ok: true } | { ok: false; error: string }>
    ) => fn(),
    onSuccess: async (result, _fn) => {
      if (!result.ok) return setError(result.error)
      await queryClient.invalidateQueries({ queryKey: ['classes', slug] })
      close()
    },
    onError: (e) => setError(errorMessage(e)),
  })

  const ids = { organizationId, studentId: member.userId }

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
          {isStudent && (
            <>
              <DropdownMenuItem
                render={
                  <Link
                    to="/classes/$slug/students/$userId"
                    params={{ slug, userId: member.userId }}
                  />
                }
              >
                View portfolio
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAction('rename')}>
                Change username
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAction('password')}>
                Reset password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setAction('promote')}>
                Make co-teacher
              </DropdownMenuItem>
            </>
          )}
          {member.role !== 'owner' && (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setAction('remove')}
            >
              Remove from class
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={action === 'rename'} onOpenChange={(o) => !o && close()}>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const f = new FormData(e.currentTarget)
              const username = String(f.get('username'))
              const reason = String(f.get('reason') ?? '') || undefined
              run.mutate(async () => {
                const r = await renameStudentFn({
                  data: { ...ids, username, reason },
                })
                if (r.ok) toast.success(`Renamed ${name} to @${username}`)
                return r.ok ? { ok: true } : r
              })
            }}
          >
            <DialogHeader>
              <DialogTitle>Change username</DialogTitle>
              <DialogDescription>
                Rename {name}. The change is logged. Tell the student their new
                username.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="my-4">
              <Field data-invalid={!!error}>
                <FieldLabel htmlFor="new-username">New username</FieldLabel>
                <Input
                  id="new-username"
                  name="username"
                  minLength={USERNAME_MIN}
                  maxLength={USERNAME_MAX}
                  pattern="[a-zA-Z0-9_.]+"
                  required
                  autoComplete="off"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="reason">Reason (optional)</FieldLabel>
                <Input id="reason" name="reason" maxLength={200} />
              </Field>
              {error && <FieldError role="alert">{error}</FieldError>}
            </FieldGroup>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button type="submit" disabled={run.isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={action === 'password'} onOpenChange={(o) => !o && close()}>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const password = String(
                new FormData(e.currentTarget).get('password')
              )
              run.mutate(async () => {
                const r = await resetStudentPasswordFn({
                  data: { ...ids, password },
                })
                if (r.ok) toast.success(`Password reset for ${name}`)
                return r.ok ? { ok: true } : r
              })
            }}
          >
            <DialogHeader>
              <DialogTitle>Reset password</DialogTitle>
              <DialogDescription>
                Set a new password for {name}. They will be signed out
                everywhere.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="my-4">
              <Field data-invalid={!!error}>
                <FieldLabel htmlFor="new-password">New password</FieldLabel>
                <Input
                  id="new-password"
                  name="password"
                  type="text"
                  minLength={8}
                  required
                  autoComplete="off"
                />
                <FieldDescription>
                  At least 8 characters. Share it privately.
                </FieldDescription>
              </Field>
              {error && <FieldError role="alert">{error}</FieldError>}
            </FieldGroup>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button type="submit" disabled={run.isPending}>
                Reset password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={action === 'promote' || action === 'remove'}
        onOpenChange={(o) => !o && close()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === 'promote'
                ? `Make ${name} a co-teacher?`
                : `Remove ${name}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {action === 'promote'
                ? 'Co-teachers can see every student’s portfolio and manage the class.'
                : 'They keep their account and portfolio but leave this class.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && <FieldError role="alert">{error}</FieldError>}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant={action === 'remove' ? 'destructive' : 'default'}
              disabled={run.isPending}
              onClick={() =>
                run.mutate(async () => {
                  const r =
                    action === 'promote'
                      ? await setMemberRoleFn({
                          data: {
                            organizationId,
                            memberId: member.memberId,
                            role: 'admin',
                          },
                        })
                      : await removeMemberFn({
                          data: { organizationId, memberId: member.memberId },
                        })
                  return r.ok ? { ok: true } : r
                })
              }
            >
              {action === 'promote' ? 'Make co-teacher' : 'Remove'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
