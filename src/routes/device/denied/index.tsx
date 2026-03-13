import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { DeviceResultPage } from "@/components/device-result-page";

export const Route = createFileRoute("/device/denied/")({
	component: DeniedComponent,
});

function DeniedComponent() {
	return (
		<DeviceResultPage
			variant="denied"
			icon={<X className="h-6 w-6 text-red-600" />}
			title="Device Denied"
			description="The device authorization request has been denied."
		/>
	);
}
