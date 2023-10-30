import './Transaction.scss'

import clsx from 'clsx'

import { useNavigate } from 'react-router-dom'
import { getStock } from '../../../../../queries/stocks'

interface TransactionProps {
  transaction: Transaction
}
function Transaction(props: TransactionProps) {
  const { transaction } = props

  const navigate = useNavigate()

  const stock = getStock(transaction.symbol)

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
          <div className={clsx('name', stock.isLoading && 'placeholder')}>
            {stock.isSuccess && stock.data.data.name}
          </div>
          <div className={clsx('symbol', stock.isLoading && 'placeholder')}>
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
