import { useMutation, useQuery } from '@tanstack/react-query'
import api from '../api'

export const getTransactions = (token: string, enabled = true) =>
  useQuery({
    queryFn: () =>
      api.get('/transactions', { headers: { 'x-api-token': token } }),
    queryKey: ['transactions'],
    enabled,
  })

export const useBuyStock = () =>
  useMutation(
    ({
      symbol,
      quantity,
      token,
    }: {
      symbol: string
      quantity: number
      token: string
    }) =>
      api.post(
        '/transactions',
        {
          symbol,
          quantity,
          type: 'purchase',
        },
        { headers: { 'x-api-token': token } }
      )
  )

export const useSellStock = () =>
  useMutation(
    ({
      symbol,
      quantity,
      token,
    }: {
      symbol: string
      quantity: number
      token: string
    }) =>
      api.post(
        '/transactions',
        {
          symbol,
          quantity,
          type: 'sale',
        },
        { headers: { 'x-api-token': token } }
      )
  )
