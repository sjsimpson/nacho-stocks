import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { verifyToken } from '../middleware'
import {
  createPosition,
  getCurrentPortfolioValue,
  // getGainsLosses,
  getUserPosition,
  getUserPositions,
} from '../controllers/positionController'
import { AuthenticatedRequest } from '../types/authenticatedRequest'

dotenv.config({ path: __dirname + '/../../../../.env' })

const jsonParser = bodyParser.json()
const router = express.Router()

router
  .route('/')
  .get(verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const positions = await getUserPositions(req.userId!)
      res.send(positions)
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  })
  .post(
    verifyToken,
    jsonParser,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const position = await createPosition({
          ...req.body,
          userId: req.userId!,
        })

        res.send(position)
      } catch (error: any) {
        res.status(500).send(error.message)
      }
    }
  )

router
  .route('/value')
  .get(verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      console.log('getting portfolio value')
      const value = await getCurrentPortfolioValue(req.userId!)
      res.send({ value })
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  })

router
  .route('/:symbol')
  .get(verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const position = await getUserPosition(req.userId!, req.params.symbol)

      res.send(position)
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  })

// router
//   .route('/gains')
//   .get(verifyToken, async (req: AuthenticatedRequest, res: Response) => {
//     try {
//       const value = await getGainsLosses(req.userId!)
//       res.send({ value })
//     } catch (error: any) {
//       res.status(500).send(error.message)
//     }
//   })
export default router
