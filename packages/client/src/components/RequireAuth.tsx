import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useEffect, useMemo } from 'react'
import verifyAuth from '../lib/verifyAuth'

export default function RequireAuth({ children }: { children: any }) {
  const token = useAuthStore((state) => state.token)
  const setToken = useAuthStore((state) => state.setToken)

  useEffect(() => {
    return () => {
      if (!valid) setToken(null)
    }
  }, [])

  const valid = useMemo(() => {
    if (!token) return false
    return verifyAuth(token)
  }, [token])

  if (!valid) return <Navigate to="/" replace />
  // if (!valid) return <Navigate to="/" state={{ path: location.pathname }} replace />

  return children
}
