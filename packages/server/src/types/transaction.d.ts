interface Transaction {
  userId: string
  symbol: string
  price: number
  type: 'purchase' | 'sale'
  quantity: number
}
