export interface StockSummary {
  symbol: string
  name: string
}

export interface StockProfile extends StockSummary {
  isin: string
  logoUrl: string | null
  sector: string | null
  industry: string | null
  website: string | null
  description: string | null
}

export interface PricePoint {
  /** ISO date, YYYY-MM-DD */
  date: string
  priceCents: number
}

export interface MarketDataProvider {
  search(query: string): Promise<StockSummary[]>
  profile(symbol: string): Promise<StockProfile | null>
  /** Latest prices in cents keyed by symbol. Unknown symbols are omitted. */
  quotes(symbols: string[]): Promise<Record<string, number>>
  /** Daily closes, oldest first. */
  history(isin: string, days: number): Promise<PricePoint[]>
}
