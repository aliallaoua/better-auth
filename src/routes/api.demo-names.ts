import { createServerFileRoute } from '@tanstack/react-start/server';

export const ServerRoute = createServerFileRoute('/api/demo-names').methods({
	GET: () => {
		return Response.json(['Alice', 'Bob', 'Charlie']);
	},
});
