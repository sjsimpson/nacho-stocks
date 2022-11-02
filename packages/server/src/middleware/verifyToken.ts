import { Request, Response, NextFunction } from 'express'
import jwt from 'njwt'
import dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/../../../../.env' })

const signingKey = process.env.SIGNING_KEY

const _verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: string = <string>req.headers['x-api-token']

    if (!token) {
      throw Error('Auth token not povided!')
    }

    const verifiedJwt = jwt.verify(token, signingKey)
    return verifiedJwt
  } catch (error: any) {
    throw Error('Auth token not recognized!')
  }
}
