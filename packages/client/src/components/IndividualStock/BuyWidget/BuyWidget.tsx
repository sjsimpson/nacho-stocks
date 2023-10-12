import './BuyWidget.scss'

import { useState } from 'react'
import { Button, Icon } from 'm3-react'

import { useAuthStore } from '../../../stores/authStore'
import { useMutation } from '@tanstack/react-query'
import api from '../../../api'
import { useToasts } from '../../../context/ToastProvider'

export default function BuyWidget({
  price,
  symbol,
}: {
  price: number
  symbol: string
}) {
  const [numberToBuy, setNumberToBuy] = useState<number>(1)
  const [active, setActive] = useState<boolean>(false)

  const toast = useToasts()
  const token = useAuthStore((state) => state.token)

  const increment = (event: any) => {
    event.preventDefault()
    setNumberToBuy(numberToBuy + 1)
  }

  const decrement = (event: any) => {
    event.preventDefault()
    if (numberToBuy > 1) {
      setNumberToBuy(numberToBuy - 1)
    }
  }

  const handleInput = (event: any) => {
    setNumberToBuy(parseInt(event.target.value))
  }

  const buyStock = useMutation(
    () =>
      api.post(
        '/positions',
        {
          symbol,
          price,
          quantity: numberToBuy,
        },
        { headers: { 'x-api-token': token } }
      ),
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

  return (
    <div className="buy-widget">
      <div className="buy-container">
        <div className="mini-button" onClick={increment}>
          <Icon icon="add" />
        </div>
        <div className={active ? 'input-container active' : 'input-container'}>
          <input
            value={numberToBuy}
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
          text={`Buy for $${(numberToBuy * price!).toFixed(2)}`}
          disabled={!token || buyStock.isLoading}
          onClick={() => {
            buyStock.mutate()
            console.log('clicked buy')
          }}
        />
      </div>
    </div>
  )
}
