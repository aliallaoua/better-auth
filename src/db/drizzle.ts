import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

config({ path: '.env' }); // or .env.local

const isSeeding = process.env.DB_SEEDING === 'true';
const isMigrating = process.env.DB_MIGRATING === 'true';

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
  logger: isSeeding || isMigrating,
});

export type db = typeof db;
export default db;
