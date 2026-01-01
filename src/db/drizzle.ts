import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { serverEnv } from "@/config/server-env";
import * as schema from "./schema";

config({ path: ".env.local" }); // or .env
// config({ path: [".env.local", ".env"] });

const isSeeding = process.env.DB_SEEDING === "true";
const isMigrating = process.env.DB_MIGRATING === "true";

export const db = drizzle(serverEnv.DATABASE_URL, {
	schema,
	logger: isSeeding || isMigrating,
});

export type db = typeof db;
export default db;
