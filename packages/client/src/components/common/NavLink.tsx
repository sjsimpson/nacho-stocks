import './NavLink.scss'

import { useState } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
import { Icon, IconTypes, IconWeights } from './Icon'

export const NavLink = ({
  to,
  icon,
  label,
  activeOnlyWhenExact = false,
}: {
  icon: IconTypes
  to: string
  label?: string
  activeOnlyWhenExact?: boolean
}) => {
  const navigate = useNavigate()
  const baseWeight = IconWeights.normal
  const pressedWeight = IconWeights.light
  const hoveredWeight = IconWeights.heavy

  let [isHovered, setIsHovered] = useState<boolean>(false)
  let [isPressed, setIsPressed] = useState<boolean>(false)

  let match = useMatch({
    path: to,
    end: activeOnlyWhenExact,
  })

  const handleClick = (event: any) => {
    event.preventDefault()
    navigate(to)
  }

  const claculateWeight = () =>
    isPressed ? pressedWeight : isHovered ? hoveredWeight : baseWeight

  return (
    <a
      className={match ? `nav-link active` : `nav-link`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <span className={label ? 'icon-container has-label' : 'icon-container'}>
        <span className="material-symbols-outlined">{icon}</span>
        {/* <Icon icon={icon} weight={claculateWeight()} filled={!!match} /> */}
      </span>
      {label && <div className="nav-label">{label}</div>}
    </a>
  )
}
