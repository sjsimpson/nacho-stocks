import api from '../api'
import { useQuery } from '@tanstack/react-query'

export const getUserCash = (token: string, enabled = true) =>
  useQuery({
    queryFn: () => api.get('/user/cash', { headers: { 'x-api-token': token } }),
    queryKey: ['cash'],
    enabled,
  })
