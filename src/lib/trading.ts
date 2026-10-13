/** Pure trading math. No I/O, so it can be unit tested and shared. */

export type TradeType = 'buy' | 'sell'

export type TradePlan =
  | { ok: true; cashDeltaCents: number; quantityDelta: number }
  | { ok: false; error: string }

export function planTrade(input: {
  type: TradeType
  quantity: number
  priceCents: number
  cashCents: number
  heldQuantity: number
}): TradePlan {
  const { type, quantity, priceCents, cashCents, heldQuantity } = input
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { ok: false, error: 'Quantity must be a whole number above zero.' }
  }
  if (!Number.isInteger(priceCents) || priceCents <= 0) {
    return { ok: false, error: 'No valid price for this stock right now.' }
  }
  const totalCents = quantity * priceCents
  if (type === 'buy') {
    if (totalCents > cashCents) {
      return { ok: false, error: 'Not enough cash for this purchase.' }
    }
    return { ok: true, cashDeltaCents: -totalCents, quantityDelta: quantity }
  }
  if (quantity > heldQuantity) {
    return { ok: false, error: "You can't sell more shares than you own." }
  }
  return { ok: true, cashDeltaCents: totalCents, quantityDelta: -quantity }
}

/** Average cost basis per share (cents) per symbol, from trades in time order. */
export function costBasis(
  trades: {
    type: TradeType
    symbol: string
    quantity: number
    priceCents: number
  }[]
): Record<string, { quantity: number; costCents: number }> {
  const out: Record<string, { quantity: number; costCents: number }> = {}
  for (const t of trades) {
    const lot = (out[t.symbol] ??= { quantity: 0, costCents: 0 })
    if (t.type === 'buy') {
      lot.quantity += t.quantity
      lot.costCents += t.quantity * t.priceCents
    } else if (lot.quantity > 0) {
      const avg = lot.costCents / lot.quantity
      lot.quantity -= t.quantity
      lot.costCents = lot.quantity > 0 ? lot.costCents - avg * t.quantity : 0
    }
  }
  for (const lot of Object.values(out))
    lot.costCents = Math.round(lot.costCents)
  return out
}

/** Market value of holdings in cents. Symbols without a price count as 0. */
export function holdingsValue(
  positions: { symbol: string; quantity: number }[],
  pricesCents: Record<string, number>
): number {
  return positions.reduce(
    (sum, p) => sum + p.quantity * (pricesCents[p.symbol] ?? 0),
    0
  )
}
