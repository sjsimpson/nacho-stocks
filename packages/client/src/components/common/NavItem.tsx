import './NavItem.scss'

import { useState } from 'react'
import { Icon, IconTypes, IconWeights } from './Icon'

export const NavItem = ({
  icon,
  label,
  onClick,
}: {
  icon: IconTypes
  label?: string
  onClick: Function
}) => {
  const baseWeight = IconWeights.normal
  const pressedWeight = IconWeights.light
  const hoveredWeight = IconWeights.heavy

  let [isHovered, setIsHovered] = useState<boolean>(false)
  let [isPressed, setIsPressed] = useState<boolean>(false)

  const handleClick = (event: any) => {
    event.preventDefault()
    onClick()
  }

  const claculateWeight = () =>
    isPressed ? pressedWeight : isHovered ? hoveredWeight : baseWeight

  return (
    <a
      className={'nav-item'}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <span className={label ? 'icon-container has-label' : 'icon-container'}>
        <Icon icon={icon} />
      </span>
      {label && <div className="nav-label">{label}</div>}
    </a>
  )
}
