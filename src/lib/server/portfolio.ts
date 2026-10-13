import { and, asc, eq, sql } from 'drizzle-orm'
import { db, schema } from '@/db'
import { STARTING_CASH_CENTS } from '@/lib/constants'
import {
  costBasis,
  holdingsValue,
  planTrade,
  type TradeType,
} from '@/lib/trading'
import { market } from './market'

export class TradeError extends Error {}

/** Buys or sells at the current quote. Cash, position, and trade log update atomically. */
export async function executeTrade(input: {
  userId: string
  type: TradeType
  symbol: string
  quantity: number
}) {
  const priceCents = await market.quote(input.symbol)
  if (priceCents === null)
    throw new TradeError('No price available for this stock.')

  return db.transaction(async (tx) => {
    const [u] = await tx
      .select({ cashCents: schema.user.cashCents })
      .from(schema.user)
      .where(eq(schema.user.id, input.userId))
      .for('update')
    const [pos] = await tx
      .select()
      .from(schema.position)
      .where(
        and(
          eq(schema.position.userId, input.userId),
          eq(schema.position.symbol, input.symbol)
        )
      )
      .for('update')

    const plan = planTrade({
      type: input.type,
      quantity: input.quantity,
      priceCents,
      cashCents: u.cashCents,
      heldQuantity: pos?.quantity ?? 0,
    })
    if (!plan.ok) throw new TradeError(plan.error)

    await tx
      .update(schema.user)
      .set({
        cashCents: sql`${schema.user.cashCents} + ${plan.cashDeltaCents}`,
      })
      .where(eq(schema.user.id, input.userId))

    const newQuantity = (pos?.quantity ?? 0) + plan.quantityDelta
    if (pos && newQuantity === 0) {
      await tx.delete(schema.position).where(eq(schema.position.id, pos.id))
    } else if (pos) {
      await tx
        .update(schema.position)
        .set({ quantity: newQuantity })
        .where(eq(schema.position.id, pos.id))
    } else {
      await tx.insert(schema.position).values({
        userId: input.userId,
        symbol: input.symbol,
        quantity: newQuantity,
      })
    }

    const [trade] = await tx
      .insert(schema.trade)
      .values({ ...input, priceCents })
      .returning()
    return trade
  })
}

export async function getPortfolio(userId: string) {
  const [u] = await db
    .select({ cashCents: schema.user.cashCents })
    .from(schema.user)
    .where(eq(schema.user.id, userId))
  if (!u) return null

  const [positions, trades] = await Promise.all([
    db
      .select({
        symbol: schema.position.symbol,
        quantity: schema.position.quantity,
      })
      .from(schema.position)
      .where(eq(schema.position.userId, userId))
      .orderBy(asc(schema.position.symbol)),
    db
      .select()
      .from(schema.trade)
      .where(eq(schema.trade.userId, userId))
      .orderBy(asc(schema.trade.createdAt), asc(schema.trade.id)),
  ])

  const prices = await market.quotes(positions.map((p) => p.symbol))
  const basis = costBasis(trades)
  const holdingsCents = holdingsValue(positions, prices)
  const totalCents = u.cashCents + holdingsCents

  return {
    cashCents: u.cashCents,
    holdingsCents,
    totalCents,
    startingCents: STARTING_CASH_CENTS,
    returnRatio: (totalCents - STARTING_CASH_CENTS) / STARTING_CASH_CENTS,
    positions: positions.map((p) => {
      const priceCents = prices[p.symbol] ?? null
      const valueCents = priceCents === null ? null : priceCents * p.quantity
      const costCents = basis[p.symbol]?.costCents ?? 0
      return {
        ...p,
        priceCents,
        valueCents,
        costCents,
        gainCents: valueCents === null ? null : valueCents - costCents,
      }
    }),
    trades: [...trades].reverse().map((t) => ({
      id: t.id,
      type: t.type,
      symbol: t.symbol,
      quantity: t.quantity,
      priceCents: t.priceCents,
      createdAt: t.createdAt.toISOString(),
    })),
  }
}

export type Portfolio = NonNullable<Awaited<ReturnType<typeof getPortfolio>>>

export async function getValueHistory(userId: string) {
  return db
    .select({
      date: schema.portfolioSnapshot.date,
      cashCents: schema.portfolioSnapshot.cashCents,
      holdingsCents: schema.portfolioSnapshot.holdingsCents,
    })
    .from(schema.portfolioSnapshot)
    .where(eq(schema.portfolioSnapshot.userId, userId))
    .orderBy(asc(schema.portfolioSnapshot.date))
}
