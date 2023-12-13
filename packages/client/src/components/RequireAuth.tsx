import { Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useToasts } from '../context/ToastProvider'
import useVerifyAuth from '../lib/verifyAuth'

export default function RequireAuth({ children }: { children: any }) {
  const { valid } = useVerifyAuth()
  const toast = useToasts()

  useEffect(() => {
    return () => {
      if (!valid) {
        toast?.addToast({
          type: 'error',
          message: 'Your session has expired. Please log in again.',
        })
      }
    }
  }, [])

  if (!valid) {
    console.log('valid', valid)
    return <Navigate to="/" replace />
  }
  return children
}
