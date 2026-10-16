import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db, schema } from '@/db'
import { market, normalizeSymbol } from '@/lib/server/market'
import { getSession } from '@/lib/server/session'

export const searchStocks = createServerFn({ method: 'GET' })
  .validator(z.object({ q: z.string().trim().min(1).max(50) }))
  .handler(({ data }) => market.search(data.q))

export const getStock = createServerFn({ method: 'GET' })
  .validator(z.object({ symbol: z.string().min(1).max(12) }))
  .handler(async ({ data }) => {
    const symbol = normalizeSymbol(data.symbol)
    const profile = await market.profile(symbol)
    if (!profile) return null

    const [priceCents, history, session] = await Promise.all([
      market.quote(symbol),
      market.history(profile.isin, 90).catch(() => []),
      getSession(),
    ])

    let heldQuantity = 0
    let cashCents: number | null = null
    if (session) {
      const [pos] = await db
        .select({ quantity: schema.position.quantity })
        .from(schema.position)
        .where(
          and(
            eq(schema.position.userId, session.user.id),
            eq(schema.position.symbol, symbol)
          )
        )
      heldQuantity = pos?.quantity ?? 0
      cashCents = session.user.cashCents ?? null
    }

    return { profile, priceCents, history, heldQuantity, cashCents }
  })

export type StockDetail = NonNullable<Awaited<ReturnType<typeof getStock>>>
