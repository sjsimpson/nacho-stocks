import { useMutation, useQuery } from '@tanstack/react-query'
import { User } from '../types'
import api from '../api'

export const useLogin = () =>
  useMutation(
    ({ username, password }: Required<Pick<User, 'username' | 'password'>>) =>
      api.post('/auth/login', { username, password })
  )

export const useSignup = () =>
  useMutation(({ username, password, email }: Required<User>) =>
    api.post('/user', { username, password, email })
  )
