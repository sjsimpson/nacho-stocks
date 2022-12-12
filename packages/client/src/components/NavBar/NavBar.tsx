import './NavBar.scss'

import { useState } from 'react'
import { useNavigate, useMatch } from 'react-router-dom'

import { useAuth } from '../auth'
import { Login } from '../Login'

import { IconVariants, NavItem } from 'm3-react'

interface NavBarProps {
  isOpen: boolean
  handleOpenNavDrawer: Function
}

interface INavItem {
  location: string
  label: string
  icon: IconVariants.IconStyles
  strictMatch: boolean
}

const NavBar = (props: NavBarProps) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const navigate = useNavigate()
  const auth = useAuth()

  const navLinks: INavItem[] = [
    {
      location: '/',
      label: 'Home',
      icon: IconVariants.IconStyles.home,
      strictMatch: true,
    },
    {
      location: '/stocks',
      label: 'Stocks',
      icon: IconVariants.IconStyles.monitoring,
      strictMatch: false,
    },
    {
      location: '/colors',
      label: 'Colors',
      icon: IconVariants.IconStyles.palette,
      strictMatch: false,
    },
    {
      location: '/components',
      label: 'Components',
      icon: IconVariants.IconStyles.list,
      strictMatch: false,
    },
    {
      location: '/about',
      label: 'About',
      icon: IconVariants.IconStyles.info,
      strictMatch: false,
    },
  ]

  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const handleLogout = (event: any) => {
    auth.logout()
  }

  const match = (path: string, activeOnlyWhenExact: boolean = false) =>
    !!useMatch({
      path,
      end: activeOnlyWhenExact,
    })

  return (
    <div className="navbar">
      <section className="navbar-left">
        <NavItem
          icon={
            props.isOpen
              ? IconVariants.IconStyles.menuOpen
              : IconVariants.IconStyles.menu
          }
          onClick={props.handleOpenNavDrawer}
        />
        {navLinks.map((link: INavItem) => (
          <NavItem
            match={match(link.location, link.strictMatch)}
            onClick={() => navigate(link.location)}
            icon={link.icon}
            label={link.label}
          />
        ))}
      </section>
      <section className="navbar-right">
        {!auth.token ? (
          <NavItem
            icon={IconVariants.IconStyles.login}
            label="Login"
            onClick={openModal}
          />
        ) : (
          <NavItem
            icon={IconVariants.IconStyles.logout}
            label="Logout"
            onClick={handleLogout}
          />
        )}
      </section>
      {showModal && <Login closeModal={closeModal} />}
    </div>
  )
}

export default NavBar
