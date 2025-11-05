import { z } from "zod";

const clientEnvSchema = z.object({
	VITE_BETTER_AUTH_URL: z.url(),
});

// Validate client environment
export const clientEnv = clientEnvSchema.parse(import.meta.env);
export type ClientEnv = z.infer<typeof clientEnvSchema>;
