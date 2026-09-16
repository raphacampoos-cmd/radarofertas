import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema/index.js'

const connectionString = process.env.DATABASE_URL!

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

// Para migrações e seeds (um único cliente)
export const migrationClient = postgres(connectionString, { max: 1 })

// Cliente principal (pool de ligações)
const queryClient = postgres(connectionString)

export const db = drizzle(queryClient, { schema })

export type DB = typeof db
