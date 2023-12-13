import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import { useToasts } from '../context/ToastProvider'

export const useAuthQuery = (token: string | null, enabled = true) => {
  const queryKey = ['auth']

  const toasts = useToasts()
  const queryClient = useQueryClient()

  const options = {
    onSuccess: () => {
      queryClient.resetQueries(queryKey)
      queryClient.invalidateQueries(queryKey)
    },
    onError: (err: any) => {
      toasts?.addToast({ type: 'error', message: err.toString() })
    },
  }

  const verifyAuth = async () => {
    return await api
      .get('/auth/verify', {
        headers: { 'Content-Type': 'application/json', 'x-api-token': token },
      })
      .then((res) => res.data)
  }

  const doLogin = async ({
    username,
    password,
  }: Required<Pick<User, 'username' | 'password'>>) => {
    return await api.post('/auth/login', { username, password })
  }

  const doSignup = async ({
    username,
    password,
    email,
  }: Required<Omit<User, 'cashAssets'>>) => {
    return await api.post('/user', { username, password, email })
  }

  const query = useQuery({
    queryFn: verifyAuth,
    queryKey,
    retry: false,
    enabled: !!token && enabled,
  })

  const login = useMutation(doLogin, options)
  const signup = useMutation(doSignup, options)

  return { query, login, signup }
}
