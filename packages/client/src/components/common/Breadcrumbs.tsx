import './Breadcrumbs.scss'
import _ from 'lodash'

import { useLocation, useNavigate } from 'react-router-dom'

export const Breadcrumbs = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleClick = (breadcrumb: string) => (event: any) => {
    event.preventDefault()
    const pathArray = location.pathname.split('/')
    const index = pathArray.indexOf(breadcrumb)

    navigate(
      pathArray
        .slice(0, index + 1)
        .reduce((string, current) => string + '/' + current)
    )
    // navigate(breadcrumb)
  }

  return (
    // I need to figure out how to link to nested breadcrumbs
    <div className="breadcrumbs">
      {location.pathname.split('/').map(
        (breadcrumb) =>
          breadcrumb !== '' && (
            <span key={breadcrumb}>
              <span>/ </span>
              <a className="breadcrumb" onClick={handleClick(breadcrumb)}>
                {breadcrumb}{' '}
              </a>
            </span>
          )
      )}
    </div>
  )
}
