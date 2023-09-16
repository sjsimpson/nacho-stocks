import { NavLink as Link } from '../../types/navlink'
import { DrawerItem } from 'm3-react'
import { useMatch } from 'react-router-dom'
import { MouseEventHandler } from 'react'

export default function DrawerLink({
  link,
  onClick,
}: {
  link: Link
  onClick: MouseEventHandler
}) {
  const match = !!useMatch({ path: link.location, end: link.strictMatch })

  return (
    <DrawerItem
      key={link.location}
      icon={link.icon}
      label={link.label}
      onClick={onClick}
      match={match}
    />
  )
}
