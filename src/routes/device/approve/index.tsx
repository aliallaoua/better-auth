import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Check, Loader2, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authClient, useSession } from "@/lib/auth-client";
import { DeviceSchema } from "@/schema";

export const Route = createFileRoute("/device/approve/")({
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
	component: ApproveComponent,
});

function ApproveComponent() {
	const router = useRouter();
	const { userCode } = Route.useSearch();
	const { data: session } = useSession();

	const {
		mutate: approveMutation,
		isPending: approveMutationIsPending,
		error: approveMutationError,
	} = useMutation({
		mutationFn: async () => {
			if (!userCode) throw new Error("No user code provided");
			return await authClient.device.approve({ userCode });
		},
		onSuccess: () => {
			router.navigate({ to: "/device/success" });
		},
	});

	const {
		mutate: denyMutation,
		isPending: denyMutationIsPending,
		error: denyMutationError,
	} = useMutation({
		mutationFn: async () => {
			if (!userCode) throw new Error("No user code provided");
			return await authClient.device.deny({ userCode });
		},
		onSuccess: () => {
			router.navigate({ to: "/device/denied" });
		},
	});

	if (!session) {
		return null;
	}

	const isLoading = approveMutationIsPending || denyMutationIsPending;
	const error = approveMutationError || denyMutationError;

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-md p-6">
				<div className="space-y-4">
					<div className="text-center">
						<h1 className="font-bold text-2xl">Approve Device</h1>
						<p className="mt-2 text-muted-foreground">
							A device is requesting access to your account
						</p>
					</div>

					<div className="space-y-4">
						<div className="rounded-lg bg-muted p-4">
							<p className="font-medium text-sm">Device Code</p>
							<p className="font-mono text-lg">{userCode}</p>
						</div>

						<div className="rounded-lg bg-muted p-4">
							<p className="font-medium text-sm">Signed in as</p>
							<p>{session.user.email}</p>
						</div>

						{error && (
							<Alert variant="destructive">
								<AlertDescription>
									{error instanceof Error ? error.message : "An error occurred"}
								</AlertDescription>
							</Alert>
						)}

						<div className="flex gap-3">
							<Button
								onClick={() => denyMutation()}
								variant="outline"
								className="flex-1"
								disabled={isLoading}
							>
								{denyMutationIsPending ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<>
										<X className="mr-2 h-4 w-4" />
										Deny
									</>
								)}
							</Button>
							<Button
								onClick={() => approveMutation()}
								className="flex-1"
								disabled={isLoading}
							>
								{approveMutationIsPending ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<>
										<Check className="mr-2 h-4 w-4" />
										Approve
									</>
								)}
							</Button>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}
