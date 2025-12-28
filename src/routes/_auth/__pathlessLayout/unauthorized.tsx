import { createFileRoute, Link } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth/__pathlessLayout/unauthorized")({
	validateSearch: (search) => ({
		redirect: (search.redirect as string) || "/dashboard",
		reason: (search.reason as string) || "insufficient_permissions",
	}),
	component: UnauthorizedComponent,
});

function UnauthorizedComponent() {
	const { redirect, reason } = Route.useSearch();
	const { data } = useSession();

	const reasonMessages = {
		insufficientRole: "You do not have the required role to access this page.",
		insufficientPermissions:
			"You do not have the required permissions to access this page.",
		default: "You are not authorized to access this page.",
	}

	const message =
		reasonMessages[reason as keyof typeof reasonMessages] ||
		reasonMessages.default;

	return (
		<div className="container mx-auto flex min-h-screen items-center justify-center p-4">
			<div className="w-full max-w-md rounded-lg p-8 text-center shadow-lg">
				<div className="mb-6">
					<div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100">
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

				<h1 className="mb-4 font-bold text-2xl text-gray-900 dark:text-gray-100">
					Access Denied
				</h1>
				<p className="mb-6 text-gray-600">{message}</p>

				<div className="mb-6 text-gray-500 text-sm">
					<p>
						<strong>Your roles:</strong> {data?.user?.role || "None"}
					</p>
					{/* <p>
				<strong>Your permissions:</strong>{' '}
				{data?.user?.permissions.join(', ') || 'None'}
			</p> */}
				</div>

				<div className="space-y-3">
					<Link
						className="block w-full rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
						to="/dashboard"
					>
						Go to Dashboard
					</Link>

					<Link
						className="block w-full rounded bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300"
						to={redirect}
					>
						Try Again
					</Link>
				</div>
			</div>
		</div>
	)
}
