import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { DeviceResultPage } from "@/components/device-result-page";

export const Route = createFileRoute("/device/success/")({
	component: SuccessComponent,
});

function SuccessComponent() {
	return (
		<DeviceResultPage
			variant="success"
			icon={<Check className="h-6 w-6 text-green-600" />}
			title="Device Approved"
			description="The device has been successfully authorized to access your account."
		/>
	);
}
