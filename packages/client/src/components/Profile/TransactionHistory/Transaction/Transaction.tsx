import './Transaction.scss'

import { useEffect, useState } from 'react'
import { getStock } from '../../../../api/stocksApi'
import clsx from 'clsx'

import { useNavigate } from 'react-router-dom'

interface TransactionProps {
  transaction: Transaction
}
function Transaction(props: TransactionProps) {
  const { transaction } = props
  const [stock, setStock] = useState<Stock | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    getStock(transaction.symbol)
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
      className="transaction"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/stocks/${transaction.symbol}`)}
    >
      <div>
        <div className="header">Type</div>
        <div className="value">{transaction.type.toUpperCase()}</div>
      </div>
      <div>
        <div className="header">Stock</div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: 8,
          }}
        >
          <div className={clsx('name', isLoading && 'placeholder')}>
            {stock?.name}
          </div>
          <div className={clsx('symbol', isLoading && 'placeholder')}>
            {transaction.symbol}
          </div>
        </div>
      </div>

      <div className="price">
        <div className="header">Price</div>
        <div className="value">${transaction.price.toFixed(2)}</div>
      </div>

      <div className="quantity">
        <div className="header">Quantity</div>
        <div className="value">{transaction.quantity}</div>
      </div>

      <div className="total">
        <div className="header">Total</div>
        <div className="value">
          ${(transaction.price * transaction.quantity).toFixed(2)}
        </div>
      </div>
      <div className="state-layer" />
    </div>
  )
}

export default Transaction
