import { cache, cached } from '../cache'
import { eulerpool } from './eulerpool'
import type { MarketDataProvider } from './types'

export type * from './types'

const provider: MarketDataProvider = eulerpool

const MINUTE = 60
const DAY = 24 * 60 * MINUTE
// Free tier quotes are delayed 15 minutes, so caching longer costs nothing.
const QUOTE_TTL = 15 * MINUTE

export const normalizeSymbol = (s: string) => s.trim().toUpperCase()

export const market = {
  search: (query: string) => {
    const q = query.trim().toLowerCase()
    return cached(`search:${q}`, DAY, () => provider.search(q))
  },

  profile: (symbol: string) =>
    cached(`profile:${symbol}`, DAY, () => provider.profile(symbol)),

  /** Latest price in cents for each symbol, cached per symbol. */
  async quotes(symbols: string[]) {
    const unique = [...new Set(symbols)]
    const out: Record<string, number> = {}
    const misses: string[] = []
    await Promise.all(
      unique.map(async (s) => {
        const hit = await cache.get<number>(`quote:${s}`)
        if (hit !== null) out[s] = hit
        else misses.push(s)
      })
    )
    if (misses.length) {
      const fresh = await provider.quotes(misses)
      await Promise.all(
        Object.entries(fresh).map(([s, cents]) => {
          out[s] = cents
          return cache.set(`quote:${s}`, cents, QUOTE_TTL)
        })
      )
    }
    return out
  },

  async quote(symbol: string) {
    const quotes = await market.quotes([symbol])
    return quotes[symbol] ?? null
  },

  history: (isin: string, days: number) =>
    cached(`history:${isin}:${days}`, 6 * 60 * MINUTE, () =>
      provider.history(isin, days)
    ),
}
