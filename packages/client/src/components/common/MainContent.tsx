import './MainContent.scss'

import { Breadcrumbs } from './Breadcrumbs'
import { useLocation } from 'react-router-dom'

export const MainContent = ({ children }: { children: any }) => {
  const location = useLocation()

  return (
    <div className="main-content">
      <div className="breadcrumbs-container">
        <Breadcrumbs />
      </div>
      <main className="content-wrapper">{children}</main>
    </div>
  )
}
