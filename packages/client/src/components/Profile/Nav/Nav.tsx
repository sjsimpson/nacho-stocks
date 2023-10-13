import { useEffect, useRef, useState } from 'react'
import { NavLink as Link } from '../../../types/navlink'
import './Nav.scss'
import { SideNavItem } from 'm3-react'

import { useNavigate, useMatch } from 'react-router-dom'

type ProfileLink = Omit<Link, 'icon' | 'strictMatch'>

interface LinkProps {
  link: ProfileLink
  updateOffset?: (offset: number) => void
  updateWidth?: (width: number) => void
}
function Link(props: LinkProps) {
  const { link, updateOffset, updateWidth } = props
  const location = '/profile' + link.location
  const [active, setActive] = useState(false)

  const match = !!useMatch({ path: location, end: true })
  const navigate = useNavigate()
  const linkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('match', match)
    setActive(match)
  }, [match])

  useEffect(() => {
    if (active && linkRef.current) {
      if (updateOffset) {
        const offset = linkRef.current.offsetLeft
        updateOffset(offset)
      }

      if (updateWidth) {
        const width = linkRef.current.offsetWidth
        updateWidth(width)
      }
    }
  }, [active, updateOffset, updateWidth])

  return (
    <div
      className="profile-link"
      ref={linkRef}
      onClick={() => navigate(location)}
    >
      {link.label}
    </div>
  )
}

export function Nav() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const linkRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [overlayOffset, setOverlayOffset] = useState(0)
  const [overlayWidth, setOverlayWidth] = useState(0)

  const navLinks: ProfileLink[] = [
    {
      location: '/portfolio',
      label: 'Portfolio',
    },
    {
      location: '/account',
      label: 'Accout',
    },
  ]

  return (
    <div className="profile-nav">
      {navLinks.map((link) => (
        <Link
          link={link}
          updateOffset={(offset) => {
            setOverlayOffset(offset)
          }}
          updateWidth={(width) => {
            setOverlayWidth(width)
          }}
        />
      ))}
      <div
        ref={overlayRef}
        className="overlay"
        style={{ width: overlayWidth, translate: overlayOffset }}
      />
    </div>
  )
}

export default Nav
