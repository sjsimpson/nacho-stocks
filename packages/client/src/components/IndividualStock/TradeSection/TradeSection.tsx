import { parseInt } from 'lodash'
import { Button } from 'm3-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useToasts } from '../../../context/ToastProvider'
import { getStockPrice } from '../../../queries/stocks'
import { useBuyStock, useSellStock } from '../../../queries/transactions'
import { useAuthStore } from '../../../stores/authStore'
import Card from '../../common/Card'
import TradeToggle from './TradeToggle'

function TradeSection() {
  const { symbol } = useParams()

  const toast = useToasts()
  const token = useAuthStore((state) => state.token)

  const [mode, setMode] = useState<Transaction['type']>('purchase')
  const [quantity, setQuantity] = useState(1)

  const price = getStockPrice(symbol!)

  const buyStock = useBuyStock()
  const sellStock = useSellStock()

  const handleChange = (e: any) => {
    e.preventDefault()

    setQuantity(parseInt(e.target.value))
  }

  const buy = () => {
    if (token && symbol) {
      buyStock.mutate(
        { symbol, quantity, token },
        {
          onError: () => {
            toast?.addToast({
              type: 'error',
              message: 'Error purchasing stock, please try again later.',
            })
          },
          onSuccess: () => {
            toast?.addToast({
              type: 'success',
              message: 'Stock purchase successful!',
            })
          },
        }
      )
    }
  }

  const sell = () => {
    if (token && symbol) {
      sellStock.mutate(
        { symbol, quantity, token },
        {
          onError: () => {
            toast?.addToast({
              type: 'error',
              message: 'Error purchasing stock, please try again later.',
            })
          },
          onSuccess: () => {
            toast?.addToast({
              type: 'success',
              message: 'Stock purchase successful!',
            })
          },
        }
      )
    }
  }

  return (
    <Card cardStyle="outlined" style={{ width: '400px' }}>
      <TradeToggle mode={mode} setMode={setMode} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
          <div>Price</div>
          <div>{price.isSuccess ? price.data.price : ''}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
          <div>Shares</div>
          <input
            value={quantity}
            type="number"
            min={1}
            onChange={handleChange}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
          <div>Total</div>
          <div>
            ${price.isSuccess ? (price.data.price * quantity).toFixed(2) : ''}
          </div>
        </div>
      </div>

      <Button
        text={mode === 'purchase' ? 'Buy' : 'Sell'}
        disabled={!token || buyStock.isLoading || sellStock.isLoading}
        onClick={() => (mode === 'purchase' ? buy() : sell())}
      />
    </Card>
  )
}

export default TradeSection
