import mongoose from 'mongoose'
import express, { Request, Response } from 'express'
import cors from 'cors'
import _ from 'lodash'

import user from './routes/user'
import stocks from './routes/stocks'
import auth from './routes/auth'
import positions from './routes/positions'

const app = express()
const serverPort = process.env.PORT || 3003
const clientPort = process.env.CLIENT_PORT || 3004
// const appOrigin = authConfig.appOrigin || `http://localhost:${clientPort}`;
const appOrigin = `http://localhost:${clientPort}`

const mongoDB = 'mongodb://mongo:27017/nacho-stocks'
// const mongoDB = 'mongodb://127.0.0.1:27017/nacho-stocks'
mongoose.connect(mongoDB)

export interface QueryPayload {
  payload: string
}

app.use(cors({ origin: appOrigin }))

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

app.listen(serverPort, () => {
  console.log(`Example app listening at http://localhost:${serverPort}`)
})
