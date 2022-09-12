import './Breadcrumbs.scss'
import _ from 'lodash'

import { useLocation, useNavigate } from 'react-router-dom'

export const Breadcrumbs = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    // I need to figure out how to link to nested breadcrumbs
    <div className="breadcrumbs">
      {location.pathname.split('/').map(
        (breadcrumb) =>
          breadcrumb !== '' && (
            <span key={breadcrumb}>
              <span>/ </span>
              <a className="breadcrumb" onClick={() => navigate(breadcrumb)}>
                {breadcrumb}{' '}
              </a>
            </span>
          )
      )}
    </div>
  )
}
