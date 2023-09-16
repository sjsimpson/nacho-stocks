import './MainContent.scss'

// import Breadcrumbs from './Breadcrumbs'
import React from 'react'
import { useLocation } from 'react-router-dom'

export default function MainContent({
  children,
}: {
  children: React.ReactNode
}) {
  const location = useLocation()

  return (
    <div className="main-content">
      {/* <div className="breadcrumbs-container">
        <Breadcrumbs />
      </div> */}
      <main className="content-wrapper">{children}</main>
    </div>
  )
}
