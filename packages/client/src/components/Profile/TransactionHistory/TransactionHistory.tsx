import './TransactionHistory.scss'

import { useQuery } from '@tanstack/react-query'
import api from '../../../api'
import { useAuthStore } from '../../../stores/authStore'
import Card from './../../common/Card'
import Transaction from './Transaction'

function TransactionHistory() {
  const token = useAuthStore((state) => state.token)
  const transactions = useQuery({
    queryFn: () =>
      api.get('/transactions', { headers: { 'x-api-token': token } }),
    queryKey: ['transactions'],
  })

  return (
    <Card cardStyle="elevated">
      <h3 style={{ marginTop: '0px' }}>Transaction History</h3>
      <div className="history-contents">
        {transactions.isSuccess &&
          transactions.data.data.map(
            (transaction: Transaction, index: number) => (
              <Transaction
                key={transaction.symbol + index}
                transaction={transaction}
              />
            )
          )}
      </div>
    </Card>
  )
}

export default TransactionHistory
