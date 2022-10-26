import mongoose, { connect, mongo } from 'mongoose';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt, { verify } from 'njwt';
import _ from 'lodash';

import user from './routes/user';
import stocks from './routes/stocks';

import { getUser } from './users';

import { IUser } from './models/user';

const app = express();
const port = 3003;
const appPort = process.env.SERVER_PORT || 3004;
// const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;
const appOrigin = `http://localhost:${appPort}`;

const mongoDB = 'mongodb://127.0.0.1:27017/testing';
mongoose.connect(mongoDB);

const jsonParser = bodyParser.json();

const signingKey = 'super-secret-key-using-some-generator-like-secure-random';

export interface QueryPayload {
  payload: string;
}

app.use(cors({ origin: appOrigin }));

app.get('/', (req: Request, res: Response) => {
  const responseData: QueryPayload = {
    payload: _.snakeCase('Server data returned successfully'),
  };

  res.json(responseData);
});

app.post('/authenticate', jsonParser, async (req: Request, res: Response) => {
  console.log('req.body:', req.body);
  const { username, password } = req.body;
  const foundUser: IUser = await getUser(username, password);

  if (!foundUser) {
    res.status(401).send('Unauthorized');
    return;
  }

  const claims = { iss: 'machu', sub: foundUser.username };
  const token = jwt.create(claims, signingKey);
  token.setExpiration(new Date().getTime() + 60 * 60 * 1000);
  res.send(token.compact());
});

app.get('/verify', async (req: Request, res: Response) => {
  try {
    const verifiedJwt = await _verifyToken(req);
    res.send(verifiedJwt);
  } catch (error: any) {
    res.status(401).send(error.message);
  }
});

app.get('/test-connection', async (req: Request, res: Response) => {
  try {
    const connection = await mongoose.connection;
    console.log(connection);
    res.send(connection);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.use('/user', user);
app.use('/stocks', stocks);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const _verifyToken = async (req: Request) => {
  const token: string = <string>req.headers['x-api-token'];

  if (!token) {
    throw Error('Unable to verify JWT token!');
  }

  try {
    const verifiedJwt = jwt.verify(token, signingKey);
    return verifiedJwt;
  } catch (error: any) {
    throw Error('Error identifying JWT token!');
  }
};

const _sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
