import api from '../api'
import { useQuery } from '@tanstack/react-query'

export const getPositions = (token: string, enabled = true) =>
  useQuery({
    queryFn: () => api.get('/positions', { headers: { 'x-api-token': token } }),
    queryKey: ['positions'],
    enabled,
  })

export const getPositionValue = (token: string, enabled = true) =>
  useQuery({
    queryFn: () =>
      api.get('/positions/value', { headers: { 'x-api-token': token } }),
    queryKey: ['value'],
    enabled,
  })

export const getPerformanceHistory = (token: string, enabled = true) =>
  useQuery({
    queryFn: () =>
      api.get('/positions/performance-history', {
        headers: { 'x-api-token': token },
      }),
    queryKey: ['history'],
    enabled,
  })
