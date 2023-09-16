import { useMutation, useQuery } from '@tanstack/react-query'
import { User } from '../types'
import api from '../api'

export const login = useMutation(
  ({ username, password }: Required<Pick<User, 'username' | 'password'>>) =>
    api.post('/auth/login', { username, password }),
  {
    onError: () => {},
    onSuccess: (data) => {
      console.log('inside onSuccess', data)
    },
  }
)

export const signup = useMutation(
  ({ username, password, email }: Required<User>) =>
    api.post('/user', { username, password, email }),
  {
    onError: () => {},
    onSuccess: () => {},
  }
)
// const login = useMutation(() => api.post('/auth/login', { user }) )
