import './style.scss'

import { useState } from 'react'
import { Button, ButtonTypes } from '../../common/Button'
import { Icon, IconTypes } from '../../common/Icon'

import { useAuth } from '../../auth'

export const BuyWidget = ({ price }: { price: number }) => {
  let [numberToBuy, setNumberToBuy] = useState<number>(1)
  let [active, setActive] = useState<boolean>(false)

  const auth = useAuth()

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

  return (
    <div className="buy-widget">
      <div className="buy-container">
        <div className="mini-button" onClick={increment}>
          <Icon icon={IconTypes.add} />
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
          <Icon icon={IconTypes.remove} />
        </div>
      </div>
      <div className="button-container">
        {!auth.token && (
          <div className="auth-warning">
            You must sign in to purchase stocks.
          </div>
        )}
        <Button
          type={ButtonTypes.filled}
          text={`Buy for $${(numberToBuy * price!).toFixed(2)}`}
          disabled={!auth.token}
          onClick={() => {
            console.log('clicked buy')
          }}
        />
      </div>
    </div>
  )
}
