interface BaseTransaction {
  userId: string
  symbol: string
  type: 'purchase' | 'sale'
  price: number
  quantity: number
}

interface Purchase extends BaseTransaction {
  type: 'purchase'
  sold: boolean
}

interface Sale extends BaseTransaction {
  type: 'sale'
}

type Transaction = Purchase | Sale
