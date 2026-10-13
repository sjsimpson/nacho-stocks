import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { normalizeSymbol } from '@/lib/server/market'
import {
  TradeError,
  executeTrade,
  getPortfolio,
  getValueHistory,
} from '@/lib/server/portfolio'
import { authed } from '@/lib/middleware'

export const getMyPortfolio = createServerFn({ method: 'GET' })
  .middleware([authed])
  .handler(async ({ context }) => {
    const [portfolio, history] = await Promise.all([
      getPortfolio(context.user.id),
      getValueHistory(context.user.id),
    ])
    return { portfolio: portfolio!, history }
  })

export const placeTrade = createServerFn({ method: 'POST' })
  .middleware([authed])
  .validator(
    z.object({
      type: z.enum(['buy', 'sell']),
      symbol: z.string().min(1).max(12),
      quantity: z.number().int().positive().max(1_000_000),
    })
  )
  .handler(async ({ data, context }) => {
    try {
      const trade = await executeTrade({
        userId: context.user.id,
        type: data.type,
        symbol: normalizeSymbol(data.symbol),
        quantity: data.quantity,
      })
      return { ok: true as const, priceCents: trade.priceCents }
    } catch (e) {
      if (e instanceof TradeError)
        return { ok: false as const, error: e.message }
      throw e
    }
  })
