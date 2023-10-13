import TransactionModel from '../models/transaction'
import { getUserPosition, updatePosition } from './positionController'
import { getUser, removeCashFromUser, updateUser } from './userController'

const createTransaction = async (transaction: Transaction) => {
  const transactionCost = transaction.quantity * transaction.price
  switch (transaction.type) {
    case 'sale':
      const position = await getUserPosition(
        transaction.userId,
        transaction.symbol
      )

      if (!position || transaction.quantity > position.quantity) {
        throw Error("You can't sell stocks you don't have... sorry")
      }
      break
    case 'purchase':
      const user = await getUser(transaction.userId)

      if (!user || transactionCost > user.cashAssets) {
        throw Error('Insufficient funds for transaction')
      }
      break
  }

  const createdTransaction = await TransactionModel.create(transaction)
  await updatePosition(
    {
      userId: transaction.userId,
      symbol: transaction.symbol,
    },
    transaction.type === 'sale' ? -transaction.quantity : transaction.quantity
  )

  await removeCashFromUser(
    transaction.userId,
    transaction.quantity * transaction.price
  )
  return createdTransaction
}

const getTransaction = async (id: string) => {
  const transaction = await TransactionModel.findById(id)
  return transaction
}

const getUserTransactions = async (userId: string) => {
  const transactions = await TransactionModel.find({ userId })
  return transactions
}
export { createTransaction, getTransaction, getUserTransactions }
