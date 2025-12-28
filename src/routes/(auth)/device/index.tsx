import { createFileRoute, redirect } from "@tanstack/react-router";
import { DeviceForm } from "@/components/form/device-form";
import { DeviceSchema } from "@/schema";

export const Route = createFileRoute("/(auth)/device/")({
	validateSearch: DeviceSchema,
	beforeLoad: async ({ context, location }) => {
		if (!context.userSession) {
			throw redirect({
				to: "/login",
				search: {
					callbackUrl: location.href,
				},
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <DeviceForm />;
}
