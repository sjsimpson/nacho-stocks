import { User, IUser } from '../models/user'

const createUser = async (user: IUser) => {
  console.log('Adding user to database')

  const createdUser = await User.create(user)
  return createdUser
}

const getUser = async (id: string) => {
  console.log(`Checking for user by id: ${id}`)

  const user = await User.findById(id)
  return user
}

export { createUser, getUser }
