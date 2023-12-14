import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import useVerifyAuth from '../lib/verifyAuth'

export default function RequireAuth({ children }: { children: any }) {
  const { valid } = useVerifyAuth()
  const token = useAuthStore((state) => state.token)

  if (!token || !valid) {
    return <Navigate to="/" replace />
  }
  return children
}
