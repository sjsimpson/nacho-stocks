import _ from 'lodash'
const FINNHUB_TOKEN = 'cbumgh2ad3i8ctr83ob0'

export const getStocks = async () => {
  const endpoint: string = 'https://finnhub.io/api/v1/stock/symbol'
  const params: URLSearchParams = new URLSearchParams({
    exchange: 'US'
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

export default { getStocks, searchStocks, getPrices }
