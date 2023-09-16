import mongoose from 'mongoose'
import sessions from 'express-session'
import MongoStore from 'connect-mongo'
import dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/../../../../.env' })
const sessionSecret = process.env.SESSION_SECRET

const oneDay = 1000 * 60 * 60 * 24

export default function sessionMiddleware() {
  if (!sessionSecret) {
    throw Error('Environment variable SIGNING_KEY key is not defined.')
  }

  return sessions({
    secret: sessionSecret,
    saveUninitialized: true,
    cookie: { maxAge: oneDay, secure: 'auto' },
    resave: false,
    store: MongoStore.create({
      clientPromise: mongoose.connection
        .asPromise()
        .then((connection) => connection.getClient()),
    }),
  })
}
