import { Request } from 'express'
import { IncomingHttpHeaders } from 'http'

interface AuthenticatedRequest extends Request {
  headers: IncomingHttpHeaders & {
    'x-api-token'?: string
  }
  userId?: string
}
