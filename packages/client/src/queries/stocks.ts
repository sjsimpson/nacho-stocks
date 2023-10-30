import { useQuery } from '@tanstack/react-query'
import api from '../api'

export const getPriceHistory = (symbol: string, enabled = true) =>
  useQuery({
    queryFn: () =>
      api.get(`/stocks/${symbol}/price-history`, {
        headers: { 'Content-Type': 'application/json' },
      }),
    queryKey: ['price-history', symbol],
    enabled,
  })

export const getStockPrice = (symbol: string, enabled = true) =>
  useQuery({
    queryFn: async () => {
      return await api
        .get(`/stocks/${symbol}/price`, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => res.data)
    },
    queryKey: ['price', symbol],
    enabled,
  })

export const getStock = (symbol: string, enabled = true) =>
  useQuery({
    queryFn: () =>
      api.get(`/stocks/${symbol}`, {
        headers: { 'Content-Type': 'application/json' },
      }),
    queryKey: ['stock', symbol],
    enabled,
  })

export const searchStocks = (symbol: string, enabled = true) =>
  useQuery<{ data: Stock[] }>({
    queryFn: () =>
      api.get(`/stocks/search/${symbol}`, {
        headers: { 'Content-Type': 'application/json' },
      }),
    queryKey: ['search', symbol],
    enabled,
  })
