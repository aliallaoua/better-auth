import { defineConfig } from "drizzle-kit";
// import { serverEnv } from "@/config/env";
import { serverEnv } from "./src/config/server-env";

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./migrations",
	dialect: "postgresql",
	dbCredentials: {
		// url: process.env.DATABASE_URL!,
		url: serverEnv.DATABASE_URL,
	},
});
