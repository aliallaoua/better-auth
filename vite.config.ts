import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
// import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import babel from "@rolldown/plugin-babel";

const config = defineConfig({
	server: {
		port: Number(process.env.PORT) || 3000,
	},
	resolve: {
		tsconfigPaths: true,
	},
	ssr: {
		external: ["postgres"],
		noExternal: ["drizzle-orm"],
	},
	optimizeDeps: {
		exclude: ["postgres", "zod"],
	},
	plugins: [
		devtools({
			editor: {
				name: "Antigravity",
				open: async (path, lineNumber, columnNumber) => {
					const { exec } = await import("node:child_process");
					exec(
						`antigravity -g "${path.replaceAll("$", "\\$")}${lineNumber ? `:${lineNumber}` : ""}${columnNumber ? `:${columnNumber}` : ""}"`
					);
				},
			},
		}),
		// nitro(),
		tailwindcss(),
		tanstackStart({
			router: {
				codeSplittingOptions: {
					defaultBehavior: [
						[
							"component",
							"pendingComponent",
							"errorComponent",
							"notFoundComponent",
							"loader",
						],
					],
				},
			},
		}),
		// viteReact({
		// 	babel: {
		// 		plugins: ["babel-plugin-react-compiler"],
		// 	},
		// }),
		viteReact(),
		babel({
			// We need to be explicit about the parser options after moving to @vitejs/plugin-react v6.0.0
			// This is because the babel plugin only automatically parses typescript and jsx based on relative paths (e.g. "**/*.ts")
			// whereas the previous version of the plugin parsed all files with a .ts extension.
			// This is causing our packages/ directory to fail to parse, as they are not relative to the CWD.
			parserOpts: { plugins: ["typescript", "jsx"] },
			presets: [reactCompilerPreset()],
		}),
	],
	build: {
		sourcemap: process.env.NODE_ENV === "production",
		rolldownOptions: {
			external: [/postgres/],
			output: {
				codeSplitting: {
					groups: [
						{
							name: "icons",
							test: /node_modules[\\/]lucide-react/,
							priority: 20,
						},
						{
							name: "react",
							test: /node_modules[\\/](react-dom|react|scheduler)/,
							priority: 10,
						},
					],
				},
			},
		},
	},
});

export default config;
