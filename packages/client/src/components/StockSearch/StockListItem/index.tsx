import './style.scss';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoadingSpinner, LoadingSpinnerVariants } from 'm3-react'

import { Trendline } from '../Trendline'
import { Stock } from '../../../types/stocks'

import { getStockPrice } from '../../../api/stocksApi'

export const StockListItem = ({ stock }: { stock: Stock }) => {
  const [price, setPrice] = useState<number | undefined>(undefined)
  const navigate = useNavigate()

  useEffect(() => {
    getStockPrice(stock.symbol)
      .then((res) => {
        setPrice(res.price)
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
      <div className="list-item-content">
        <div className="stock-container-left">
          <div className="stock-name-container">
            <div className="stock-symbol">{stock.symbol}</div>
            <div className="stock-name">{stock.name}</div>
          </div>
          <div className="trendlines">
            <Trendline symbol={stock.symbol} />
          </div>
        </div>
        <div className="stock-container-right">
          <div className="currency-symbol">$</div>
          {price ? (
            <div className="stock-price">{price.toFixed(2)}</div>
          ) : (
            <LoadingSpinner
              size={LoadingSpinnerVariants.LoadingSpinnerSizes.small}
            />
          )}
        </div>
      </div>
    </div>
  )
}
