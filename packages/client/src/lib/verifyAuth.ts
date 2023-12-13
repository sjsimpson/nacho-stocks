import { useAuthStore } from '../stores/authStore'
import { useMemo } from 'react'
import { useAuthQuery } from '../queries/auth'

export default function useVerifyAuth() {
  const token = useAuthStore((state) => state.token)
  const setToken = useAuthStore((state) => state.setToken)

  const { query } = useAuthQuery(token)

  const valid = useMemo(() => {
    console.log('token', token)
    console.log('query', query)
    if (query.isError) {
      setToken(null)
      return false
    }

    return true
  }, [query.isError])

  return { valid }
}
