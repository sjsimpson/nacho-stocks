import UserModel from '../models/user'

const createUser = async ({
  username,
  password,
  email,
}: Omit<User, 'cashAssets'>) => {
  console.log('Adding user to database')
  const user = await UserModel.create({
    username,
    password,
    email,
    cashAssets: 50000,
  })

  if (!user) throw Error('Unable to create new user.')
}

const getUser = async (id: string) => {
  console.log(`Checking for user by id: ${id}`)

  const user = await UserModel.findById(id)
  return user
}

const updateUser = async (id: string, user: Partial<User>) => {
  console.log('Updating user')

  const newUser = await UserModel.findByIdAndUpdate(id, user)

  return newUser
}

const addCashToUser = async (id: string, cash: number) => {
  const user = await UserModel.findById(id)

  if (user) {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { cashAssets: user?.cashAssets + cash },
      { new: true }
    )
    return updatedUser
  }

  throw Error('Unable to find user.')
}

const removeCashFromUser = async (id: string, cash: number) => {
  const user = await UserModel.findById(id)

  if (user) {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { cashAssets: user?.cashAssets - cash },
      { new: true }
    )
    return updatedUser
  }

  throw Error('Unable to find user.')
}

export { createUser, getUser, updateUser, addCashToUser, removeCashFromUser }
