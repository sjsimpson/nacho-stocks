import { Badge } from '@/components/ui/badge'

const labels = {
  pending: 'Pending review',
  approved: 'Approved',
  rejected: 'Not approved',
} as const

export function RequestStatus({ status }: { status: keyof typeof labels }) {
  return (
    <Badge
      variant={
        status === 'approved'
          ? 'default'
          : status === 'rejected'
            ? 'destructive'
            : 'secondary'
      }
    >
      {labels[status]}
    </Badge>
  )
}
