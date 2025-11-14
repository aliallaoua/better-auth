import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL: z.url(),
	BETTER_AUTH_SECRET: z.string().min(32),
	GITHUB_CLIENT_ID: z.string(),
	GITHUB_CLIENT_SECRET: z.string(),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	RESEND_API_KEY: z.string(),
	NODE_ENV: z.enum(["development", "production", "test"]),
});

// Validate server environment
export const serverEnv = envSchema.parse(process.env);
export type ServerEnv = z.infer<typeof envSchema>;
