import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '@/lib/server/env'
import * as appSchema from './schema'
import * as authSchema from './auth-schema'

export const schema = { ...appSchema, ...authSchema }

const pool = new Pool({ connectionString: env.DATABASE_URL })

export const db = drizzle(pool, { schema })
export type DB = typeof db
export type Tx = Parameters<Parameters<DB['transaction']>[0]>[0]
