import { createFileRoute, Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/device/denied/")({
	component: DeniedComponent,
});

function DeniedComponent() {
	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-md p-6">
				<div className="space-y-4 text-center">
					<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
						<X className="h-6 w-6 text-red-600" />
					</div>

					<div>
						<h1 className="font-bold text-2xl">Device Denied</h1>
						<p className="mt-2 text-muted-foreground">
							The device authorization request has been denied.
						</p>
					</div>

					<p className="text-muted-foreground text-sm">
						The device will not be able to access your account.
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
