import { useEffect, useRef, useState } from 'react'
import { NavLink as Link } from '../../../types/navlink'
import './Nav.scss'
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
          key={link.location}
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
        className="overlay"
        style={{ width: overlayWidth, translate: overlayOffset }}
      />
    </div>
  )
}

export default Nav
