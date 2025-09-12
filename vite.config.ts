import postgresPlugin from '@neondatabase/vite-plugin-postgres';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

const config = defineConfig({
	plugins: [
		postgresPlugin({
			seed: {
				type: 'sql-script',
				path: 'db/init.sql',
			},
			referrer: 'create-tanstack',
		}),

		// this is the plugin that enables path aliases
		viteTsConfigPaths({
			projects: ['./tsconfig.json'],
		}),
		tanstackStart({
			customViteReactPlugin: true,
		}),
		devtools(),
		viteReact(),
		tailwindcss(),
	],
});

export default config;
