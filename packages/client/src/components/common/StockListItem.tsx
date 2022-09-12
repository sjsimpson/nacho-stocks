import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Loading, LoaderSizes } from './Loading'
import './StockListItem.scss'

export interface Stock {
  name: string
  symbol: string
  price: number
}

export const StockListItem = ({ stock }: { stock: Stock }) => {
  const [price, setPrice] = useState<number | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStocks = async () => {
      const res = await fetch(
        `http://localhost:3001/stock/${stock.symbol}/price`
      )
      const prices = await res.json()
      console.log('response.text', prices)
      setPrice(prices.c)
    }
    fetchStocks()
      .then((res) => {
        setIsLoading(false)
      })
      .catch((err) => {
        console.log('Error in useEffect', err)
      })
  }, [])

  const handleClick = () => {
    navigate(stock.symbol)
  }

  return (
    <div onClick={handleClick} className="list-item">
      <div className="stock-container-left">
        <div className="stock-name-container">
          <div className="stock-name">{stock.name}</div>
          <div className="stock-symbol">{stock.symbol}</div>
        </div>
        <div className="trendlines">Graph</div>
      </div>
      <div className="stock-container-right">
        <div className="currency-symbol">$</div>
        {!isLoading ? (
          <div className="stock-price">{price}</div>
        ) : (
          <Loading size={LoaderSizes.small} />
        )}
      </div>
    </div>
  )
}
