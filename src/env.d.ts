/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BETTER_AUTH_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare module "@types/node" {
	interface ProcessEnv {
		readonly DATABASE_URL: string;
		readonly DATABASE_URL_POOLER: string;
		readonly DB_MAX_CONNECTIONS?: string;
		readonly BETTER_AUTH_SECRET: string;
		readonly GITHUB_CLIENT_ID: string;
		readonly GITHUB_CLIENT_SECRET: string;
		readonly GOOGLE_CLIENT_ID: string;
		readonly GOOGLE_CLIENT_SECRET: string;
		readonly RESEND_API_KEY: string;
		readonly NODE_ENV: "development" | "production" | "test";
	}
}

export {};
