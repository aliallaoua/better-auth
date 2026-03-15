import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { HeroHeader } from "@/components/header";
import { NotFound } from "@/components/NotFound";
import { ThemeProvider, useHtmlClass } from "@/components/ThemeProvider";
import { useAuthQuery } from "@/hooks/queries/useAuthQueries";
import appCss from "../styles.css?url";
import { seo } from "../utils/seo";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DirectionProvider } from "@/components/ui/direction";
import { THEME_COLORS } from "@/components/ThemeProvider";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	beforeLoad: async ({ context }) => {
		const userSession = await context.queryClient.fetchQuery(
			useAuthQuery.user()
		);
		return {
			userSession,
		};
	},
	head: () => ({
		meta: [
			{
				charSet: "utf8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				name: "theme-color",
				content: THEME_COLORS.light,
				media: "(prefers-color-scheme: light)",
			},
			{
				name: "theme-color",
				content: THEME_COLORS.dark,
				media: "(prefers-color-scheme: dark)",
			},
			...seo({
				title: "TanStack Start Starter",
				description:
					"TanStack Start is a type-safe, client-first, full-stack React framework. ",
			}),
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32x32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/favicon-16x16.png",
			},
			// { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
			{ rel: "icon", href: "/favicon.ico" },
		],
		scripts: [
			// Theme detection script - must run before body renders to prevent flash
			{
				children: `(function(){try{var t=localStorage.getItem('theme')||'auto';var v=['light','dark','auto'].includes(t)?t:'auto';if(v==='auto'){var a=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.add(a,'auto')}else{document.documentElement.classList.add(v)}}catch(e){var a=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.add(a,'auto')}})()`,
			},
		],
	}),
	errorComponent: DefaultCatchBoundary,
	notFoundComponent: () => <NotFound />,
	shellComponent: ({ children }) => (
		<ThemeProvider>
			<RootDocument>{children}</RootDocument>
		</ThemeProvider>
	),
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const htmlClass = useHtmlClass();

	return (
		<html lang="en" className={htmlClass} suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				{/* <Header /> */}
				<HeroHeader />
				<main className="min-h-screen [view-transition-name:main-content]">
					<DirectionProvider direction="rtl">
						<TooltipProvider>{children}</TooltipProvider>
					</DirectionProvider>
				</main>
				<Toaster closeButton richColors theme="system" />
				<TanStackDevtools
					plugins={[
						{
							name: "TanStack Query",
							render: <ReactQueryDevtoolsPanel />,
						},
						{
							name: "TanStack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						formDevtoolsPlugin(),
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
