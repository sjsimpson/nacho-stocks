import { formatCents, formatPercent } from '@/lib/money'
import { cn } from '@/lib/utils'

/** Signed amount colored green/red. */
export function Change({
  cents,
  ratio,
  className,
}: {
  cents?: number | null
  ratio?: number | null
  className?: string
}) {
  const value = cents ?? ratio
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>
  }
  const tone =
    value > 0
      ? 'text-emerald-600 dark:text-emerald-400'
      : value < 0
        ? 'text-red-600 dark:text-red-400'
        : 'text-muted-foreground'
  const text =
    cents !== undefined && cents !== null
      ? `${cents > 0 ? '+' : ''}${formatCents(cents)}`
      : formatPercent(ratio!)
  return <span className={cn('tabular-nums', tone, className)}>{text}</span>
}
