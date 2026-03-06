import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DeviceResultPageProps {
	variant: "success" | "denied";
	icon: ReactNode;
	title: string;
	description: string;
}

export function DeviceResultPage({
	icon,
	title,
	description,
	variant,
}: DeviceResultPageProps) {
	const colorClass = variant === "success" ? "bg-green-100" : "bg-red-100";

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-md p-6">
				<div className="space-y-4 text-center">
					<div
						className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${colorClass}`}
					>
						{icon}
					</div>

					<div>
						<h1 className="font-bold text-2xl">{title}</h1>
						<p className="mt-2 text-muted-foreground">{description}</p>
					</div>

					<p className="text-muted-foreground text-sm">
						{variant === "success"
							? "You can now return to your device to continue."
							: "The device will not be able to access your account."}
					</p>

					<Link to="/" className={buttonVariants({ className: "w-full" })}>
						Return to Home
					</Link>
				</div>
			</Card>
		</div>
	);
}
