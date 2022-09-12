import './styles/SecondaryNav.scss'

import { NavLink } from 'react-router-dom'

import { useState } from 'react'

export const SecondaryNav = ({ open }: { open: boolean }) => {
  // const [isOpen, setIsOpen] = useState<boolean>(true)
  return (
    <nav className={open ? 'side-nav open' : 'side-nav'}>
      <NavLink className="drawer-item" to="/">
        Home
      </NavLink>
      <NavLink className="drawer-item" to="/about">
        About
      </NavLink>
      <NavLink className="drawer-item" to="/stocks">
        Stocks
      </NavLink>
      <NavLink className="drawer-item" to="/color-testing">
        Color testing
      </NavLink>
    </nav>
  )
}
