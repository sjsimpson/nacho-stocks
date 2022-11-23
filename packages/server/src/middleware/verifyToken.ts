import { Request, Response, NextFunction } from 'express'
import jwt, { Jwt, JwtBody } from 'njwt'
import dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/../../../../.env' })

const signingKey = process.env.SIGNING_KEY

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: string = <string>req.headers['x-api-token']
    if (!token) throw new Error('Auth token not povided!')

    const verifiedToken = jwt.verify(token, signingKey)
    if (!verifiedToken) throw new Error('Invalid token.')

    const userId = verifiedToken.body.toJSON().sub?.toString()
    if (!userId) throw new Error('Invalid user or corrupted token.')

    res.locals.userId = userId
    next()
  } catch (error: any) {
    const err = new Error('Invalid token. Unable to authorize request.')
    res.status(400).send(err.message)
  }
}
