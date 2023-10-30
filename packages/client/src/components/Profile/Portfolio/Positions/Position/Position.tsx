import { useEffect, useState } from 'react'
import { getStock, getStockPrice } from '../../../../../queries/stocks'
import './Position.scss'
import { useNavigate } from 'react-router-dom'
import Trendline from '../../../../StockSearch/Trendline'

interface PositionProps {
  position: Position
}

function Position(props: PositionProps) {
  const { position } = props

  const navigate = useNavigate()

  const stock = getStock(position.symbol)
  const price = getStockPrice(position.symbol)

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
        <div className="name">{stock.isSuccess && stock.data.data.name}</div>
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
          $
          {price.isSuccess && (position.quantity * price.data.price).toFixed(2)}
        </div>
      </div>
      <div className="state-layer" />
    </div>
  )
}

export default Position
