import 'express'

declare module 'express-session' {
  interface SessionData {
    token: string
  }
}
