import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useEffect, useMemo } from 'react'
import verifyAuth from '../lib/verifyAuth'
import { useToasts } from '../context/ToastProvider'

export default function RequireAuth({ children }: { children: any }) {
  const token = useAuthStore((state) => state.token)
  const setToken = useAuthStore((state) => state.setToken)
  const toast = useToasts()

  useEffect(() => {
    return () => {
      if (!valid) {
        toast?.addToast({
          type: 'error',
          message: 'Your session has expired. Please log in again.',
        })
        setToken(null)
      }
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
