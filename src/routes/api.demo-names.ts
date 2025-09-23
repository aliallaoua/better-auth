// import { createServerFileRoute } from '@tanstack/react-start/server';

// export const ServerRoute = createServerFileRoute('/api/demo-names').methods({
// 	GET: () => {
// 		return Response.json(['Alice', 'Bob', 'Charlie']);
// 	},
// });

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/demo-names')({
	server: {
		handlers: {
			GET: () =>
				new Response(JSON.stringify(['Alice', 'Bob', 'Charlie']), {
					headers: {
						'Content-Type': 'application/json',
					},
				}),
		},
	},
});
