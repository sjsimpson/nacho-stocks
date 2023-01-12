import jwt, { Jwt } from 'njwt'
import dotenv from 'dotenv'
import { User } from '../models/user'

dotenv.config()

const signingKey = process.env.SIGNING_KEY

export const login = async (
  username: string,
  password: string,
  rememberMe: boolean = false
): Promise<Jwt> => {
  console.log(`Checking for user ${username}`)

  const user = await User.findOne({ username, password })

  if (!user) throw Error('No user found matching username and password.')

  const claims = { iss: 'nacho-stocks', sub: user.id }
  const token: Jwt = jwt.create(claims, signingKey)

  if (!rememberMe) token.setExpiration(new Date().getTime() + 60 * 60 * 1000)
  return token
}
