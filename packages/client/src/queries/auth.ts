import { useMutation } from '@tanstack/react-query'
import api from '../api'

export const useLogin = () =>
  useMutation(
    ({ username, password }: Required<Pick<User, 'username' | 'password'>>) =>
      api.post('/auth/login', { username, password })
  )

export const useSignup = () =>
  useMutation(
    ({ username, password, email }: Required<Omit<User, 'cashAssets'>>) =>
      api.post('/user', { username, password, email })
  )
