import UserModel from '../models/user'

const createUser = async ({
  username,
  password,
  email,
}: Omit<User, 'cashAssets'>) => {
  console.log('Adding user to database')
  const existingUser = await UserModel.findOne({ username })
  if (existingUser) throw Error('Username already in use, please pick another')

  const user = await UserModel.create({
    username,
    password,
    email,
    cashAssets: 50000,
  })

  return user
}

const getUser = async (id: string) => {
  const user = await UserModel.findById(id)

  if (!user) throw Error('Unable to find user.')

  return user
}

const updateUser = async (id: string, user: Partial<User>) => {
  const newUser = await UserModel.findByIdAndUpdate(id, user)

  return newUser
}

const updateEmail = async (id: string, user: Pick<User, 'email'>) => {
  const existingUsers = await UserModel.find({ email: user.email })

  existingUsers.map((foundUser) => {
    if (foundUser._id.toString() !== id) {
      throw Error(
        'Unable to update user. User already exists with this username/email'
      )
    }
  })

  return await updateUser(id, user)
}

const updateUsername = async (id: string, user: Pick<User, 'username'>) => {
  const existingUsers = await UserModel.find({ username: user.username })

  existingUsers.map((foundUser) => {
    if (foundUser._id.toString() !== id) {
      throw Error(
        'Unable to update user. User already exists with this username/email'
      )
    }
  })

  return await updateUser(id, user)
}

const addCashToUser = async (id: string, cash: number) => {
  const user = await UserModel.findById(id)

  if (!user) throw Error('Unable to find user.')

  const updatedUser = await UserModel.findByIdAndUpdate(
    id,
    { cashAssets: user.cashAssets + cash },
    { new: true }
  )
  return updatedUser
}

const updateUserCash = async (id: string, cash: number) => {
  const user = await UserModel.findById(id)

  if (!user) throw Error('Unable to find user.')

  const updatedUser = await UserModel.findByIdAndUpdate(
    id,
    { cashAssets: user.cashAssets - cash },
    { new: true }
  )
  return updatedUser
}

const changeUserPassword = async (
  id: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await UserModel.findById(id)

  if (!user) throw Error('Unable to find user.')
  if (user.password !== oldPassword) throw Error('Incorrect password.')

  await UserModel.findByIdAndUpdate(id, { password: newPassword })
}

export {
  createUser,
  getUser,
  updateUser,
  addCashToUser,
  updateUserCash,
  changeUserPassword,
  updateUsername,
  updateEmail,
}
