import { createFileRoute, redirect } from "@tanstack/react-router";
import { DeviceForm } from "@/components/form/device-form";
import { DeviceSchema } from "@/schema";

export const Route = createFileRoute("/device/")({
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
	component: DeviceComponent,
});

function DeviceComponent() {
	return <DeviceForm />;
}
