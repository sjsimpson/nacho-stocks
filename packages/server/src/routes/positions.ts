import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import jwt, { Jwt } from 'njwt'
import dotenv from 'dotenv'
import { verifyToken } from '../middleware'
import {
  createPosition,
  getPositionsByUser,
} from '../controllers/positionController'

dotenv.config({ path: __dirname + '/../../../../.env' })

const jsonParser = bodyParser.json()
const router = express.Router()

router
  .route('/')
  .get(verifyToken, async (req: Request, res: Response) => {
    try {
      console.log(`Getting stock positions for user: ${res.locals.userId}`)
      const positions = await getPositionsByUser(res.locals.userId!)
      res.send(positions)
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  })
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    try {
      const userId: string = res.locals.userId!
      console.log(`USER ID: ${userId}`)

      const position = await createPosition({ ...req.body, userId })

      res.send(position)
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  })

router
  .route('/:symbol')
  .get(verifyToken, async (req: Request, res: Response) => {
    try {
      const userId: string = res.locals.userId!
      console.log(`USER ID: ${userId}`)

      const position = await createPosition({ ...req.body, userId })

      res.send(position)
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  })

export default router
