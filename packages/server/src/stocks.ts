import _, { last } from 'lodash'

const FINNHUB_TOKEN = 'cbumgh2ad3i8ctr83ob0'

export const _symbolLookup = async (query: string) => {
  const endpoint = 'https://finnhub.io/api/v1/search'
  const params: URLSearchParams = new URLSearchParams({
    q: query
  })
  const requestUrl: URL = new URL(`${endpoint}?` + params)
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': FINNHUB_TOKEN
    }
  }

  try {
    const response = await fetch(requestUrl, config)
    return response.json()
  } catch (e) {
    console.log('Error:', e)
  }
}

export const getFinancials = async (symbol: string) => {
  const endpoint = 'https://finnhub.io/api/v1/stock/metric'
  const params: URLSearchParams = new URLSearchParams({
    symbol,
    metric: 'all'
  })
  const requestUrl: URL = new URL(`${endpoint}?` + params)
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': FINNHUB_TOKEN
    }
  }

  try {
    const response = await fetch(requestUrl, config)
    return response.json()
  } catch (e) {
    console.log('Error:', e)
  }
}

export const getPrices = async (symbol: string) => {
  const endpoint = 'https://finnhub.io/api/v1/quote'
  const params: URLSearchParams = new URLSearchParams({ symbol })
  const requestUrl: URL = new URL(`${endpoint}?` + params)
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': FINNHUB_TOKEN
    }
  }

  try {
    const response = await fetch(requestUrl, config)
    return response.json()
  } catch (e) {
    console.log('Error:', e)
  }
}

export const searchStocks = async (query: string) => {

  try {
    const lookupResponse = await _symbolLookup(query)
    const stocks = lookupResponse.result
      .filter((stock: any) => !stock.symbol.includes("."))
      .map((stock: any) => ({
        name: _.startCase(_.toLower(stock.description)),
        symbol: stock.displaySymbol
      }))

    return stocks
  } catch (e) {
    console.log('Error:', e)
  }
}

export const getStock = async (symbol: string) => {
  const endpoint = 'https://finnhub.io/api/v1/stock/profile2'
  const params: URLSearchParams = new URLSearchParams({
    symbol
  })

  const requestUrl: URL = new URL(`${endpoint}?` + params)
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': FINNHUB_TOKEN
    }
  }

  try {
    const response = await fetch(requestUrl, config)
    const rawStock = await response.json()
    const stock = {
      name: rawStock.name,
      symbol: rawStock.ticker
    }
    return stock
  } catch (e) {
    console.log('Error:', e)
  }
}

export const getPriceHistory = async (symbol: string) => {
  const now = Date.now()
  const lastWeek = now - 2592000000

  const nowString = now.toString()
  const nowFiltered = nowString.substring(0, nowString.length - 3)
  const lastWeekString = lastWeek.toString()
  const lastWeekFiltered = lastWeekString.substring(0, lastWeekString.length - 3)
  console.log('now', now)
  console.log('now-filtered', nowString.substring(0, nowString.length - 3))
  console.log('lastWeek', lastWeek.toString())
  console.log('lastWeek-filtered', lastWeek.toString())

  const endpoint = 'https://finnhub.io/api/v1/stock/candle'
  const params: URLSearchParams = new URLSearchParams({
    symbol: symbol,
    resolution: "D",
    from: lastWeekFiltered,
    to: nowFiltered,
  })

  const requestUrl: URL = new URL(`${endpoint}?` + params)
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': FINNHUB_TOKEN
    }
  }

  console.log('request-url', requestUrl)

  try {
    const response = await fetch(requestUrl, config)
    const rawPriceHistory = await response.json()
    const priceHistory = rawPriceHistory.c.map((price: number, index: number) => ({ x: index, y: price }))
    console.log('priceHistory', priceHistory)
    return priceHistory
  } catch (e) {
    console.log('Error:', e)
  }
}

export default { getStock, searchStocks, getPrices, getPriceHistory }
