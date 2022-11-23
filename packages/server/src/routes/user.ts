import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import { createUser, getUser } from '../controllers/userController'
import { verifyToken } from '../middleware'

const jsonParser = bodyParser.json()

const router = express.Router()

router
  .route('/')
  .get(verifyToken, async (req: Request, res: Response) => {
    try {
      console.log(`Checking for user by id: ${res.locals.userId}`)
      const user = await getUser(req.params.id)
      res.send(user)
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  })
  .post(jsonParser, async (req: Request, res: Response) => {
    try {
      console.log(req.body)
      const user = await createUser(req.body)
      res.send(user)
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  })

export default router
