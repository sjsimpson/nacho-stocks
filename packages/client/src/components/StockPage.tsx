import { useEffect } from 'react'
import { useParams, Outlet } from 'react-router-dom'

import { StockListItem } from './common/StockListItem'
import { Stock } from '../types/stocks'

export const StockPage = ({ stock }: { stock: Stock }) => {
  let { stockId } = useParams()

  useEffect(() => {
    console.log('loading stock')
  }, [])

  return (
    <div className="stocks">
      <span className="stocks-header">{stock.name}</span>
      <span className="symbol">{stock.symbol}</span>
      <span className="price">{100}</span>
      <div className="stock-id">{stockId}</div>
      <div className="graph">Graph</div>
    </div>
  )
}
