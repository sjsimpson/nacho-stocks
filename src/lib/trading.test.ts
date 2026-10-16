import { describe, expect, it } from 'vitest'
import { costBasis, holdingsValue, planTrade } from './trading'

const base = { priceCents: 10_000, cashCents: 50_000, heldQuantity: 3 }

describe('planTrade', () => {
  it('buys when cash covers the total', () => {
    expect(planTrade({ ...base, type: 'buy', quantity: 5 })).toEqual({
      ok: true,
      cashDeltaCents: -50_000,
      quantityDelta: 5,
    })
  })

  it('rejects a buy that costs more than cash', () => {
    const plan = planTrade({ ...base, type: 'buy', quantity: 6 })
    expect(plan.ok).toBe(false)
  })

  it('sells up to the held quantity', () => {
    expect(planTrade({ ...base, type: 'sell', quantity: 3 })).toEqual({
      ok: true,
      cashDeltaCents: 30_000,
      quantityDelta: -3,
    })
  })

  it('rejects selling more than held', () => {
    expect(planTrade({ ...base, type: 'sell', quantity: 4 }).ok).toBe(false)
  })

  it.each([0, -1, 1.5, Number.NaN])('rejects quantity %s', (quantity) => {
    expect(planTrade({ ...base, type: 'buy', quantity }).ok).toBe(false)
  })

  it('rejects a missing or fractional price', () => {
    expect(
      planTrade({ ...base, type: 'buy', quantity: 1, priceCents: 0 }).ok
    ).toBe(false)
    expect(
      planTrade({ ...base, type: 'buy', quantity: 1, priceCents: 1.5 }).ok
    ).toBe(false)
  })
})

describe('costBasis', () => {
  it('averages buys and reduces cost proportionally on sells', () => {
    const basis = costBasis([
      { type: 'buy', symbol: 'AAPL', quantity: 2, priceCents: 100 },
      { type: 'buy', symbol: 'AAPL', quantity: 2, priceCents: 200 },
      { type: 'sell', symbol: 'AAPL', quantity: 1, priceCents: 999 },
    ])
    // avg 150/share; 3 left
    expect(basis.AAPL).toEqual({ quantity: 3, costCents: 450 })
  })

  it('resets cost when a position is fully sold', () => {
    const basis = costBasis([
      { type: 'buy', symbol: 'MSFT', quantity: 1, priceCents: 500 },
      { type: 'sell', symbol: 'MSFT', quantity: 1, priceCents: 700 },
      { type: 'buy', symbol: 'MSFT', quantity: 1, priceCents: 300 },
    ])
    expect(basis.MSFT).toEqual({ quantity: 1, costCents: 300 })
  })
})

describe('holdingsValue', () => {
  it('sums quantity times price and treats missing prices as zero', () => {
    expect(
      holdingsValue(
        [
          { symbol: 'A', quantity: 2 },
          { symbol: 'B', quantity: 3 },
        ],
        { A: 1_000 }
      )
    ).toBe(2_000)
  })
})
