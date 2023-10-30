import './TradeWidget.scss'

import { Button } from 'm3-react'
import { useState } from 'react'
import clsx from 'clsx'

function TradeWidget() {
  const [show, setShow] = useState(false)
  return (
    <div className="trade">
      <Button
        className={clsx('trade-button', !show && 'hidden')}
        text="Trade"
        {...(show && { icon: 'close', iconOnly: true })}
        onClick={() => setShow(!show)}
      />
      <Button className={clsx('buy-button', !show && 'hidden')} text="Buy" />
      <Button className={clsx('sell-button', !show && 'hidden')} text="Sell" />
    </div>
  )
}

export default TradeWidget
