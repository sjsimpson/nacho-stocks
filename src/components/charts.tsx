import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formatCents } from '@/lib/money'

const shortDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

const compactUsd = (cents: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(cents / 100)

/** Area chart of a cents series over dates. */
export function MoneyAreaChart({
  data,
  label,
  description,
}: {
  data: { date: string; cents: number }[]
  label: string
  /** Text alternative for screen readers. */
  description: string
}) {
  const config = {
    cents: { label, color: 'var(--chart-1)' },
  } satisfies ChartConfig
  return (
    <figure>
      <ChartContainer config={config} className="aspect-auto h-64 w-full">
        <AreaChart data={data} margin={{ left: 4, right: 4 }}>
          <defs>
            <linearGradient id="fillCents" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-cents)"
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor="var(--color-cents)"
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={shortDate}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={64}
            domain={['auto', 'auto']}
            tickFormatter={compactUsd}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) => shortDate(String(value))}
                formatter={(value) => formatCents(Number(value))}
              />
            }
          />
          <Area
            dataKey="cents"
            type="monotone"
            stroke="var(--color-cents)"
            fill="url(#fillCents)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
      <figcaption className="sr-only">{description}</figcaption>
    </figure>
  )
}
