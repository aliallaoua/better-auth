import { createFileRoute } from "@tanstack/react-router";
import { TwoFactorEmailOtpForm } from "@/components/form/two-factor-email-otp-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/two-factor/otp/")({
	component: OTPComponent,
});

function OTPComponent() {
	return (
		<main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Two-Factor Authentication</CardTitle>
					<CardDescription>
						Verify your identity with a one-time password
					</CardDescription>
				</CardHeader>
				<CardContent>
					<TwoFactorEmailOtpForm />
				</CardContent>
			</Card>
		</main>
	);
}
