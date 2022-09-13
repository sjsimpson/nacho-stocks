import './styles/PrimaryNav.scss'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from './auth'
import { Login } from './Login'

import { Button, ButtonTypes } from './common/Button'
import { IconTypes } from './common/Icon'
import { NavLink } from './common/NavLink'
import { NavItem } from './common/NavItem'

export const PrimaryNav = ({
  isOpen,
  handleOpenSecondaryNav,
}: {
  isOpen: boolean
  handleOpenSecondaryNav: Function
}) => {
  // export const PrimaryNav = () => {
  // const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const navigate = useNavigate()
  const auth = useAuth()

  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const handleLogout = (event: any) => {
    auth.logout()
    navigate('/')
  }

  const handleTitleClick = (event: any) => {
    console.log('title click')
    navigate('/')
  }

  const handleHover = () => {}

  return (
    <div className="primary-nav">
      <section className="primary-nav-top">
        <NavItem
          icon={isOpen ? IconTypes.closeMenu : IconTypes.openMenu}
          onClick={handleOpenSecondaryNav}
        />
        <NavLink
          to="/"
          icon={IconTypes.home}
          label="Home"
          activeOnlyWhenExact
        />
        <NavLink to="/stocks" icon={IconTypes.stocks} label="Stocks" />
        <NavLink
          to="/color-testing"
          icon={IconTypes.palette}
          label="Color Testing"
        />
        <NavLink to="/about" icon={IconTypes.info} label="About" />
        {/* </nav> */}
      </section>
      <section className="primary-nav-bottom">
        {!auth.token ? (
          <NavItem icon={IconTypes.login} label="Login" onClick={openModal} />
        ) : (
          <NavItem
            icon={IconTypes.logout}
            label="Logout"
            onClick={handleLogout}
          />
        )}
      </section>
      {showModal && <Login closeModal={closeModal} />}
    </div>
  )
}
