import { queryOptions } from '@tanstack/react-query'
import {
  getClassDashboard,
  getMyClasses,
  getStudentPortfolio,
} from './fns/classes'
import { getMyPortfolio } from './fns/portfolio'
import { getStock, searchStocks } from './fns/stocks'

export const stockSearchQuery = (q: string) =>
  queryOptions({
    queryKey: ['stocks', 'search', q],
    queryFn: () => searchStocks({ data: { q } }),
    enabled: q.trim().length > 0,
    staleTime: 5 * 60_000,
  })

export const stockQuery = (symbol: string) =>
  queryOptions({
    queryKey: ['stocks', symbol.toUpperCase()],
    queryFn: () => getStock({ data: { symbol } }),
  })

export const myPortfolioQuery = () =>
  queryOptions({
    queryKey: ['portfolio', 'me'],
    queryFn: () => getMyPortfolio(),
  })

export const myClassesQuery = () =>
  queryOptions({ queryKey: ['classes', 'mine'], queryFn: () => getMyClasses() })

export const classDashboardQuery = (slug: string) =>
  queryOptions({
    queryKey: ['classes', slug],
    queryFn: () => getClassDashboard({ data: { slug } }),
  })

export const studentPortfolioQuery = (slug: string, userId: string) =>
  queryOptions({
    queryKey: ['classes', slug, 'students', userId],
    queryFn: () => getStudentPortfolio({ data: { slug, userId } }),
  })
