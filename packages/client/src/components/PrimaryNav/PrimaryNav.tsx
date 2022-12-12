import './PrimaryNav.scss'

import { useState } from 'react'
import { useNavigate, useMatch } from 'react-router-dom'

import { useAuth } from '../auth'
import { Login } from '../Login'

import { IconVariants, NavItem } from 'm3-react'

interface INavItem {
  location: string
  label: string
  icon: IconVariants.IconStyles
  strictMatch: boolean
}

interface PrimaryNavProps {
  isOpen: boolean
  handleOpenSecondaryNav: Function
}

const PrimaryNav = (props: PrimaryNavProps) => {
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
    <div className="primary-nav">
      <section className="primary-nav-top">
        <NavItem
          icon={
            props.isOpen
              ? IconVariants.IconStyles.menuOpen
              : IconVariants.IconStyles.menu
          }
          onClick={props.handleOpenSecondaryNav}
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
      <section className="primary-nav-bottom">
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

export default PrimaryNav
