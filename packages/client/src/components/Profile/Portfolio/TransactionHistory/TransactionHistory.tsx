import './TransactionHistory.scss'

import { useAuthStore } from '../../../../stores/authStore'
import Card from './../../../common/Card'
import Transaction from './Transaction'
import { getTransactions } from '../../../../queries/transactions'

function TransactionHistory() {
  const token = useAuthStore((state) => state.token)
  const transactions = token && getTransactions(token, !!token)

  return (
    <Card cardStyle="elevated">
      <h3 style={{ marginTop: '0px' }}>Transaction History</h3>
      <div className="history-contents">
        {transactions &&
          transactions.isSuccess &&
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
