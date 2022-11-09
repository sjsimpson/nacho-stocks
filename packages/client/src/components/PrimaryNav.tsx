import './styles/PrimaryNav.scss'

import { useState } from 'react'
import { useNavigate, useMatch } from 'react-router-dom'

import { useAuth } from './auth'
import { Login } from './Login'

import { NavItem, IconVariants } from 'm3-react'

export const PrimaryNav = ({
  isOpen,
  handleOpenSecondaryNav,
}: {
  isOpen: boolean
  handleOpenSecondaryNav: Function
}) => {
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
            isOpen
              ? IconVariants.IconStyles.closeMenu
              : IconVariants.IconStyles.openMenu
          }
          onClick={handleOpenSecondaryNav}
        />
        <NavItem
          match={match('/', true)}
          onClick={() => navigate('/')}
          icon={IconVariants.IconStyles.home}
          label="Home"
        />
        <NavItem
          match={match('/stocks', false)}
          onClick={() => navigate('/stocks')}
          icon={IconVariants.IconStyles.stocks}
          label="Stocks"
        />
        <NavItem
          match={match('/color-testing', false)}
          onClick={() => navigate('/color-testing')}
          icon={IconVariants.IconStyles.palette}
          label="Color Testing"
        />
        <NavItem
          match={match('/component-testing', false)}
          onClick={() => navigate('/component-testing')}
          icon={IconVariants.IconStyles.list}
          label="Components"
        />
        <NavItem
          match={match('/about', false)}
          onClick={() => navigate('/about')}
          icon={IconVariants.IconStyles.info}
          label="About"
        />
        {/* </nav> */}
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
