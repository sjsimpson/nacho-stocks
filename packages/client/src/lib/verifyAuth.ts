import { useAuthStore } from '../stores/authStore'
import { useMemo } from 'react'
import { useAuthQuery } from '../queries/auth'
import { useToasts } from '../context/ToastProvider'

export default function useVerifyAuth() {
  const token = useAuthStore((state) => state.token)
  const setToken = useAuthStore((state) => state.setToken)
  const toast = useToasts()

  const { query } = useAuthQuery(token)

  const valid = useMemo(() => {
    if (query.isError) {
      toast?.addToast({
        type: 'error',
        message: 'Your session has expired. Please log in again.',
      })
      setToken(null)
      return false
    }

    return true
  }, [query.isError])

  return { valid }
}
