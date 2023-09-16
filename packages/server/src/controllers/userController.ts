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

export { createUser, getUser }
