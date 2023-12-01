import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { Jwt } from 'njwt'
import { login } from '../controllers/authController'
import { verifyToken } from '../middleware'

const jsonParser = bodyParser.json()
const router = express.Router()

router.post('/login', jsonParser, async (req: Request, res: Response) => {
  try {
    const { username, password, rememberMe } = req.body
    const token: Jwt = await login(username, password, rememberMe)

    res.status(200).send(token.compact())
  } catch (error: any) {
    res.status(500).send(error.message)
  }
})

router.get(
  '/authenticate',
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      res.status(200)
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  }
)

export default router
