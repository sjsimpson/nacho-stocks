import express, { Request, Response } from 'express'
import {
  getPrice,
  getPriceHistory,
  getStock,
  searchStocks,
} from '../controllers/stockController'

const router = express.Router()

router.get('/:symbol', async (req: Request, res: Response) => {
  try {
    const stocks = await getStock(req.params.symbol)
    res.send(stocks)
  } catch (error: any) {
    res.status(401).send(error.message)
  }
})

router.get('/:symbol/price', async (req: Request, res: Response) => {
  try {
    const price = await getPrice(req.params.symbol)
    res.send({ price })
  } catch (error: any) {
    res.status(500).send(error.message)
  }
})

router.get('/:symbol/price-history', async (req: Request, res: Response) => {
  try {
    const prices = await getPriceHistory(req.params.symbol)
    res.send(prices)
  } catch (error: any) {
    res.status(500).send(error.message)
  }
})

router.get('/search/:symbol', async (req: Request, res: Response) => {
  try {
    const stocks = await searchStocks(req.params.symbol)
    res.send(stocks)
  } catch (error: any) {
    res.status(401).send(error.message)
  }
})

export default router
