import { neon } from "@neondatabase/serverless";
// import { serverEnv } from "@/config/env";
import { serverEnv } from "@/config/server-env";

let client: ReturnType<typeof neon>;

export async function getClient() {
	// if (!process.env.DATABASE_URL) {
	if (serverEnv.DATABASE_URL) {
		return;
	}
	if (!client) {
		// client = await neon(process.env.DATABASE_URL!);
		client = await neon(serverEnv.DATABASE_URL);
	}
	return client;
}
