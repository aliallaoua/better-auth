// import { createServerFileRoute } from '@tanstack/react-start/server';
import { createFileRoute } from '@tanstack/react-router';

import { auth } from '@/lib/auth';

// export const ServerRoute = createServerFileRoute('/api/auth/$').methods({
export const Route = createFileRoute('/api/auth/$')({
	server: {
		handlers: {
			GET: ({ request }) => auth.handler(request),
			POST: ({ request }) => auth.handler(request),
		},
	},
});
