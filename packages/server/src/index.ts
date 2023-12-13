import mongoose from 'mongoose'
import express, { Request, Response } from 'express'
import cors from 'cors'
import _ from 'lodash'
import user from './routes/user'
import stocks from './routes/stocks'
import auth from './routes/auth'
import transactions from './routes/transactions'
import positions from './routes/positions'
import { useRedisClient } from './redis'
// import { redisInstance } from './redis'

const SERVER_PORT = process.env.PORT || 3003
const CLIENT_PORT = process.env.CLIENT_PORT || 3000
// const appOrigin = authConfig.appOrigin || `http://localhost:${clientPort}`;
const APP_ORIGIN =
  process.env.NODE_ENV === 'dev'
    ? `http://localhost:${CLIENT_PORT}`
    : 'https://nachostocks.com'
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/nacho-stocks'

mongoose.set('strictQuery', false)
mongoose.connect(MONGO_URI)

useRedisClient().connect()
// redisInstance.connect()

export interface QueryPayload {
  payload: string
}

const app = express()

app.use(cors({ origin: APP_ORIGIN }))

app.get('/', (req: Request, res: Response) => {
  const responseData: QueryPayload = {
    payload: _.snakeCase('Server data returned successfully'),
  }

  res.json(responseData)
})

app.use('/auth', auth)
app.use('/user', user)
app.use('/stocks', stocks)
app.use('/positions', positions)
app.use('/transactions', transactions)

app.listen(SERVER_PORT, () => {
  console.log(`Example app listening at http://localhost:${SERVER_PORT}`)
})
