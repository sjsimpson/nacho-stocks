import { Position, IPosition } from '../models/position'

const createPosition = async (position: IPosition) => {
  console.log('Adding position to database')

  const createdPosition: IPosition = await Position.create(position)
  return createdPosition
}

const getPosition = async (id: string) => {
  console.log(`Checking for position by id: ${id}`)

  const position = await Position.findById(id)
  return position
}

const getPositionsByUser = async (userId: string) => {
  console.log(`Getting positions by userId: ${userId}`)

  const positions = await Position.find({ userId })
  return positions
}

export { createPosition, getPosition, getPositionsByUser }
