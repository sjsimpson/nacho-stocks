import { useQuery } from '@tanstack/react-query'
import api from '../api'

import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode
}) {
  const location = useLocation()
  const token = useAuthStore((state) => state.token)
  // const auth = useAuth()
  if (!token) {
    return <Navigate to="/" state={{ path: location.pathname }} replace />
  }

  return children
}

export function Test({ children }: { children: any }) {
  // const location = useLocation()
  const token = useAuthStore((state) => state.token)
  const query = useQuery({
    queryFn: () =>
      api.get('/auth/authenticate', { headers: { 'x-api-token': token } }),
    enabled: !!token,
    refetchOnWindowFocus: true,
  })

  if (!token) return <Navigate to="/" replace />

  if (!query.isLoading && query.isError) return <Navigate to="/" replace />

  return children
}
