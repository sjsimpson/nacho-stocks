import './IndividualStock.scss'

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import BuyWidget from './BuyWidget'

import { LoadingSpinner } from 'm3-react'
import PriceGraph from './PriceGraph'

// import { getStock, getStockPrice } from '../../api/stocksApi'
import { getStock, getStockPrice } from '../../queries/stocks'
import TradeWidget from './TradeWidget'
import TradeSection from './TradeSection'
import Card from '../common/Card'

export default function IndividualStock() {
  // let [stock, setStock] = useState<Stock | undefined>(undefined)
  // let [price, setPrice] = useState<number | undefined>(undefined)

  const { symbol } = useParams()
  const stock = getStock(symbol!)
  const price = getStockPrice(symbol!)

  // useEffect(() => {
  //   getStock(symbol!)
  //     .then((res) => {
  //       console.log('STOCK RESPONSE', res)
  //       setStock(res)
  //     })
  //     .catch((err) => {
  //       console.log('Error in useEffect', err)
  //     })
  // }, [])

  // useEffect(() => {
  //   getStockPrice(symbol!).then((res) => {
  //     setPrice(res.price)
  //   })
  // })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: 24 }}>
      <Card cardStyle="outlined">
        <div className="stock-page-header-container">
          <div className="stock-name-header">
            {stock.isSuccess ? (
              <div>
                <div className="stock-name">{stock.data.data.name}</div>
                <div className="stock-symbol">{stock.data.data.symbol}</div>
              </div>
            ) : (
              <LoadingSpinner size="large" />
            )}
          </div>
          <div className="stock-price-header">
            <div className="currency-symbol">$</div>
            {price.isSuccess ? (
              <div className="stock-price">{price.data.price.toFixed(2)}</div>
            ) : (
              <LoadingSpinner size="small" />
            )}
          </div>
        </div>
        <div className="graph">
          <PriceGraph symbol={symbol!} />
        </div>
      </Card>
      <TradeSection />
    </div>
  )
}
