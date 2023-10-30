import './TradeToggle.scss'

import { MouseEventHandler, useEffect, useRef, useState } from 'react'

interface Option {
  label: string
  type: Transaction['type']
}

interface OptionProps {
  active: boolean
  link: Option
  onClick: MouseEventHandler
  updateOffset?: (offset: number) => void
  updateWidth?: (width: number) => void
}
function ToggleItem(props: OptionProps) {
  const { active, link, onClick, updateOffset, updateWidth } = props

  const linkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (active && linkRef.current) {
      if (updateOffset) {
        const offset = linkRef.current.offsetLeft
        updateOffset(offset)
      }

      if (updateWidth) {
        const width = linkRef.current.offsetWidth
        updateWidth(width)
      }
    }
  }, [active, updateOffset, updateWidth])

  return (
    <div className="profile-link" ref={linkRef} onClick={onClick}>
      {link.label}
    </div>
  )
}

interface TradeToggleProps {
  mode: Transaction['type']
  setMode: (type: Transaction['type']) => void
}
export function TradeToggle(props: TradeToggleProps) {
  const { mode, setMode } = props

  const [overlayOffset, setOverlayOffset] = useState(0)
  const [overlayWidth, setOverlayWidth] = useState(0)

  const options: Option[] = [
    {
      label: 'Buy',
      type: 'purchase',
    },
    {
      label: 'Sell',
      type: 'sale',
    },
  ]

  return (
    <div className="profile-nav">
      {options.map((option) => (
        <ToggleItem
          key={option.type}
          active={mode === option.type}
          link={option}
          onClick={() => {
            setMode(option.type)
          }}
          updateOffset={(offset) => {
            setOverlayOffset(offset)
          }}
          updateWidth={(width) => {
            setOverlayWidth(width)
          }}
        />
      ))}
      <div
        className="overlay"
        style={{ width: overlayWidth, translate: overlayOffset }}
      />
    </div>
  )
}

export default TradeToggle
