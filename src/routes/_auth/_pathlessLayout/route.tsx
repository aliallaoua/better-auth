import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthQueries } from "@/hooks/queries/useAuthQueries";

export const Route = createFileRoute("/_auth/_pathlessLayout")({
	loader: async ({ context }) => {
		const userSession = await context.queryClient.fetchQuery(
			useAuthQueries.user()
		);

		return {
			user: userSession?.user,
		};
	},
	component: PathlessLayoutComponent,
});

function PathlessLayoutComponent() {
	const { user } = Route.useLoaderData();

	return (
		<SidebarProvider
			className="pt-16"
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar className="pt-[62px]" user={user!} variant="inset" />
			<Outlet />
		</SidebarProvider>
	);
}
