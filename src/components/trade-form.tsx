import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { placeTrade } from '@/lib/fns/portfolio'
import { formatCents } from '@/lib/money'
import { planTrade, type TradeType } from '@/lib/trading'

export function TradeForm({
  symbol,
  priceCents,
  cashCents,
  heldQuantity,
}: {
  symbol: string
  priceCents: number
  cashCents: number
  heldQuantity: number
}) {
  const queryClient = useQueryClient()
  const [type, setType] = useState<TradeType>('buy')
  const [quantity, setQuantity] = useState('')
  const [error, setError] = useState<string | null>(null)

  const qty = Number(quantity)
  const totalCents = Number.isFinite(qty) ? qty * priceCents : 0
  const maxBuy = Math.floor(cashCents / priceCents)

  const mutation = useMutation({
    mutationFn: () => placeTrade({ data: { type, symbol, quantity: qty } }),
    onSuccess: async (result) => {
      if (!result.ok) {
        setError(result.error)
        return
      }
      toast.success(
        `${type === 'buy' ? 'Bought' : 'Sold'} ${qty} ${symbol} at ${formatCents(result.priceCents)}`
      )
      setQuantity('')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['stocks', symbol] }),
        queryClient.invalidateQueries({ queryKey: ['portfolio'] }),
      ])
    },
    onError: () => setError('Trade failed. Try again.'),
  })

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Same check the server runs, for instant feedback.
    const plan = planTrade({
      type,
      quantity: qty,
      priceCents,
      cashCents,
      heldQuantity,
    })
    if (!plan.ok) {
      setError(plan.error)
      return
    }
    setError(null)
    mutation.mutate()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Trade {symbol}</h2>
        </CardTitle>
        <CardDescription>
          {formatCents(cashCents)} cash · {heldQuantity} shares owned
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form method="post" onSubmit={onSubmit}>
          <FieldGroup>
            <Tabs
              value={type}
              onValueChange={(v) => {
                setType(v as TradeType)
                setError(null)
              }}
            >
              <TabsList className="w-full" aria-label="Trade type">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="sell" disabled={heldQuantity === 0}>
                  Sell
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="quantity">Shares</FieldLabel>
              <Input
                id="quantity"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                max={type === 'buy' ? maxBuy : heldQuantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                aria-invalid={!!error}
                aria-describedby="quantity-help"
                required
              />
              <FieldDescription id="quantity-help">
                {type === 'buy'
                  ? `You can afford up to ${maxBuy} shares.`
                  : `You can sell up to ${heldQuantity} shares.`}
              </FieldDescription>
              {error && <FieldError role="alert">{error}</FieldError>}
            </Field>
            <p className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated total</span>
              <output htmlFor="quantity" className="font-medium tabular-nums">
                {formatCents(totalCents)}
              </output>
            </p>
            <Button type="submit" disabled={mutation.isPending || !quantity}>
              {mutation.isPending
                ? 'Placing trade…'
                : `${type === 'buy' ? 'Buy' : 'Sell'} ${symbol}`}
            </Button>
            <p className="text-xs text-muted-foreground">
              Trades fill at the latest delayed price, which may differ slightly
              from the price shown.
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
