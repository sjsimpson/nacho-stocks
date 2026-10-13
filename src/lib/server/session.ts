import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from './auth'

export async function getSession() {
  return auth.api.getSession({ headers: getRequestHeaders() })
}
