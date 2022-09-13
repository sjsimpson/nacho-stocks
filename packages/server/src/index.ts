import express, { Request, Response } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import jwt, { verify } from "njwt"
import _ from "lodash"

import { getUsers } from "./users"
import stocksApi from "./stocks"


const app = express()
const port = 3001
const appPort = process.env.SERVER_PORT || 3000;
// const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;
const appOrigin = `http://localhost:${appPort}`;

const jsonParser = bodyParser.json()

const signingKey = "super-secret-key-using-some-generator-like-secure-random"

export interface QueryPayload {
  payload: string;
}

app.use(cors({ origin: appOrigin }))

app.get("/", (req: Request, res: Response) => {
  const responseData: QueryPayload = {
    payload: _.snakeCase("Server data returned successfully"),
  };

  res.json(responseData);
});

app.post('/authenticate', jsonParser, async (req: Request, res: Response) => {

  console.log('req.body:', req.body)
  const { username, password } = req.body
  const users = getUsers()
  const foundUser = users.find((user) => user.username === username && user.password === password)

  if (!foundUser) {
    res.status(401).send('Unauthorized')
    return
  }

  const claims = { iss: 'machu', sub: foundUser.username }
  const token = jwt.create(claims, signingKey)
  token.setExpiration(new Date().getTime() + 60 * 60 * 1000)
  res.send(token.compact())
})

app.get('/stock/:symbol', async (req: Request, res: Response) => {
  try {
    // await _verifyToken(req)
    const stocks = await stocksApi.getStock(req.params.symbol)
    console.log('stocks', stocks)
    res.send(stocks)
  } catch (error: any) {
    res.status(401).send(error.message)
  }
})

app.get('/stocks/search/:symbol', async (req, res) => {
  try {
    const stocks = await stocksApi.searchStocks(req.params.symbol)
    console.log(stocks)
    res.send(stocks)
  } catch (error: any) {
    res.status(401).send(error.message)
  }
})

app.get('/stock/:symbol/price', async (req, res) => {
  try {
    const prices = await stocksApi.getPrices(req.params.symbol)
    console.log(prices)
    res.send(prices)
  } catch (error: any) {
    res.sendStatus(500)
  }
})

app.get('/stock/:symbol/price-history', async (req, res) => {
  try {
    const prices = await stocksApi.getPriceHistory(req.params.symbol)
    console.log(prices)
    res.send(prices)
  } catch (error: any) {
    res.sendStatus(500)
  }
})

app.get('/verify', async (req: Request, res: Response) => {
  try {
    const verifiedJwt = await _verifyToken(req)
    res.send(verifiedJwt)
  } catch (error: any) {
    res.status(401).send(error.message)
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


const _verifyToken = async (req: Request) => {
  const token: string = <string>req.headers['x-api-token']

  if (!token) {
    throw Error('Unable to verify JWT token!')
  }

  try {
    const verifiedJwt = jwt.verify(token, signingKey)
    return verifiedJwt
  } catch (error: any) {
    throw Error('Error identifying JWT token!')
  }
}

const _sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
