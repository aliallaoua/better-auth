import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_auth/__pathlessLayout")({
	component: RootComponent,
});

function RootComponent() {
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
			<AppSidebar className="pt-[62px]" variant="inset" />
			<Outlet />
		</SidebarProvider>
	);
}
