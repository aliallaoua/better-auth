import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function InvitationError() {
	return (
		<Card className="mx-auto w-full max-w-md">
			<CardHeader>
				<div className="flex items-center space-x-2">
					<AlertCircle className="size-6 text-destructive" />
					<CardTitle className="text-destructive text-xl">
						Invitation Error
					</CardTitle>
				</div>
				<CardDescription>
					There was an issue with your invitation.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="mb-4 text-muted-foreground text-sm">
					The invitation you're trying to access is either invalid or you don't
					have the correct permissions. Please check your email for a valid
					invitation or contact the person who sent it.
				</p>
			</CardContent>
			<CardFooter>
				<Link className="w-full" to="/better-auth">
					<Button className="w-full" variant="outline">
						Go back to home
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
}
