import { Link } from '@tanstack/react-router'
import { MoneyAreaChart } from '@/components/charts'
import { DataTable, columnHelper } from '@/components/data-table'
import { Change } from '@/components/money'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCents } from '@/lib/money'
import type { Portfolio } from '@/lib/server/portfolio'

type Position = Portfolio['positions'][number]
type Trade = Portfolio['trades'][number]
type Snapshot = { date: string; cashCents: number; holdingsCents: number }

const pos = columnHelper<Position>()
const positionColumns = [
  pos.accessor('symbol', {
    header: 'Symbol',
    cell: (c) => (
      <Link
        to="/stocks/$symbol"
        params={{ symbol: c.getValue() }}
        className="font-medium underline-offset-2 hover:underline"
      >
        {c.getValue()}
      </Link>
    ),
  }),
  pos.accessor('quantity', { header: 'Shares', meta: { align: 'right' } }),
  pos.accessor('priceCents', {
    header: 'Price',
    meta: { align: 'right' },
    cell: (c) => (c.getValue() === null ? '—' : formatCents(c.getValue()!)),
  }),
  pos.accessor('valueCents', {
    header: 'Value',
    meta: { align: 'right' },
    cell: (c) => (c.getValue() === null ? '—' : formatCents(c.getValue()!)),
  }),
  pos.accessor('costCents', {
    header: 'Cost',
    meta: { align: 'right' },
    cell: (c) => formatCents(c.getValue()),
  }),
  pos.accessor('gainCents', {
    header: 'Gain/loss',
    meta: { align: 'right' },
    cell: (c) => <Change cents={c.getValue()} />,
  }),
]

const tr = columnHelper<Trade>()
const tradeColumns = [
  tr.accessor('createdAt', {
    header: 'Date',
    cell: (c) => (
      <time dateTime={c.getValue()}>
        {new Date(c.getValue()).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </time>
    ),
  }),
  tr.accessor('type', {
    header: 'Type',
    cell: (c) => (
      <Badge variant={c.getValue() === 'buy' ? 'default' : 'secondary'}>
        {c.getValue() === 'buy' ? 'Buy' : 'Sell'}
      </Badge>
    ),
  }),
  tr.accessor('symbol', { header: 'Symbol' }),
  tr.accessor('quantity', { header: 'Shares', meta: { align: 'right' } }),
  tr.accessor('priceCents', {
    header: 'Price',
    meta: { align: 'right' },
    cell: (c) => formatCents(c.getValue()),
  }),
  tr.display({
    id: 'total',
    header: 'Total',
    meta: { align: 'right' },
    cell: (c) =>
      formatCents(c.row.original.priceCents * c.row.original.quantity),
  }),
]

function Stat({
  label,
  value,
  detail,
}: {
  label: string
  value: React.ReactNode
  detail?: React.ReactNode
}) {
  // A <div> directly inside <dl> may group one <dt> with its <dd>s.
  return (
    <div className="rounded-xl border bg-card p-4 text-card-foreground">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums">{value}</dd>
      {detail && <dd className="mt-1 text-sm">{detail}</dd>}
    </div>
  )
}

export function PortfolioView({
  portfolio,
  history,
  owner = 'Your',
}: {
  portfolio: Portfolio
  history: Snapshot[]
  /** Possessive label for headings, e.g. "Your" or "@sam's". */
  owner?: string
}) {
  const series = history.map((s) => ({
    date: s.date,
    cents: s.cashCents + s.holdingsCents,
  }))

  return (
    <div className="space-y-8">
      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sr-only">
          Summary
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Total value"
            value={formatCents(portfolio.totalCents)}
            detail={
              <>
                <Change ratio={portfolio.returnRatio} /> all time
              </>
            }
          />
          <Stat label="Cash" value={formatCents(portfolio.cashCents)} />
          <Stat label="Stocks" value={formatCents(portfolio.holdingsCents)} />
          <Stat
            label="Gain/loss"
            value={
              <Change cents={portfolio.totalCents - portfolio.startingCents} />
            }
            detail={
              <span className="text-muted-foreground">
                from {formatCents(portfolio.startingCents)}
              </span>
            }
          />
        </dl>
      </section>

      <section aria-labelledby="history-heading">
        <Card>
          <CardHeader>
            <CardTitle>
              <h2 id="history-heading">{owner} value over time</h2>
            </CardTitle>
            <CardDescription>Recorded after each market close.</CardDescription>
          </CardHeader>
          <CardContent>
            {series.length >= 2 ? (
              <MoneyAreaChart
                data={series}
                label="Total value"
                description={`Portfolio value from ${series[0]!.date} to ${series.at(-1)!.date}, now ${formatCents(series.at(-1)!.cents)}.`}
              />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                The chart appears after two market closes.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="holdings-heading" className="space-y-3">
        <h2 id="holdings-heading" className="text-lg font-semibold">
          Holdings
        </h2>
        <DataTable
          columns={positionColumns}
          data={portfolio.positions}
          caption={`${owner} holdings`}
          empty={
            <>
              No stocks yet.{' '}
              <Link to="/stocks" className="underline underline-offset-2">
                Find a stock to buy
              </Link>
              .
            </>
          }
          initialSorting={[{ id: 'valueCents', desc: true }]}
        />
      </section>

      <section aria-labelledby="trades-heading" className="space-y-3">
        <h2 id="trades-heading" className="text-lg font-semibold">
          Trade history
        </h2>
        <DataTable
          columns={tradeColumns}
          data={portfolio.trades}
          caption={`${owner} trade history`}
          empty="No trades yet."
          pageSize={10}
        />
      </section>
    </div>
  )
}
