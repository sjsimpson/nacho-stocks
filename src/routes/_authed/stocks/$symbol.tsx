import { createFileRoute, notFound } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { MoneyAreaChart } from '@/components/charts'
import { Change } from '@/components/money'
import { NotFound } from '@/components/not-found'
import { TradeForm } from '@/components/trade-form'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCents } from '@/lib/money'
import { stockQuery } from '@/lib/queries'

export const Route = createFileRoute('/_authed/stocks/$symbol')({
  loader: async ({ context, params }) => {
    const stock = await context.queryClient.ensureQueryData(
      stockQuery(params.symbol)
    )
    if (!stock) throw notFound()
    return { title: `${stock.profile.symbol} · ${stock.profile.name}` }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? 'Stock'} · Nacho Stocks` }],
  }),
  notFoundComponent: () => <NotFound message="We couldn’t find that stock." />,
  component: StockPage,
})

function StockPage() {
  const { symbol } = Route.useParams()
  const { data } = useSuspenseQuery(stockQuery(symbol))
  if (!data) return null
  const { profile, priceCents, history, heldQuantity, cashCents } = data

  const series = history.map((p) => ({ date: p.date, cents: p.priceCents }))
  const first = series[0]?.cents
  const change = priceCents !== null && first ? priceCents - first : null

  return (
    <article className="space-y-6">
      <header className="flex flex-wrap items-center gap-4">
        {profile.logoUrl && (
          <img
            src={profile.logoUrl}
            alt=""
            width={48}
            height={48}
            className="size-12 rounded-lg border bg-white object-contain p-1"
          />
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {profile.name}
          </h1>
          <p className="flex flex-wrap items-center gap-2 text-muted-foreground">
            <span className="font-mono">{profile.symbol}</span>
            {profile.sector && (
              <Badge variant="secondary">{profile.sector}</Badge>
            )}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold tabular-nums">
            {priceCents === null ? '—' : formatCents(priceCents)}
          </p>
          {change !== null && (
            <p className="text-sm">
              <Change cents={change} />{' '}
              <span className="text-muted-foreground">past 90 days</span>
            </p>
          )}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section aria-labelledby="price-heading" className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <h2 id="price-heading">Price history</h2>
              </CardTitle>
              <CardDescription>
                Daily closing price, past 90 days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {series.length >= 2 ? (
                <MoneyAreaChart
                  data={series}
                  label="Price"
                  description={`${profile.symbol} closing price from ${series[0]!.date} to ${series.at(-1)!.date}.`}
                />
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Price history is unavailable.
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        <aside aria-label={`Trade ${profile.symbol}`}>
          {priceCents !== null && cashCents !== null ? (
            <TradeForm
              symbol={profile.symbol}
              priceCents={priceCents}
              cashCents={cashCents}
              heldQuantity={heldQuantity}
            />
          ) : (
            <p className="text-muted-foreground">
              Trading is unavailable for this stock.
            </p>
          )}
        </aside>
      </div>

      {(profile.description || profile.industry || profile.website) && (
        <section
          aria-labelledby="about-heading"
          className="max-w-3xl space-y-2"
        >
          <h2 id="about-heading" className="text-lg font-semibold">
            About {profile.name}
          </h2>
          {profile.description && (
            <p className="leading-relaxed text-muted-foreground">
              {profile.description}
            </p>
          )}
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            {profile.industry && (
              <>
                <dt className="text-muted-foreground">Industry</dt>
                <dd>{profile.industry}</dd>
              </>
            )}
            {profile.website && (
              <>
                <dt className="text-muted-foreground">Website</dt>
                <dd>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    {new URL(profile.website).hostname}
                  </a>
                </dd>
              </>
            )}
          </dl>
        </section>
      )}
    </article>
  )
}
