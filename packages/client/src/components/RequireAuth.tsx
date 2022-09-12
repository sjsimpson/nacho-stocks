import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './auth'

export const RequireAuth = ({ children }: { children: any }) => {
  const location = useLocation()
  const auth = useAuth()
  if (!auth.token) {
    return <Navigate to="/login" state={{ path: location.pathname }} />
  }
  return children
}
