import jwt, { Jwt } from 'njwt'
import dotenv from 'dotenv'
import UserModel from '../models/user'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

export const login = async (
  username: string,
  password: string,
  rememberMe: boolean = false
): Promise<Jwt> => {
  console.log(`Checking for user ${username}`)
  console.log('JWT SECRET', JWT_SECRET)

  const user = await UserModel.findOne({ username, password })

  if (!user) throw Error('No user found matching username and password.')

  const claims = { iss: 'nacho-stocks', sub: user.id }
  const token: Jwt = jwt.create(claims, JWT_SECRET)

  if (rememberMe) {
    token.setExpiration(new Date().getTime() + 60 * 60 * 1000 * 240)
  } else {
    token.setExpiration(new Date().getTime() + 60 * 60 * 1000)
  }

  return token
}
