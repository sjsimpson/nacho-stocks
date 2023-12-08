import api from '../api'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { useToasts } from '../context/ToastProvider'

export const useUserQuery = (token: string | null, enabled = true) => {
  const queryKey = ['user']

  const toasts = useToasts()
  const queryClient = useQueryClient()

  const options = {
    onSuccess: () => {
      toasts?.addToast({ type: 'success', message: 'Success' })
      queryClient.invalidateQueries(queryKey)
    },
    onError: (err: any) => {
      toasts?.addToast({ type: 'error', message: err.toString() })
    },
  }

  const getUserInfo = async () => {
    return await api.get('/user/info', { headers: { 'x-api-token': token } })
  }

  const patchUser = async ({ body }: { body: Omit<User, 'password'> }) => {
    return await api.patch('/user/', body, {
      headers: { 'x-api-token': token },
    })
  }

  const patchEmail = async ({
    body,
    token,
  }: {
    body: Pick<User, 'email'>
    token: string
  }) => {
    return await api.patch('/user/email', body, {
      headers: { 'x-api-token': token },
    })
  }

  const patchUsername = async ({
    body,
    token,
  }: {
    body: Pick<User, 'username'>
    token: string
  }) => {
    return await api.patch('/user/username', body, {
      headers: { 'x-api-token': token },
    })
  }

  const patchPassword = async ({
    password,
    newPassword,
    token,
  }: {
    password: string
    newPassword: string
    token: string
  }) => {
    return await api.patch(
      '/user/update-password',
      {
        password,
        newPassword,
      },
      { headers: { 'x-api-token': token } }
    )
  }

  const query = useQuery({
    queryFn: getUserInfo,
    queryKey,
    enabled: !!token && enabled,
  })
  const updateUser = useMutation(patchUser, options)
  const updateEmail = useMutation(patchEmail, options)
  const updateUsername = useMutation(patchUsername, options)
  const updatePassword = useMutation(patchPassword, options)

  return { query, updateUser, updateEmail, updateUsername, updatePassword }
}
