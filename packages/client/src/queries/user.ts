import config from '../../config'

export async function getPriceHistory(symbol: string): Promise<any> {
  const res = await fetch(`${config.apiURL}/stocks/${symbol}/price-history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res.json()
}

export async function getStockPrice(symbol: string): Promise<any> {
  const res = await fetch(`${config.apiURL}/stocks/${symbol}/price`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res.json()
}

export async function getStock(symbol: string): Promise<any> {
  const res = await fetch(`${config.apiURL}/stocks/${symbol}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return res.json()
}

export async function searchStocks(symbol: string): Promise<any> {
  const res = await fetch(`${config.apiURL}/stocks/search/${symbol}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res.json()
}
