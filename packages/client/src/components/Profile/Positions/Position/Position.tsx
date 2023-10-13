import { useEffect, useState } from 'react'
import { getStock, getStockPrice } from '../../../../api/stocksApi'
import clsx from 'clsx'
import './Position.scss'
import { useNavigate } from 'react-router-dom'
import PriceGraph from '../../../IndividualStock/PriceGraph'
import Trendline from '../../../StockSearch/Trendline'

interface PositionProps {
  position: Position
}

function Position(props: PositionProps) {
  const { position } = props
  const [stock, setStock] = useState<Stock | null>(null)
  const [price, setPrice] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)

    getStockPrice(position.symbol)
      .then((res) => {
        setPrice(res.price)
        setIsLoading(false)
      })
      .catch((err: any) => {
        console.log('Error')
        setIsLoading(false)
      })

    getStock(position.symbol)
      .then((res) => {
        console.log('loading stock', res)
        setStock(res)
        setIsLoading(false)
      })
      .catch((err: any) => {
        console.log('Error')
        setIsLoading(false)
      })
  }, [])

  return (
    <div
      className="position"
      onClick={() => navigate(`/stocks/${position.symbol}`)}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div className="name">{stock?.name}</div>
        <div className="symbol">{position.symbol}</div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', height: '52px' }}>
          <Trendline symbol={position.symbol} />
        </div>
        <div className="total">
          ${price && (position.quantity * price).toFixed(2)}
        </div>
      </div>
      <div className="state-layer" />
    </div>
  )
}

export default Position
