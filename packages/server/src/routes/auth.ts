import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { Jwt } from 'njwt'
import dotenv from 'dotenv'
import { login } from '../controllers/authController'

dotenv.config({ path: __dirname + '/../../../../.env' })

const jsonParser = bodyParser.json()
const router = express.Router()

router.post('/login', jsonParser, async (req: Request, res: Response) => {
  console.log('session', req.session)
  try {
    const { username, password, rememberMe } = req.body
    const token: Jwt = await login(username, password, rememberMe)

    req.session.token = token.compact()
    res.status(200).send()
  } catch (error: any) {
    res.status(500).send(error.message)
  }
})

export default router
