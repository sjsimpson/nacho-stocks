import { Redis } from '@upstash/redis'
import { env } from './env'

interface Cache {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>
}

function memoryCache(): Cache {
  const store = new Map<string, { value: unknown; expires: number }>()
  return {
    async get<T>(key: string) {
      const hit = store.get(key)
      if (!hit || hit.expires < Date.now()) return null
      return hit.value as T
    },
    async set(key, value, ttlSeconds) {
      store.set(key, { value, expires: Date.now() + ttlSeconds * 1000 })
    },
  }
}

function upstashCache(url: string, token: string): Cache {
  const redis = new Redis({ url, token })
  return {
    get: (key) => redis.get(key),
    async set(key, value, ttlSeconds) {
      await redis.set(key, value, { ex: ttlSeconds })
    },
  }
}

/** Upstash in prod. In-memory locally when Upstash env vars are unset. */
export const cache: Cache =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? upstashCache(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN)
    : memoryCache()

/** Read-through cache. Null/undefined results are not cached. */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  load: () => Promise<T>
): Promise<T> {
  const hit = await cache.get<T>(key)
  if (hit !== null) return hit
  const value = await load()
  if (value !== null && value !== undefined) {
    await cache.set(key, value, ttlSeconds)
  }
  return value
}
