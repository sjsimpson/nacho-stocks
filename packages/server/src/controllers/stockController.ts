import _ from 'lodash'
import dotenv from 'dotenv'
// import { redisInstance } from '../redis'
import { useRedisClient } from '../redis'

dotenv.config()

const FINNHUB_TOKEN = process.env.FINNHUB_TOKEN
const BASE_URL = 'https://finnhub.io/api/v1'
const REDIS_EXPIRATION = 3600

// export const getFinancials = async (symbol: string) => {
//   if (!finnhubToken) {
//     throw Error('Finnhub Token is undefined. Unable to interact with API.')
//   }
//
//   const endpoint = `${baseUrl}/stock/metric`
//   const params: URLSearchParams = new URLSearchParams({
//     symbol,
//     metric: 'all',
//   })
//   const requestUrl: URL = new URL(`${endpoint}?` + params)
//   const config: RequestInit = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-Finnhub-Token': finnhubToken,
//     },
//   }
//
//   try {
//     const response = await fetch(requestUrl, config)
//     return response.json()
//   } catch (e) {
//     throw Error('Error getting financials from Finnhub.')
//   }
// }

export const getStock = async (symbol: string) => {
  if (!FINNHUB_TOKEN) {
    throw Error('Finnhub Token is undefined. Unable to interact with API.')
  }

  const endpoint = `${BASE_URL}/stock/profile2`
  const params: URLSearchParams = new URLSearchParams({
    symbol,
  })

  const requestUrl: URL = new URL(`${endpoint}?` + params)
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': FINNHUB_TOKEN,
    },
  }
  const redisKey = `stock:${symbol}`

  try {
    const cachedValue = await useRedisClient().get(redisKey)

    if (cachedValue) {
      return JSON.parse(cachedValue)
    }
    const response = await fetch(requestUrl, config)
    const rawStock = await response.json()
    const stock = {
      name: rawStock.name,
      symbol: rawStock.ticker,
    }

    await useRedisClient().setEx(
      redisKey,
      REDIS_EXPIRATION,
      JSON.stringify(stock)
    )
    return stock
  } catch (e) {
    throw Error('Error getting stock from Finnhub.')
  }
}

export const getPrice = async (symbol: string) => {
  // console.log('redis instance', redisInstance)
  if (!FINNHUB_TOKEN) {
    throw Error('Finnhub Token is undefined. Unable to interact with API.')
  }

  const endpoint = `${BASE_URL}/quote`
  const params: URLSearchParams = new URLSearchParams({ symbol })
  const requestUrl: URL = new URL(`${endpoint}?` + params)
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': FINNHUB_TOKEN,
    },
  }

  const redisKey = `price:${symbol}`

  try {
    const cachedPrice = await useRedisClient().get(redisKey)

    if (cachedPrice) {
      return parseInt(cachedPrice)
    }

    const response = await fetch(requestUrl, config)
    const price = await response.json()

    await useRedisClient().setEx(redisKey, REDIS_EXPIRATION, price.c.toString())

    return price.c
  } catch (e) {
    console.log('Error', e)
    throw Error('Error getting price from Finnhub.')
  }
}

// NOTE: Now a paid api because of the greedy fatcats at Finnhub

// export const getPriceHistory = async (
//   symbol: string,
//   quantity: number = 1
// ): Promise<{ x: number; y: number }[]> => {
//   if (!finnhubToken) {
//     throw Error('Finnhub Token is undefined. Unable to interact with API.')
//   }
//
//   const now = Date.now()
//   const lastWeek = now - 2592000000
//
//   const nowString = now.toString()
//   const nowFiltered = nowString.substring(0, nowString.length - 3)
//   const lastWeekString = lastWeek.toString()
//   const lastWeekFiltered = lastWeekString.substring(
//     0,
//     lastWeekString.length - 3
//   )
//
//   const endpoint = `${baseUrl}/stock/candle`
//   const params: URLSearchParams = new URLSearchParams({
//     symbol: symbol,
//     resolution: 'D',
//     from: lastWeekFiltered,
//     to: nowFiltered,
//   })
//
//   const requestUrl: URL = new URL(`${endpoint}?` + params)
//   const config: RequestInit = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-Finnhub-Token': finnhubToken,
//     },
//   }
//
//   try {
//     const response = await fetch(requestUrl, config)
//     const rawPriceHistory = await response.json()
//     const priceHistory: { x: number; y: number }[] = rawPriceHistory.c.map(
//       (price: number, index: number) => ({ x: index, y: price * quantity })
//     )
//     return priceHistory
//   } catch (e) {
//     throw Error('Error getting price history from Finnhub.')
//   }
// }

export const searchStocks = async (query: string) => {
  if (!FINNHUB_TOKEN) {
    throw Error('Finnhub Token is undefined. Unable to interact with API.')
  }

  const redisKey = `search:${query}`

  try {
    const cachedValue = await useRedisClient().get(redisKey)

    if (cachedValue) {
      return JSON.parse(cachedValue)
    }

    const lookupResponse = await _symbolLookup(query)
    const stocks = lookupResponse.result
      .filter((stock: any) => !stock.symbol.includes('.'))
      .map((stock: any) => ({
        name: _.startCase(_.toLower(stock.description)),
        symbol: stock.displaySymbol,
      }))

    await useRedisClient().setEx(
      redisKey,
      REDIS_EXPIRATION,
      JSON.stringify(stocks)
    )

    return stocks
  } catch (e) {
    throw Error('Error searching stocks in Finnhub.')
  }
}

const _symbolLookup = async (query: string) => {
  if (!FINNHUB_TOKEN) {
    throw Error('Finnhub Token is undefined. Unable to interact with API.')
  }

  const endpoint = `${BASE_URL}/search`
  const params: URLSearchParams = new URLSearchParams({
    q: query,
  })
  const requestUrl: URL = new URL(`${endpoint}?` + params)
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': FINNHUB_TOKEN,
    },
  }

  try {
    const response = await fetch(requestUrl, config)
    return response.json()
  } catch (e) {
    console.log('Error:', e)
  }
}
