import api from '../api'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'

export const getUserCash = (token: string | null, enabled = true) =>
  useQuery({
    queryFn: () => api.get('/user/cash', { headers: { 'x-api-token': token } }),
    queryKey: ['cash'],
    enabled: !!token && enabled,
  })

export const getUserInfo = (token: string | null, enabled = true) =>
  useQuery({
    queryFn: () => api.get('/user/info', { headers: { 'x-api-token': token } }),
    queryKey: ['user-info'],
    enabled: !!token && enabled,
  })

export const updateUser = () =>
  useMutation(
    ({ body, token }: { body: Omit<User, 'password'>; token: string }) =>
      api.patch('/user/', body, { headers: { 'x-api-token': token } })
  )

export const updateEmail = () =>
  useMutation(({ body, token }: { body: Pick<User, 'email'>; token: string }) =>
    api.patch('/user/email', body, { headers: { 'x-api-token': token } })
  )

export const updateUsername = () =>
  useMutation(
    ({ body, token }: { body: Pick<User, 'username'>; token: string }) =>
      api.patch('/user/username', body, { headers: { 'x-api-token': token } }),
    {
      onSuccess: () => {
        useQueryClient
      },
    }
  )

export const changeUserPassword = () =>
  useMutation(
    ({
      password,
      newPassword,
      token,
    }: {
      password: string
      newPassword: string
      token: string
    }) =>
      api.patch(
        '/user/update-password',
        {
          password,
          newPassword,
        },
        { headers: { 'x-api-token': token } }
      )
  )
