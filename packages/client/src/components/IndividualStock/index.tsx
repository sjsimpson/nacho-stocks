import './style.scss'

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { BuyWidget } from './BuyWidget'

import { Button, ButtonTypes } from '../common/Button'
import { Loading, LoaderSizes } from '../common/Loading'
import { Icon, IconTypes } from '../common/Icon'
import { PriceGraph } from './PriceGraph'
import { Stock } from '../../types/stocks'

import { getStock, getStockPrice } from '../../api/stocksApi'

export const IndividualStock = () => {
  let [stock, setStock] = useState<Stock | undefined>(undefined)
  let [price, setPrice] = useState<number | undefined>(undefined)
  let [numberToBuy, setNumberToBuy] = useState<number>(1)

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
      setPrice(res.c)
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
            <Loading size={LoaderSizes.large} />
          )}
        </div>
        <div className="stock-price-header">
          <div className="currency-symbol">$</div>
          {price ? (
            <div className="stock-price">{price}</div>
          ) : (
            <Loading size={LoaderSizes.small} />
          )}
        </div>
      </div>
      <div className="graph">
        <PriceGraph symbol={symbol!} />
      </div>
      <div>
        {price ? (
          <BuyWidget price={price} />
        ) : (
          <Loading size={LoaderSizes.small} />
        )}
      </div>
    </div>
  )
}
