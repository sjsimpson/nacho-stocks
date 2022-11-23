import mongoose from 'mongoose'
import express, { Request, Response } from 'express'
import cors from 'cors'
import _ from 'lodash'

import user from './routes/user'
import stocks from './routes/stocks'
import auth from './routes/auth'
import positions from './routes/positions'

const app = express()
const port = 3003
const appPort = process.env.SERVER_PORT || 3004
// const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;
const appOrigin = `http://localhost:${appPort}`

const mongoDB = 'mongodb://127.0.0.1:27017/testing'
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
