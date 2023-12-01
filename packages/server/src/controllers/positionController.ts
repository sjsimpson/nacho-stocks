import { getPrice, getPriceHistory } from './stockController'
import PositionModel from '../models/position'
import { FilterQuery } from 'mongoose'

const createPosition = async (position: Position) => {
  const createdPosition = await PositionModel.create(position)
  return createdPosition
}

const getPosition = async (id: string) => {
  const position = await PositionModel.findById(id)
  return position
}

const updatePosition = async (
  filter: FilterQuery<Position>,
  quantity: number
) => {
  const position = await PositionModel.findOne(filter)
  const updatedPosition = await PositionModel.findOneAndUpdate(
    { ...filter },
    { ...filter, quantity: position ? position.quantity + quantity : quantity },
    { upsert: true, new: true }
  )
  return updatedPosition
}

const getUserPosition = async (userId: string, symbol: string) => {
  const positions = await PositionModel.findOne({ userId, symbol })
  return positions
}

const getUserPositions = async (userId: string) => {
  const positions = await PositionModel.find({ userId })
  return positions
}

const getCurrentPortfolioValue = async (userId: string) => {
  const positions = await getUserPositions(userId)

  const stocks = await Promise.all(
    positions.map(async ({ symbol, quantity }) => {
      const price: number = await getPrice(symbol)
      return { symbol, price, quantity }
    })
  )

  const value = stocks
    .map((stock) => stock.quantity * stock.price)
    .reduce((acc, totalPrice) => acc + totalPrice)
  console.log('portfolio value', value)

  return value.toFixed(2)
}

const getPortfolioPerformanceHistory = async (userId: string) => {
  const positions = await getUserPositions(userId)

  const priceHistories = await Promise.all(
    positions.map(async ({ symbol, quantity }) => {
      return await getPriceHistory(symbol, quantity)
    })
  )

  let portfolioValueHistory: { x: number; y: number }[] = []

  priceHistories.map((history, index) => {
    if (index === 0) {
      portfolioValueHistory = [...history]
    } else {
      history.map((point, history_index) => {
        portfolioValueHistory[history_index].x = history_index
        portfolioValueHistory[history_index].y += point.y
      })
    }
  })

  if (portfolioValueHistory.length === 0)
    throw Error('Unable to get value history')

  return portfolioValueHistory
}

// const getGainsLosses = async (userId: string) => {
//   const currentValue = await getCurrentPortfolioValue(userId)
//
//   // fix this, because we're pinging the db twice and don't need to
//   const transactions = await getTransactionsByUser(userId)
//   const positions = await getPositionsByUser(userId)
//
//   const baseValue = transactions.map((transaction) => )
//
//   const initialValue = positions
//     .map((position) => position.price * position.quantity)
//     .reduce((acc, totalPrice) => acc + totalPrice)
//
//   const difference = parseInt(currentValue) - initialValue
//   console.log('difference', difference)
//
//   return difference.toFixed(2)
// }

export {
  getPosition,
  createPosition,
  getUserPosition,
  getUserPositions,
  // getGainsLosses,
  getPortfolioPerformanceHistory,
  getCurrentPortfolioValue,
  updatePosition,
}
