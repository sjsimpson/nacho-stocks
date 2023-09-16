import jwt, { Jwt } from 'njwt'
import dotenv from 'dotenv'
import UserModel from '../models/user'

dotenv.config()

const jwtSecret = process.env.JWT_SECRET

export const login = async (
  username: string,
  password: string,
  rememberMe: boolean = false
): Promise<Jwt> => {
  console.log(`Checking for user ${username}`)

  const user = await UserModel.findOne({ username, password })

  if (!user) throw Error('No user found matching username and password.')

  const claims = { iss: 'nacho-stocks', sub: user.id }
  const token: Jwt = jwt.create(claims, jwtSecret)

  if (!rememberMe) token.setExpiration(new Date().getTime() + 60 * 60 * 1000)
  return token
}
