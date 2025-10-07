import { createFileRoute, useRouter } from "@tanstack/react-router";
import { CheckIcon, XIcon } from "lucide-react";
import { Activity, useEffect, useState } from "react";
import { InvitationError } from "@/components/invitation-error";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient, organization } from "@/lib/auth-client";

export const Route = createFileRoute("/accept-invitation/$id")({
	component: InvitationPage,
});

function InvitationPage() {
	const router = useRouter();
	const { id } = Route.useParams();
	const [invitationStatus, setInvitationStatus] = useState<
		"pending" | "accepted" | "rejected"
	>("pending");

	const handleAccept = async () => {
		await organization
			.acceptInvitation({
				invitationId: id,
			})
			.then((res) => {
				if (res.error) {
					setError(res.error.message || "An error occurred");
				} else {
					setInvitationStatus("accepted");
					router.navigate({ to: "/dashboard" });
				}
			});
	};

	const handleReject = async () => {
		await organization
			.rejectInvitation({
				invitationId: id,
			})
			.then((res) => {
				if (res.error) {
					setError(res.error.message || "An error occurred");
				} else {
					setInvitationStatus("rejected");
				}
			});
	};

	const [invitation, setInvitation] = useState<{
		organizationName: string;
		organizationSlug: string;
		inviterEmail: string;
		id: string;
		status: "pending" | "accepted" | "rejected" | "canceled";
		email: string;
		expiresAt: Date;
		organizationId: string;
		role: string;
		inviterId: string;
	} | null>(null);

	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		authClient.organization
			.getInvitation({
				query: {
					id,
				},
			})
			.then((res) => {
				if (res.error) {
					setError(res.error.message || "An error occurred");
				} else {
					setInvitation(res.data);
				}
			});
	}, []);
	return (
		<div className="flex min-h-[80vh] items-center justify-center">
			<div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]" />
			{invitation ? (
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Organization Invitation</CardTitle>
						<CardDescription>
							You've been invited to join an organization
						</CardDescription>
					</CardHeader>
					<CardContent>
						{/* {invitationStatus === 'pending' && (
							<div className="space-y-4">
								<p>
									<strong>{invitation?.inviterEmail}</strong> has invited you to
									join <strong>{invitation?.organizationName}</strong>.
								</p>
								<p>
									This invitation was sent to{' '}
									<strong>{invitation?.email}</strong>.
								</p>
							</div>
						)} */}
						<Activity
							mode={invitationStatus === "pending" ? "visible" : "hidden"}
						>
							<div className="space-y-4">
								<p>
									<strong>{invitation?.inviterEmail}</strong> has invited you to
									join <strong>{invitation?.organizationName}</strong>.
								</p>
								<p>
									This invitation was sent to{" "}
									<strong>{invitation?.email}</strong>.
								</p>
							</div>
						</Activity>
						{/* {invitationStatus === 'accepted' && (
							<div className="space-y-4">
								<div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100">
									<CheckIcon className="size-8 text-green-600" />
								</div>
								<h2 className="text-center font-bold text-2xl">
									Welcome to {invitation?.organizationName}!
								</h2>
								<p className="text-center">
									You've successfully joined the organization. We're excited to
									have you on board!
								</p>
							</div>
						)} */}
						<Activity
							mode={invitationStatus === "accepted" ? "visible" : "hidden"}
						>
							<div className="space-y-4">
								<div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100">
									<CheckIcon className="size-8 text-green-600" />
								</div>
								<h2 className="text-center font-bold text-2xl">
									Welcome to {invitation?.organizationName}!
								</h2>
								<p className="text-center">
									You've successfully joined the organization. We're excited to
									have you on board!
								</p>
							</div>
						</Activity>
						{/* {invitationStatus === 'rejected' && (
							<div className="space-y-4">
								<div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100">
									<XIcon className="size-8 text-red-600" />
								</div>
								<h2 className="text-center font-bold text-2xl">
									Invitation Declined
								</h2>
								<p className="text-center">
									You&lsquo;ve declined the invitation to join{' '}
									{invitation?.organizationName}.
								</p>
							</div>
						)} */}
						<Activity
							mode={invitationStatus === "rejected" ? "visible" : "hidden"}
						>
							<div className="space-y-4">
								<div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100">
									<XIcon className="size-8 text-red-600" />
								</div>
								<h2 className="text-center font-bold text-2xl">
									Invitation Declined
								</h2>
								<p className="text-center">
									You&lsquo;ve declined the invitation to join{" "}
									{invitation?.organizationName}.
								</p>
							</div>
						</Activity>
					</CardContent>
					{/* {invitationStatus === 'pending' && (
						<CardFooter className="flex justify-between">
							<Button onClick={handleReject} variant="outline">
								Decline
							</Button>
							<Button onClick={handleAccept}>Accept Invitation</Button>
						</CardFooter>
					)} */}
					<Activity
						mode={invitationStatus === "pending" ? "visible" : "hidden"}
					>
						<CardFooter className="flex justify-between">
							<Button onClick={handleReject} variant="outline">
								Decline
							</Button>
							<Button onClick={handleAccept}>Accept Invitation</Button>
						</CardFooter>
					</Activity>
				</Card>
			) : error ? (
				<InvitationError />
			) : (
				<InvitationSkeleton />
			)}
		</div>
	);
}

function InvitationSkeleton() {
	return (
		<Card className="mx-auto w-full max-w-md">
			<CardHeader>
				<div className="flex items-center space-x-2">
					<Skeleton className="size-6 rounded-full" />
					<Skeleton className="h-6 w-24" />
				</div>
				<Skeleton className="mt-2 h-4 w-full" />
				<Skeleton className="mt-2 h-4 w-2/3" />
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-2/3" />
				</div>
			</CardContent>
			<CardFooter className="flex justify-end">
				<Skeleton className="h-10 w-24" />
			</CardFooter>
		</Card>
	);
}
