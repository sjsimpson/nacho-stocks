import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { createUser, getUser } from '../controllers/userController'
import { verifyToken } from '../middleware'
import { AuthenticatedRequest } from '../types/authenticatedRequest'

const jsonParser = bodyParser.json()

const router = express.Router()

router
  .route('/')
  .get(verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      console.log(`Checking for user by id: ${req.userId}`)
      const user = await getUser(req.params.id)
      res.send(user)
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  })
  .post(jsonParser, async (req: Request, res: Response) => {
    try {
      await createUser(req.body)
      res.status(200).send('New user created!')
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  })

export default router
