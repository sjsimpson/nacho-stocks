import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
// import { useAuth } from './auth'

export default function RequireAuth({ children }: { children: any }) {
  const location = useLocation()
  const token = useAuthStore((state) => state.token)
  // const auth = useAuth()
  if (!token) {
    return <Navigate to="/" state={{ path: location.pathname }} />
  }

  return children
}
