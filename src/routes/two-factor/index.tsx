import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/two-factor/")({
	component: TwoFactorComponent,
});

function TwoFactorComponent() {
	return (
		<main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>TOTP Verification</CardTitle>
					<CardDescription>
						Enter your 6-digit TOTP code to authenticate
					</CardDescription>
				</CardHeader>
				<CardContent>
					<TwoFactorTotpForm />
				</CardContent>
				<CardFooter className="gap-2 text-muted-foreground text-sm">
					<Link to="/two-factor/otp">
						<Button variant="link" size="sm">
							Switch to Email Verification
						</Button>
					</Link>
				</CardFooter>
			</Card>
		</main>
	);
}
