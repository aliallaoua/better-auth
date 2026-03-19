import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { HeroHeader } from "@/components/header";
import { NotFound } from "@/components/NotFound";
import {
	ThemeProvider,
	useHtmlClass,
	THEME_COLORS,
} from "@/components/ThemeProvider";
import { useAuthQuery } from "@/hooks/queries/useAuthQueries";
import appCss from "../styles.css?url";
import { seo } from "../utils/seo";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DirectionProvider } from "@/components/ui/direction";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
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
	beforeLoad: async ({ context }) => {
		const userSession = await context.queryClient.fetchQuery(
			useAuthQuery.user()
		);
		return {
			userSession,
		};
	},
	staleTime: Infinity,
	shellComponent: ({ children }) => (
		<ThemeProvider>
			<ShellComponent>{children}</ShellComponent>
		</ThemeProvider>
	),
	errorComponent: DefaultCatchBoundary,
	notFoundComponent: () => <NotFound />,
});

function ShellComponent({ children }: { children: React.ReactNode }) {
	const isLoading = useRouterState({
		select: (s) => s.status === "pending",
	});

	const [canShowLoading, setShowLoading] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setShowLoading(true);
		}, 2000);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	const isRouterPage = useRouterState({
		select: (s) => s.resolvedLocation?.pathname.startsWith("/router"),
	});

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
				{canShowLoading ? (
					<div
						className={`fixed top-0 left-0 h-[300px] w-full
        transition-all duration-300 pointer-events-none
        z-30 dark:h-[200px] dark:bg-white/10! dark:rounded-[100%] ${
					isLoading
						? "delay-500 opacity-1 -translate-y-1/2"
						: "delay-0 opacity-0 -translate-y-full"
				}`}
						style={{
							background: `radial-gradient(closest-side, rgba(0,10,40,0.2) 0%, rgba(0,0,0,0) 100%)`,
						}}
					>
						<div
							className={`absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[30px] p-2 bg-white/80 dark:bg-gray-800
        rounded-lg shadow-lg`}
						>
							<Spinner className="text-5xl" />
						</div>
					</div>
				) : null}
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
