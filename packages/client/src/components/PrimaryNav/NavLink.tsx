import { SideNavItem } from 'm3-react'
import { NavLink as Link } from '../../types/navlink'

import { useNavigate, useMatch } from 'react-router-dom'

export default function NavLink({ link }: { link: Link }) {
  const match = !!useMatch({ path: link.location, end: link.strictMatch })
  const navigate = useNavigate()

  return (
    <SideNavItem
      key={link.location}
      match={match}
      onClick={() => navigate(link.location)}
      icon={link.icon}
      label={link.label}
    />
  )
}
