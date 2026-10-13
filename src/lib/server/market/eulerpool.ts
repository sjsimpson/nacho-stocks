import { toCents } from '@/lib/money'
import { env } from '../env'
import type {
  MarketDataProvider,
  PricePoint,
  StockProfile,
  StockSummary,
} from './types'

const BASE_URL = 'https://api.eulerpool.com/api/1'
const DAY_MS = 86_400_000

async function get<T>(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${path}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  url.searchParams.set('token', env.EULERPOOL_API_KEY)
  const res = await fetch(url)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Eulerpool ${path} failed: ${res.status}`)
  return (await res.json()) as T
}

interface SearchResponse {
  results: {
    name: string
    isin: string
    ticker: string
    type: string
    currency: string
  }[]
}

interface ProfileResponse {
  isin?: string
  name?: string
  logo?: string
  sector?: string
  industry?: string
  website?: string
  description?: string
}

type LatestResponse = Record<string, { price: number }>

type QuotesResponse = { timestamp: number; price: number }[]

export const eulerpool: MarketDataProvider = {
  async search(query) {
    const data = await get<SearchResponse>('/equity/search', { q: query })
    const seen = new Set<string>()
    const results: StockSummary[] = []
    // US-listed stocks only; foreign listings carry an exchange suffix.
    for (const r of data?.results ?? []) {
      if (
        r.type !== 'stock' ||
        r.currency !== 'USD' ||
        r.ticker.includes('.')
      ) {
        continue
      }
      if (seen.has(r.ticker)) continue
      seen.add(r.ticker)
      results.push({ symbol: r.ticker, name: r.name })
    }
    return results
  },

  async profile(symbol) {
    const p = await get<ProfileResponse>(
      `/equity/profile/${encodeURIComponent(symbol)}`
    )
    if (!p?.isin || !p.name) return null
    return {
      symbol,
      name: p.name,
      isin: p.isin,
      logoUrl: p.logo ? `https://api.eulerpool.com${p.logo}` : null,
      sector: p.sector ?? null,
      industry: p.industry ?? null,
      website: p.website ?? null,
      description: p.description ?? null,
    } satisfies StockProfile
  },

  async quotes(symbols) {
    if (symbols.length === 0) return {}
    const data = await get<LatestResponse>('/market/quotes/latest', {
      stocks: symbols.join(','),
    })
    const out: Record<string, number> = {}
    for (const [symbol, q] of Object.entries(data ?? {})) {
      if (typeof q?.price === 'number' && q.price > 0) {
        out[symbol] = toCents(q.price)
      }
    }
    return out
  },

  async history(isin, days) {
    const end = Date.now()
    const data = await get<QuotesResponse>(
      `/equity/quotes/${encodeURIComponent(isin)}`,
      { startdate: String(end - days * DAY_MS), enddate: String(end) }
    )
    // Keep the last point per day.
    const byDate = new Map<string, number>()
    for (const q of data ?? []) {
      byDate.set(new Date(q.timestamp).toISOString().slice(0, 10), q.price)
    }
    return [...byDate.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, price]): PricePoint => ({
        date,
        priceCents: toCents(price),
      }))
  },
}
