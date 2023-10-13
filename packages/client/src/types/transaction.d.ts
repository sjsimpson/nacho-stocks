interface Transaction {
  symbol: string
  price: number
  type: 'purchase' | 'sale'
  quantity: number
}
