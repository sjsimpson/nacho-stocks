import PositionModel from '../models/position'
import { getPrice, getStock } from './stockController'

const createPosition = async (position: Position) => {
  console.log('Adding position to database')

  const createdPosition = await PositionModel.create(position)
  return createdPosition
}

const getPosition = async (id: string) => {
  console.log(`Checking for position by id: ${id}`)

  const position = await PositionModel.findById(id)
  return position
}

const getPositionsByUser = async (userId: string) => {
  console.log(`Getting positions by userId: ${userId}`)

  const positions = await PositionModel.find({ userId })
  return positions
}

const getCurrentPortfolioValue = async (userId: string) => {
  const stockMap: { [key: string]: { quantity: number; price: number } } = {}

  const positions = await getPositionsByUser(userId)

  positions.forEach((position) => {
    if (stockMap[position.symbol]) {
      stockMap[position.symbol].quantity += position.quantity
    } else {
      const object = { quantity: position.quantity, price: 0 }
      stockMap[position.symbol] = object
    }
  })

  const stocks = await Promise.all(
    Object.keys(stockMap).map(async (symbol) => {
      const price: number = await getPrice(symbol)
      return { symbol, price, quantity: stockMap[symbol].quantity }
    })
  )

  const value = stocks
    .map((stock) => stock.quantity * stock.price)
    .reduce((acc, totalPrice) => acc + totalPrice)

  console.log(value)

  return value.toFixed(2)
}

const getGainsLosses = () => {}

export {
  createPosition,
  getPosition,
  getPositionsByUser,
  getCurrentPortfolioValue,
}
