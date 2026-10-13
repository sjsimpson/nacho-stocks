import { sql } from 'drizzle-orm'
import { db, schema } from '@/db'
import { holdingsValue } from '@/lib/trading'
import { market } from '../market'
import { inngest } from './client'

const QUOTE_BATCH = 100

/** Trading date in New York, YYYY-MM-DD. */
export const marketDate = (now = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(now)

/**
 * After US market close, records each held symbol's price and every user's
 * portfolio value. Upserts by date, so retries and re-runs are safe.
 */
export const snapshotPortfolios = inngest.createFunction(
  {
    id: 'snapshot-portfolios',
    triggers: [{ cron: 'TZ=America/New_York 30 16 * * 1-5' }],
  },
  async ({ step }) => {
    const date = marketDate()

    const symbols = await step.run('list-held-symbols', async () => {
      const rows = await db
        .selectDistinct({ symbol: schema.position.symbol })
        .from(schema.position)
      return rows.map((r) => r.symbol)
    })

    const prices: Record<string, number> = {}
    for (let i = 0; i < symbols.length; i += QUOTE_BATCH) {
      const batch = symbols.slice(i, i + QUOTE_BATCH)
      Object.assign(
        prices,
        await step.run(`fetch-prices-${i / QUOTE_BATCH}`, () =>
          market.quotes(batch)
        )
      )
    }

    await step.run('write-price-snapshots', async () => {
      const rows = Object.entries(prices).map(([symbol, closeCents]) => ({
        symbol,
        date,
        closeCents,
      }))
      if (rows.length === 0) return 0
      await db
        .insert(schema.priceSnapshot)
        .values(rows)
        .onConflictDoUpdate({
          target: [schema.priceSnapshot.symbol, schema.priceSnapshot.date],
          set: { closeCents: sql`excluded.close_cents` },
        })
      return rows.length
    })

    return step.run('write-portfolio-snapshots', async () => {
      const [users, positions] = await Promise.all([
        db
          .select({ id: schema.user.id, cashCents: schema.user.cashCents })
          .from(schema.user),
        db.select().from(schema.position),
      ])
      const byUser = Map.groupBy(positions, (p) => p.userId)
      const rows = users.map((u) => ({
        userId: u.id,
        date,
        cashCents: u.cashCents,
        holdingsCents: holdingsValue(byUser.get(u.id) ?? [], prices),
      }))
      if (rows.length === 0) return { date, users: 0 }
      await db
        .insert(schema.portfolioSnapshot)
        .values(rows)
        .onConflictDoUpdate({
          target: [
            schema.portfolioSnapshot.userId,
            schema.portfolioSnapshot.date,
          ],
          set: {
            cashCents: sql`excluded.cash_cents`,
            holdingsCents: sql`excluded.holdings_cents`,
          },
        })
      return { date, users: rows.length }
    })
  }
)
