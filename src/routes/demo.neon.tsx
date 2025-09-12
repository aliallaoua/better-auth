import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { getClient } from '@/db';

const getTodos = createServerFn({
	method: 'GET',
}).handler(async () => {
	const client = await getClient();
	if (!client) {
		return;
	}
	return (await client.query('SELECT * FROM todos')) as Array<{
		id: number;
		title: string;
	}>;
});

const insertTodo = createServerFn()
	.validator((d: { title: string }) => d)
	.handler(async ({ data }) => {
		const client = await getClient();
		if (!client) {
			return;
		}
		await client.query('INSERT INTO todos (title) VALUES ($1)', [data.title]);
	});

export const Route = createFileRoute('/demo/neon')({
	component: App,
	loader: async () => {
		const todos = await getTodos();
		return { todos };
	},
});

function App() {
	const { todos } = Route.useLoaderData();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const data = Object.fromEntries(formData);
		await insertTodo({ data: { title: data.title as string } });
		router.invalidate();
	};

	if (!todos) {
		return <DBConnectionError />;
	}

	return (
		<div
			className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white"
			style={{
				backgroundImage:
					'radial-gradient(circle at 5% 40%, #63F655 0%, #00E0D9 40%, #1a0f0a 100%)',
			}}
		>
			<div className="w-full max-w-2xl rounded-xl border-8 border-black/10 bg-black/50 p-8 shadow-xl backdrop-blur-md">
				<div className="mb-8 flex items-center justify-center gap-4 rounded-lg bg-black/30 p-4">
					<div className="relative">
						<div className="-inset-1 absolute rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-75 blur transition duration-1000 group-hover:opacity-100" />
						<div className="relative">
							<img
								alt="Neon Logo"
								className="h-12 w-12 transform transition-transform duration-200 hover:scale-110"
								src="/demo-neon.svg"
							/>
						</div>
					</div>
					<h1 className="bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text font-bold text-3xl text-transparent">
						Neon Database Demo
					</h1>
				</div>
				{todos && (
					<>
						<h1 className="mb-4 font-bold text-2xl">Todos</h1>
						<ul className="mb-6 space-y-3">
							{todos.map((todo: { id: number; title: string }) => (
								<li
									className="group cursor-pointer rounded-lg border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-white/20"
									key={todo.id}
								>
									<div className="flex items-center justify-between">
										<span className="font-medium text-lg group-hover:text-white/90">
											{todo.title}
										</span>
										<span className="text-white/50 text-xs">#{todo.id}</span>
									</div>
								</li>
							))}
						</ul>
						<form className="mt-4 flex gap-2" onSubmit={handleSubmit}>
							<input
								className="w-full rounded-md border border-gray-300 bg-black/20 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E0D9]"
								name="title"
								type="text"
							/>
							<button
								className="whitespace-nowrap rounded-md bg-[#00E0D9] px-6 py-2 font-medium text-black transition-colors hover:bg-[#00E0D9]/80 focus:outline-none focus:ring-2 focus:ring-[#00E0D9] focus:ring-offset-2 disabled:opacity-50"
								type="submit"
							>
								Add Todo
							</button>
						</form>
					</>
				)}
			</div>
		</div>
	);
}

function DBConnectionError() {
	return (
		<div className="space-y-6 text-center">
			<div className="mb-4 flex items-center justify-center">
				<svg
					className="h-12 w-12 text-amber-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
					/>
				</svg>
			</div>
			<h2 className="mb-4 font-bold text-2xl">Database Connection Issue</h2>
			<div className="mb-6 text-lg">The Neon database is not connected.</div>
			<div className="mx-auto max-w-xl rounded-lg bg-black/30 p-6">
				<h3 className="mb-4 font-semibold text-lg">Required Steps to Fix:</h3>
				<ul className="list-none space-y-4 text-left">
					<li className="flex items-start">
						<span className="mr-3 inline-flex h-8 min-h-8 w-8 min-w-8 items-center justify-center rounded-full bg-amber-500 font-bold text-black">
							1
						</span>
						<div>
							Use the{' '}
							<code className="rounded bg-black/30 px-2 py-1">db/init.sql</code>{' '}
							file to create the database
						</div>
					</li>
					<li className="flex items-start">
						<span className="mr-3 inline-flex h-8 min-h-8 w-8 min-w-8 items-center justify-center rounded-full bg-amber-500 font-bold text-black">
							2
						</span>
						<div>
							Set the{' '}
							<code className="rounded bg-black/30 px-2 py-1">
								DATABASE_URL
							</code>{' '}
							environment variable to the connection string of your Neon
							database
						</div>
					</li>
				</ul>
			</div>
		</div>
	);
}
