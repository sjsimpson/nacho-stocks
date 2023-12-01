import { Response, NextFunction } from 'express'
import jwt from 'njwt'
import dotenv from 'dotenv'
import { AuthenticatedRequest } from '../types/authenticatedRequest'

dotenv.config({ path: __dirname + '/../../../../.env' })

const jwtSecret = process.env.JWT_SECRET

export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers['x-api-token']
    if (!token) throw new Error('Auth token not povided!')

    const verifiedToken = jwt.verify(token, jwtSecret)
    if (!verifiedToken) throw new Error('Invalid token.')

    const userId = verifiedToken.body.toJSON().sub?.toString()
    if (!userId) throw new Error('Invalid user or corrupted token.')

    req.userId = userId
    next()
  } catch (error: any) {
    const err = new Error('Invalid token. Unable to authorize request.')
    res.status(400).send(err.message)
  }
}
