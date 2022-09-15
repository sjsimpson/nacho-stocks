import _ from 'lodash'

export const _symbolLookup = async (query: string, token: string | undefined) => {
  if (!token) {
    throw Error("Finnhub Token is undefined. Unable to interact with API.")
  }

  const endpoint = 'https://finnhub.io/api/v1/search'
  const params: URLSearchParams = new URLSearchParams({
    q: query
  })
  const requestUrl: URL = new URL(`${endpoint}?` + params)
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': token
    }
  }

  try {
    const response = await fetch(requestUrl, config)
    return response.json()
  } catch (e) {
    console.log('Error:', e)
  }
}

export const getFinancials = async (symbol: string, token: string | undefined) => {
  if (!token) {
    throw Error("Finnhub Token is undefined. Unable to interact with API.")
  }

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
      'X-Finnhub-Token': token
    }
  }

  try {
    const response = await fetch(requestUrl, config)
    return response.json()
  } catch (e) {
    console.log('Error:', e)
  }
}

export const getPrices = async (symbol: string, token: string | undefined) => {
  if (!token) {
    throw Error("Finnhub Token is undefined. Unable to interact with API.")
  }

  const endpoint = 'https://finnhub.io/api/v1/quote'
  const params: URLSearchParams = new URLSearchParams({ symbol })
  const requestUrl: URL = new URL(`${endpoint}?` + params)
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': token
    }
  }

  try {
    const response = await fetch(requestUrl, config)
    return response.json()
  } catch (e) {
    console.log('Error:', e)
  }
}

export const searchStocks = async (query: string, token: string | undefined) => {
  if (!token) {
    throw Error("Finnhub Token is undefined. Unable to interact with API.")
  }

  try {
    const lookupResponse = await _symbolLookup(query, token)
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

export const getStock = async (symbol: string, token: string | undefined) => {
  if (!token) {
    throw Error("Finnhub Token is undefined. Unable to interact with API.")
  }

  const endpoint = 'https://finnhub.io/api/v1/stock/profile2'
  const params: URLSearchParams = new URLSearchParams({
    symbol
  })

  const requestUrl: URL = new URL(`${endpoint}?` + params)
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': token
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

export const getPriceHistory = async (symbol: string, token: string | undefined) => {
  if (!token) {
    throw Error("Finnhub Token is undefined. Unable to interact with API.")
  }

  const now = Date.now()
  const lastWeek = now - 2592000000

  const nowString = now.toString()
  const nowFiltered = nowString.substring(0, nowString.length - 3)
  const lastWeekString = lastWeek.toString()
  const lastWeekFiltered = lastWeekString.substring(0, lastWeekString.length - 3)

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
      'X-Finnhub-Token': token
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
