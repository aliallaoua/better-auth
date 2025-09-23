import { createFileRoute, Link } from '@tanstack/react-router';
import { TriangleAlert } from 'lucide-react';
import { useSession } from '@/lib/auth-client';

export const Route = createFileRoute('/_auth/_pathlessLayout/unauthorized')({
	validateSearch: (search) => ({
		redirect: (search.redirect as string) || '/dashboard',
		reason: (search.reason as string) || 'insufficient_permissions',
	}),
	component: UnauthorizedPage,
});

function UnauthorizedPage() {
	const { redirect, reason } = Route.useSearch();
	const { data } = useSession();

	const reasonMessages = {
		insufficientRole: 'You do not have the required role to access this page.',
		insufficientPermissions:
			'You do not have the required permissions to access this page.',
		default: 'You are not authorized to access this page.',
	};

	const message =
		reasonMessages[reason as keyof typeof reasonMessages] ||
		reasonMessages.default;

	return (
		<div className="container mx-auto min-h-screen flex items-center justify-center p-4">
			<div className="max-w-md w-full shadow-lg rounded-lg p-8 text-center">
				<div className="mb-6">
					<div className="mx-auto size-16 bg-red-100 rounded-full flex items-center justify-center">
						{/* <svg
					className="size-8 text-red-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
					/>
				</svg> */}
						<TriangleAlert className="text-red-500" size={32} />
					</div>
				</div>

				<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					Access Denied
				</h1>
				<p className="text-gray-600 mb-6">{message}</p>

				<div className="mb-6 text-sm text-gray-500">
					<p>
						<strong>Your roles:</strong> {data?.user?.role || 'None'}
					</p>
					{/* <p>
				<strong>Your permissions:</strong>{' '}
				{data?.user?.permissions.join(', ') || 'None'}
			</p> */}
				</div>

				<div className="space-y-3">
					<Link
						className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
						to="/dashboard"
					>
						Go to Dashboard
					</Link>

					<Link
						className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
						to={redirect}
					>
						Try Again
					</Link>
				</div>
			</div>
		</div>
	);
}
