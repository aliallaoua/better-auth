import { TanStackDevtools } from '@tanstack/react-devtools';
import { FormDevtoolsPlugin } from '@tanstack/react-form-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { Toaster } from 'sonner';
import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary';
import Header from '@/components/header';
import { NotFound } from '@/components/NotFound';
import { ThemeProvider } from '@/components/theme-provider';
import { useAuthQueries } from '@/hooks/queries/useAuthQueries';
import appCss from '../styles.css?url';
import { seo } from '../utils/seo';

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	beforeLoad: async ({ context }) => {
		const userSession = await context.queryClient.fetchQuery(
			useAuthQueries.user()
		);
		return {
			userSession,
		};
	},
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			...seo({
				title: 'TanStack Start Starter',
				description:
					'TanStack Start is a type-safe, client-first, full-stack React framework. ',
			}),
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss,
			},
			{
				rel: 'apple-touch-icon',
				sizes: '180x180',
				href: '/apple-touch-icon.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '32x32',
				href: '/favicon-32x32.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '16x16',
				href: '/favicon-16x16.png',
			},
			// { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
			{ rel: 'icon', href: '/favicon.ico' },
		],
	}),

	errorComponent: (props) => {
		<RootDocument>
			<DefaultCatchBoundary {...props} />
		</RootDocument>;
	},
	notFoundComponent: () => <NotFound />,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider>
					<Header />
					{children}
					<Toaster closeButton richColors theme="system" />
					<TanStackDevtools
						plugins={[
							{
								name: 'TanStack Query',
								render: <ReactQueryDevtoolsPanel />,
							},
							{
								name: 'TanStack Router',
								render: <TanStackRouterDevtoolsPanel />,
							},
							FormDevtoolsPlugin(),
						]}
					/>
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	);
}
