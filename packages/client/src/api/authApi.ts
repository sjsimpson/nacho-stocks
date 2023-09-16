import { User } from '../types'
import config from '../../config'

export async function login(user: User): Promise<string> {
  const res = await fetch(config.apiURL + '/auth/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })

  if (res.status !== 200) {
    throw new Error(res.statusText)
  }

  return res.text()
}

export async function signup(user: User): Promise<string> {
  const res = await fetch(config.apiURL + '/user', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })

  if (res.status !== 200) {
    throw new Error(res.statusText)
  }

  return res.text()
}
