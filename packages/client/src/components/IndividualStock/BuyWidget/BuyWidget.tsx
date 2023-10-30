import './BuyWidget.scss'

import { useState } from 'react'
import { Button, Icon } from 'm3-react'

import { useAuthStore } from '../../../stores/authStore'
import { useToasts } from '../../../context/ToastProvider'
import { useBuyStock, useSellStock } from '../../../queries/transactions'

export default function BuyWidget({
  price,
  symbol,
}: {
  price: number
  symbol: string
}) {
  const [quantity, setQuantity] = useState<number>(1)
  const [active, setActive] = useState<boolean>(false)

  const toast = useToasts()
  const token = useAuthStore((state) => state.token)
  const buyStock = useBuyStock()
  const sellStock = useSellStock()

  const increment = (event: any) => {
    event.preventDefault()
    setQuantity(quantity + 1)
  }

  const decrement = (event: any) => {
    event.preventDefault()
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleInput = (event: any) => {
    setQuantity(parseInt(event.target.value))
  }

  const buy = () => {
    if (token) {
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
    if (token) {
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
    <div className="buy-widget">
      <div className="buy-container">
        <div className="mini-button" onClick={increment}>
          <Icon icon="add" />
        </div>
        <div className={active ? 'input-container active' : 'input-container'}>
          <input
            value={quantity}
            onInput={handleInput}
            type="number"
            min="1"
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
          />
        </div>
        <div className="mini-button" onClick={decrement}>
          <Icon icon="remove" />
        </div>
      </div>
      <div className="button-container">
        {!token && (
          <div className="auth-warning">
            You must sign in to purchase stocks.
          </div>
        )}
        <Button
          variant="filled"
          text={`Buy for $${(quantity * price!).toFixed(2)}`}
          disabled={!token || buyStock.isLoading}
          onClick={() => buy()}
        />
      </div>
    </div>
  )
}
