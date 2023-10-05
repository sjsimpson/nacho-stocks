import { useState } from 'react'
import { useNavigate, useMatch } from 'react-router-dom'
import { Drawer, SideNav, SideNavItem, TopNav, TopNavItem } from 'm3-react'

import Login from '../Login'
import { useAuthStore } from '../../stores/authStore'
import useMediaQuery, { breakpoints } from '../../lib/useMediaQuery'
import { NavLink as Link } from '../../types/navlink'
import NavLink from './NavLink'
import DrawerLink from './DrawerLink'

export default function PrimaryNav() {
  const [showDrawer, setShowDrawer] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const navigate = useNavigate()
  const md = useMediaQuery(breakpoints.md)

  const token = useAuthStore((state) => state.token)
  const setToken = useAuthStore((state) => state.setToken)

  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const handleLogout = (event: any) => {
    setToken(null)
  }

  const match = (path: string, activeOnlyWhenExact: boolean = false) =>
    !!useMatch({
      path,
      end: activeOnlyWhenExact,
    })

  const navLinks: Link[] = [
    {
      location: '/',
      label: 'Home',
      icon: 'home',
      strictMatch: true,
    },
    {
      location: '/stocks',
      label: 'Stocks',
      icon: 'monitoring',
      strictMatch: false,
    },
    {
      location: '/about',
      label: 'About',
      icon: 'info',
      strictMatch: false,
    },
  ]

  return (
    <>
      {md ? (
        <SideNav
          topSection={
            <>
              {navLinks.map((link: Link) => (
                <NavLink key={link.location} link={link} />
              ))}
            </>
          }
          bottomSection={
            <>
              {token ? (
                <>
                  <NavLink
                    link={{
                      location: '/profile',
                      label: 'My Account',
                      icon: 'account_circle',
                      strictMatch: false,
                    }}
                  />
                  <SideNavItem
                    icon="logout"
                    label="Logout"
                    onClick={handleLogout}
                  />
                </>
              ) : (
                <SideNavItem icon="login" label="Login" onClick={openModal} />
              )}
            </>
          }
        />
      ) : (
        <>
          <TopNav
            leftSection={
              <TopNavItem
                icon={showDrawer ? 'menu_open' : 'menu'}
                onClick={() => setShowDrawer(true)}
              />
            }
            rightSection={<></>}
          />
          <Drawer
            isOpen={showDrawer}
            handleCloseDrawer={() => setShowDrawer(false)}
            drawerContentTop={
              <>
                <div
                  className="close-drawer-button-container"
                  style={{ marginLeft: '6px', marginBottom: '8px' }}
                >
                  <TopNavItem
                    icon={showDrawer ? 'menu_open' : 'menu'}
                    onClick={() => setShowDrawer(false)}
                  />
                </div>
                {navLinks.map((link: Link) => (
                  <DrawerLink
                    key={link.location}
                    link={link}
                    onClick={(e: any) => {
                      navigate(link.location)
                      setShowDrawer(false)
                    }}
                  />
                ))}
              </>
            }
          />
        </>
      )}

      {/* Login modal */}
      <Login open={showModal} closeModal={closeModal} />

      {/* Nav drawer */}
    </>
  )
}
