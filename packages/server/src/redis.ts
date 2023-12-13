import { createClient } from 'redis'

const useRedisClient = (function () {
  const password = process.env.REDIS_PASSWORD
  const host = process.env.REDIS_HOST
  const port = process.env.REDIS_PORT

  if (!password || !host || !port) {
    throw Error('Redis misconfigured, update configuration.')
  }

  const client = createClient({
    password,
    socket: {
      host,
      port: parseInt(port),
    },
  })
  client.on('error', (err) => console.log('Redis Client Error', err))

  return () => client
})()

export { useRedisClient }
