import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AlertCircle, CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";
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
import { useInviteAcceptMutation } from "@/data/organization/invitation-accept-mutation";
import { useInvitationQuery } from "@/data/organization/invitation-query";
import { useInviteRejectMutation } from "@/data/organization/invitation-reject-mutation";

export const Route = createFileRoute("/accept-invitation/$id")({
	component: InvitationComponent,
});

function InvitationComponent() {
	const router = useRouter();
	const { id } = Route.useParams();
	const [isRedirecting, setIsRedirecting] = useState(false);

	const { data: invitation, isLoading, error } = useInvitationQuery(id);
	const { mutate: acceptMutation, isPending: acceptMutationIsPending } =
		useInviteAcceptMutation();
	const { mutate: rejectMutation, isPending: rejectMutationIsPending } =
		useInviteRejectMutation();

	const handleAccept = () => {
		acceptMutation(
			{
				invitationId: id,
			},
			{
				onSuccess: () => {
					setIsRedirecting(true);
					router.navigate({
						to: "/dashboard",
					})
				},
			}
		)
	}

	const handleReject = () => {
		rejectMutation(
			{
				invitationId: id,
			},
			{
				onSuccess: () => {
					setIsRedirecting(true);
					router.navigate({
						to: "/dashboard",
					})
				},
			}
		)
	}

	if (isLoading || isRedirecting) {
		return (
			<div className="flex min-h-[80vh] items-center justify-center">
				<div className="mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none absolute inset-0 flex items-center justify-center bg-white dark:bg-black" />
				<InvitationSkeleton />
			</div>
		)
	}

	if (!invitation || error) {
		return (
			<div className="flex min-h-[80vh] items-center justify-center">
				<div className="mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none absolute inset-0 flex items-center justify-center bg-white dark:bg-black" />
				<InvitationError />
			</div>
		)
	}

	return (
		<div className="flex min-h-[80vh] items-center justify-center">
			<div className="mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none absolute inset-0 flex items-center justify-center bg-white dark:bg-black" />
			{invitation && (
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Organization Invitation</CardTitle>
						<CardDescription>
							You've been invited to join an organization
						</CardDescription>
					</CardHeader>
					<CardContent>
						{invitation.status === "accepted" ? (
							<div className="space-y-4">
								<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
									<CheckIcon className="h-8 w-8 text-green-600" />
								</div>
								<h2 className="text-center font-bold text-2xl">
									Welcome to {invitation.organizationName}!
								</h2>
								<p className="text-center">
									You've successfully joined the organization. We're excited to
									have you on board!
								</p>
							</div>
						) : invitation.status === "rejected" ? (
							<div className="space-y-4">
								<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
									<XIcon className="h-8 w-8 text-red-600" />
								</div>
								<h2 className="text-center font-bold text-2xl">
									Invitation Declined
								</h2>
								<p className="text-center">
									You&lsquo;ve declined the invitation to join{" "}
									{invitation.organizationName}.
								</p>
							</div>
						) : (
							<div className="space-y-4">
								<p>
									<strong>{invitation.inviterEmail}</strong> has invited you to
									join <strong>{invitation.organizationName}</strong>.
								</p>
								<p>
									This invitation was sent to{" "}
									<strong>{invitation.email}</strong>.
								</p>
							</div>
						)}
					</CardContent>
					{invitation.status === "pending" && (
						<CardFooter className="flex justify-between">
							<Button
								variant="outline"
								onClick={handleReject}
								disabled={rejectMutationIsPending}
							>
								{rejectMutationIsPending ? "Declining..." : "Decline"}
							</Button>
							<Button onClick={handleAccept} disabled={acceptMutationIsPending}>
								{acceptMutationIsPending ? "Accepting..." : "Accept Invitation"}
							</Button>
						</CardFooter>
					)}
				</Card>
			)}
		</div>
	)
}

function InvitationSkeleton() {
	return (
		<Card className="mx-auto w-full max-w-md">
			<CardHeader>
				<div className="flex items-center space-x-2">
					<Skeleton className="h-6 w-6 rounded-full" />
					<Skeleton className="h-6 w-24" />
				</div>
				<Skeleton className="mt-2 h-4 w-full" />
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-2/3" />
				</div>
			</CardContent>
			<CardFooter className="flex justify-end">
				<Skeleton className="h-8 w-full" />
			</CardFooter>
		</Card>
	)
}

function InvitationError() {
	return (
		<Card className="mx-auto w-full max-w-md">
			<CardHeader>
				<div className="flex items-center space-x-2">
					<AlertCircle className="h-6 w-6 text-destructive" />
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
				<Link to="/" className="w-full">
					<Button variant="outline" className="w-full">
						Go back to home
					</Button>
				</Link>
			</CardFooter>
		</Card>
	)
}
