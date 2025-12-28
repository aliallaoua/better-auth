import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/(auth)/device/success/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-md p-6">
				<div className="space-y-4 text-center">
					<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
						<Check className="h-6 w-6 text-green-600" />
					</div>

					<div>
						<h1 className="font-bold text-2xl">Device Approved</h1>
						<p className="mt-2 text-muted-foreground">
							The device has been successfully authorized to access your
							account.
						</p>
					</div>

					<p className="text-muted-foreground text-sm">
						You can now return to your device to continue.
					</p>

					<Button
						render={<Link to="/">Return to Home</Link>}
						className="w-full"
					/>
				</div>
			</Card>
		</div>
	);
}
