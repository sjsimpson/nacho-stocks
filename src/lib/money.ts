export const toCents = (dollars: number) => Math.round(dollars * 100)

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const formatCents = (cents: number) => usd.format(cents / 100)

const pct = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'exceptZero',
})

export const formatPercent = (ratio: number) => pct.format(ratio)
