import './styles/NavDrawer.scss'

import { NavLink } from 'react-router-dom'

export const NavDrawer = ({ open }: { open: boolean }) => {
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
