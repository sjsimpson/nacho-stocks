import './StockListItem.scss'

import { useNavigate } from 'react-router-dom'

import { LoadingSpinner } from 'm3-react'

import Trendline from '../Trendline'

import { getStockPrice } from '../../../queries/stocks'

interface StockListItemProps {
  stock: Stock
}
export default function StockListItem(props: StockListItemProps) {
  const { stock } = props

  const navigate = useNavigate()

  const price = getStockPrice(stock.symbol)

  const handleClick = () => {
    navigate(stock.symbol)
  }

  return (
    <div onClick={handleClick} className="list-item">
      <div className="list-item-content">
        <div className="stock-container-left">
          <div className="stock-name-container">
            <div className="stock-symbol">{stock.symbol}</div>
            <div className="stock-name">{stock.name}</div>
          </div>
          {/*<div className="trendlines">
            <Trendline symbol={stock.symbol} />
          </div>*/}
        </div>
        <div className="stock-container-right">
          <div className="currency-symbol">$</div>
          {price.isSuccess ? (
            <div className="stock-price">{price.data.price.toFixed(2)}</div>
          ) : (
            <LoadingSpinner size="small" />
          )}
        </div>
      </div>
    </div>
  )
}
