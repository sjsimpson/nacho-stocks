import express, { Response } from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { verifyToken } from '../middleware'
import {
  createTransaction,
  getUserTransactions,
} from '../controllers/transactionController'
import { AuthenticatedRequest } from '../types/authenticatedRequest'

dotenv.config({ path: __dirname + '/../../../../.env' })

const jsonParser = bodyParser.json()
const router = express.Router()

router
  .route('/')
  .get(verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      console.log(`Getting stock transactions for user: ${req.userId}`)
      const transactions = await getUserTransactions(req.userId!)
      res.send(transactions)
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  })
  .post(
    verifyToken,
    jsonParser,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        console.log('req.body', req.body)

        const transaction = await createTransaction({
          ...req.body,
          userId: req.userId!,
        })

        res.send(transaction)
      } catch (error: any) {
        res.status(500).send(error.message)
      }
    }
  )

export default router
