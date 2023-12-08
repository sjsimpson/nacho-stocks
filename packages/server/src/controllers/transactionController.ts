import TransactionModel from '../models/transaction'
import { getUserPosition, updatePosition } from './positionController'
import { getPrice } from './stockController'
import { getUser, updateUserCash } from './userController'

const createTransaction = async ({
  userId,
  type,
  symbol,
  quantity,
}: Omit<Transaction, 'price'>) => {
  const price = await getPrice(symbol)
  const transactionTotal = quantity * price
  switch (type) {
    case 'sale':
      const position = await getUserPosition(userId, symbol)

      if (!position || quantity > position.quantity) {
        throw Error("You can't sell stocks you don't have... sorry")
      }
      break
    case 'purchase':
      const user = await getUser(userId)

      if (!user || transactionTotal > user.cashAssets) {
        throw Error('Insufficient funds for transaction')
      }
      break
  }

  const createdTransaction = await TransactionModel.create({
    userId,
    type,
    symbol,
    quantity,
    price,
  })

  await updatePosition(
    {
      userId: userId,
      symbol: symbol,
    },
    type === 'sale' ? -quantity : quantity
  )

  await updateUserCash(userId, (type === 'sale' ? -quantity : quantity) * price)
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
