import { describe, expect, it, vi } from 'vitest'

// Avoid loading DB/env when importing the job module.
vi.mock('@/db', () => ({ db: {}, schema: {} }))
vi.mock('../market', () => ({ market: {} }))

const { marketDate } = await import('./snapshot-portfolios')

describe('marketDate', () => {
  it('uses the New York date, not UTC', () => {
    // 01:00 UTC on Oct 14 is still Oct 13 in New York.
    expect(marketDate(new Date('2026-10-14T01:00:00Z'))).toBe('2026-10-13')
  })
})
