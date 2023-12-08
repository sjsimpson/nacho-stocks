import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import {
  createUser,
  getUser,
  updateUser,
  changeUserPassword,
  updateEmail,
} from '../controllers/userController'
import { login } from '../controllers/authController'
import { verifyToken } from '../middleware'
import { AuthenticatedRequest } from '../types/authenticatedRequest'

const jsonParser = bodyParser.json()

const router = express.Router()

router
  .route('/')
  .get(verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await getUser(req.params.id)
      res.send(user)
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  })
  .patch(
    verifyToken,
    jsonParser,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        await updateUser(req.userId!, req.body)
        res.status(204).send('User updated successfully')
      } catch (error: any) {
        res.status(500).send(error.message)
      }
    }
  )
  .post(jsonParser, async (req: Request, res: Response) => {
    try {
      const user = await createUser(req.body)
      const token = await login(user.username, user.password, false)

      res.status(200).send(token.compact())
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  })

router
  .route('/cash')
  .get(verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await getUser(req.userId!)
      const cash = user.cashAssets
      res.send({ cash })
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  })

router
  .route('/info')
  .get(verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await getUser(req.userId!)
      const { username, email, cashAssets } = user
      res.send({ username, email, cashAssets })
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  })

router
  .route('/update-password')
  .patch(
    verifyToken,
    jsonParser,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const { password, newPassword } = req.body
        await changeUserPassword(req.userId!, password, newPassword)
        res.status(200).send('Password successfully changed!')
      } catch (error: any) {
        res.status(500).send(error.message)
      }
    }
  )

router
  .route('/username')
  .patch(
    verifyToken,
    jsonParser,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const { username } = req.body
        if (!username)
          throw Error('New username must be included as a parameter.')
        await updateEmail(req.userId!, req.body)
        res.status(204).send('Username updated successfully')
      } catch (error: any) {
        res.status(500).send(error.message)
      }
    }
  )

router
  .route('/email')
  .patch(
    verifyToken,
    jsonParser,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const { email } = req.body
        if (!email) throw Error('New email must be included as a parameter.')
        await updateEmail(req.userId!, req.body)
        res.status(204).send('User email updated successfully')
      } catch (error: any) {
        res.status(500).send(error.message)
      }
    }
  )

export default router
