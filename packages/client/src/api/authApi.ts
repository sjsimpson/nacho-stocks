import { User } from '../types'

export async function login(user: User): Promise<string> {
  const res = await fetch('http://localhost:3003/auth/login', {
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
