import './IndividualStock.scss'

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import BuyWidget from './BuyWidget'

import { LoadingSpinner } from 'm3-react'
import PriceGraph from './PriceGraph'

import { getStock, getStockPrice } from '../../api/stocksApi'

export default function IndividualStock() {
  let [stock, setStock] = useState<Stock | undefined>(undefined)
  let [price, setPrice] = useState<number | undefined>(undefined)

  const { symbol } = useParams()

  useEffect(() => {
    getStock(symbol!)
      .then((res) => {
        console.log('STOCK RESPONSE', res)
        setStock(res)
      })
      .catch((err) => {
        console.log('Error in useEffect', err)
      })
  }, [])

  useEffect(() => {
    getStockPrice(symbol!).then((res) => {
      setPrice(res.price)
    })
  })

  return (
    <div className="individual-stock">
      <div className="stock-page-header-container">
        <div className="stock-name-header">
          {stock ? (
            <div>
              <div className="stock-name">{stock?.name}</div>
              <div className="stock-symbol">{stock?.symbol}</div>
            </div>
          ) : (
            <LoadingSpinner size="large" />
          )}
        </div>
        <div className="stock-price-header">
          <div className="currency-symbol">$</div>
          {price ? (
            <div className="stock-price">{price.toFixed(2)}</div>
          ) : (
            <LoadingSpinner size="small" />
          )}
        </div>
      </div>
      <div className="graph">
        <PriceGraph symbol={symbol!} />
      </div>
      <div>
        {price ? (
          <BuyWidget symbol={symbol!} price={price} />
        ) : (
          <LoadingSpinner size="small" />
        )}
      </div>
    </div>
  )
}
