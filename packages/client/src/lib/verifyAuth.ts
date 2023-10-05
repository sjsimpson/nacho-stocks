import jwt from 'jwt-decode'

interface DecodedJWT {
  iss: string
  sub: string
  jti: string
  iat: number
  exp: number
}

export default function verifyAuth(token: string) {
  // TODO: implement RSA signing to verify jwt client side
  const decoded: DecodedJWT = jwt(token)

  const expiration = new Date(decoded.exp * 1000)
  return expiration.getTime() > Date.now()
}
