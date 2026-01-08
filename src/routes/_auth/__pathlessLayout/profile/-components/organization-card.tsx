import { formOptions } from "@tanstack/react-form";
import type {
	Invitation,
	Member,
	Organization,
} from "better-auth/plugins/organization";
import { ChevronDownIcon, Loader2, MailPlus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Activity, useState } from "react";
import { toast } from "sonner";
import { CreateOrganizationForm } from "@/components/form/create-organization-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useInvitationCancelMutation } from "@/data/organization/invitation-cancel-mutation";
import { useInviteMemberMutation } from "@/data/organization/invitation-member-mutation";
import { useMemberRemoveMutation } from "@/data/organization/member-remove-mutation";
import { useOrganizationActiveMutation } from "@/data/organization/organization-active-mutation";
import { useOrganizationDetailQuery } from "@/data/organization/organization-detail-query";
import { useOrganizationListQuery } from "@/data/organization/organization-list-query";
import { useSessionQuery } from "@/data/user/session-query";
import { useAppForm } from "@/hooks/form";
import type { OrganizationRole, Session } from "@/lib/auth";
import { InviteMemberSchema } from "@/schema";

const ORGANIZATION_ROLES = {
	OWNER: "owner",
	ADMIN: "admin",
	MEMBER: "member",
} as const satisfies Record<string, OrganizationRole>;

export function OrganizationCard(props: { session: Session | null }) {
	const { data: sessionData } = useSessionQuery();
	const { data: organizations } = useOrganizationListQuery();
	const { data: activeOrganization, isFetching: isOrganizationFetching } =
		useOrganizationDetailQuery();
	const { mutate: setActiveMutation } = useOrganizationActiveMutation();
	const {
		mutate: cancelInvitationMutation,
		isPending: cancelInvitationMutationIsPending,
		variables: cancelInvitationMutationVariables,
	} = useInvitationCancelMutation();
	const {
		mutate: removeMemberMutation,
		isPending: removeMemberMutationIsPending,
		variables: removeMemberMutationVariables,
	} = useMemberRemoveMutation();

	const session = sessionData || props.session;

	const currentMember = activeOrganization?.members.find(
		(member: Member) => member.userId === session?.user.id
	);

	if (isOrganizationFetching) {
		return <OrganizationCardSkeleton />;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Organization</CardTitle>
				<div className="flex justify-between">
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<div className="flex cursor-pointer items-center gap-1">
									<p className="text-sm">
										<span className="font-bold" />{" "}
										{activeOrganization?.name || "Personal"}
									</p>

									<ChevronDownIcon />
								</div>
							}
						/>
						<DropdownMenuContent align="start">
							<DropdownMenuItem
								className="py-1"
								onClick={() => {
									setActiveMutation({ organizationId: null });
								}}
							>
								<p className="sm text-sm">Personal</p>
							</DropdownMenuItem>
							{organizations?.map((org: Organization) => (
								<DropdownMenuItem
									key={org.id}
									className="py-1"
									onClick={async () => {
										if (org.id === activeOrganization?.id) {
											return;
										}
										setActiveMutation({ organizationId: org.id });
									}}
								>
									<p className="sm text-sm">{org.name}</p>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
					<div>
						<CreateOrganizationForm />
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Avatar className="rounded-none">
						<AvatarImage
							className="size-full rounded-none object-cover"
							src={activeOrganization?.logo || undefined}
						/>
						<AvatarFallback className="rounded-none">
							{activeOrganization?.name?.charAt(0) || "P"}
						</AvatarFallback>
					</Avatar>
					<div>
						<p>{activeOrganization?.name || "Personal"}</p>
						<p className="text-muted-foreground text-xs">
							{activeOrganization?.members.length || 1} members
						</p>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-8 md:flex-row">
					<div className="flex grow flex-col gap-2">
						<p className="border-b-2 border-b-foreground/10 font-medium">
							Members
						</p>
						<div className="flex flex-col gap-2">
							{activeOrganization?.members.map((member: Member) => {
								const isRemoving =
									removeMemberMutationIsPending &&
									removeMemberMutationVariables?.memberIdOrEmail === member.id;
								return (
									<div
										key={member.id}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2">
											<Avatar className="size-9 sm:flex">
												<AvatarImage
													src={member.user.image || undefined}
													className="object-cover"
												/>
												<AvatarFallback>
													{member.user.name?.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="text-sm">{member.user.name}</p>
												<p className="text-muted-foreground text-xs">
													{member.role}
												</p>
											</div>
										</div>
										{member.role !== ORGANIZATION_ROLES.OWNER &&
											(currentMember?.role === ORGANIZATION_ROLES.OWNER ||
												currentMember?.role === ORGANIZATION_ROLES.ADMIN) && (
												<Button
													size="sm"
													className="cursor-pointer"
													variant="destructive"
													disabled={isRemoving}
													onClick={() => {
														removeMemberMutation({
															memberIdOrEmail: member.id,
														});
													}}
												>
													{isRemoving ? (
														<Loader2 className="animate-spin" size={16} />
													) : currentMember?.id === member.id ? (
														"Leave"
													) : (
														"Remove"
													)}
												</Button>
											)}
									</div>
								);
							})}
							{!activeOrganization?.id && (
								<div>
									<div className="flex items-center gap-2">
										<Avatar>
											<AvatarImage src={session?.user.image || undefined} />
											<AvatarFallback>
												{session?.user.name?.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className="text-sm">{session?.user.name}</p>
											<p className="text-muted-foreground text-xs">Owner</p>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
					<div className="flex grow flex-col gap-2">
						<p className="border-b-2 border-b-foreground/10 font-medium">
							Invites
						</p>
						<div className="flex flex-col gap-2">
							<AnimatePresence>
								{activeOrganization?.invitations
									?.filter(
										(invitation: Invitation) => invitation.status === "pending"
									)
									.map((invitation: Invitation) => {
										const isCanceling =
											cancelInvitationMutationIsPending &&
											cancelInvitationMutationVariables?.invitationId ===
												invitation.id;
										return (
											<motion.div
												key={invitation.id}
												className="flex items-center justify-between"
												variants={{
													hidden: { opacity: 0, height: 0 },
													visible: { opacity: 1, height: "auto" },
													exit: { opacity: 0, height: 0 },
												}}
												initial="hidden"
												animate="visible"
												exit="exit"
												layout
											>
												<div>
													<p className="text-sm">{invitation.email}</p>
													<p className="text-muted-foreground text-xs">
														{invitation.role}
													</p>
												</div>
												<div className="flex items-center gap-2">
													<Button
														disabled={isCanceling}
														size="sm"
														variant="destructive"
														onClick={() => {
															cancelInvitationMutation({
																invitationId: invitation.id,
															});
														}}
													>
														{isCanceling ? (
															<Loader2 className="animate-spin" size={16} />
														) : (
															"Revoke"
														)}
													</Button>
													<div>
														<CopyButton
															textToCopy={`${window.location.origin}/accept-invitation/${invitation.id}`}
														/>
													</div>
												</div>
											</motion.div>
										);
									})}
							</AnimatePresence>
							{activeOrganization?.invitations?.filter(
								(invitation) => invitation.status === "pending"
							).length === 0 && (
								<motion.p
									className="text-muted-foreground text-sm"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								>
									No Active Invitations
								</motion.p>
							)}
							{!activeOrganization?.id && (
								<Label className="text-muted-foreground text-xs">
									You can&apos;t invite members to your personal workspace.
								</Label>
							)}
						</div>
					</div>
				</div>
				<div className="mt-4 flex w-full justify-end">
					<div>
						<div>
							{/* {optimisticOrg?.id && (
								<InviteMemberDialog
									optimisticOrg={optimisticOrg}
									setOptimisticOrg={setOptimisticOrg}
								/>
							)} */}
							<Activity mode={activeOrganization?.id ? "visible" : "hidden"}>
								<InviteMemberDialog />
							</Activity>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function InviteMemberDialog() {
	const ORGANIZATION_ROLES = {
		ADMIN: "admin",
		MEMBER: "member",
	} as const satisfies Record<string, OrganizationRole>;

	const { mutate: inviteMutation } = useInviteMemberMutation();

	const [open, setOpen] = useState(false);

	const inviteMemberFormOpts = formOptions({
		defaultValues: {
			email: "",
			role: "member" as "admin" | "member",
		},
	});

	const form = useAppForm({
		...inviteMemberFormOpts,
		validators: {
			onChange: InviteMemberSchema,
		},
		onSubmit: async ({ value }) => {
			inviteMutation(
				{
					email: value.email,
					role: value.role as OrganizationRole,
				},
				{
					onSuccess: () => {
						form.reset();
						setOpen(false);
					},
					onError: (error) => {
						toast.error(error.message);
					},
				}
			);
		},
	});
	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger
				render={
					<Button
						className="w-full cursor-pointer gap-2"
						size="sm"
						variant="secondary"
					>
						<MailPlus size={16} />
						<p>Invite Member</p>
					</Button>
				}
			/>
			<DialogContent className="w-11/12 sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Invite Member</DialogTitle>
					<DialogDescription>
						Invite a member to your organization.
					</DialogDescription>
				</DialogHeader>
				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<div className="flex flex-col gap-2">
						<form.AppField
							name="email"
							children={(field) => (
								<div className="grid gap-2">
									<field.TextField
										type="email"
										placeholder="member@example.com"
										autoComplete="email"
										label="Email"
										required
									/>
								</div>
							)}
						/>
						<form.AppField
							name="role"
							children={(field) => (
								<field.SelectField
									label="Role"
									placeholder="Select a role"
									values={[
										{ label: "Admin", value: ORGANIZATION_ROLES.ADMIN },
										{ label: "Member", value: ORGANIZATION_ROLES.MEMBER },
									]}
								/>
							)}
						/>
					</div>
					<DialogFooter>
						<form.AppForm>
							<form.SubscribeButton className="w-full" label="Invite" />
						</form.AppForm>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function OrganizationCardSkeleton() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Organization</CardTitle>
				<div className="mt-2 flex justify-between">
					<Skeleton className="h-5 w-24" />
					<Skeleton className="h-8 w-32" />
				</div>
				<div className="flex items-center gap-2">
					<Skeleton className="h-10 w-10 rounded-none" />
					<div className="space-y-1">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-3 w-16" />
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-8 md:flex-row">
					<div className="flex grow flex-col gap-2">
						<p className="border-b-2 border-b-foreground/10 font-medium">
							Members
						</p>
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2">
								<Skeleton className="h-9 w-9 rounded-full" />
								<div className="space-y-1">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-3 w-16" />
								</div>
							</div>
						</div>
					</div>
					<div className="flex grow flex-col gap-2">
						<p className="border-b-2 border-b-foreground/10 font-medium">
							Invites
						</p>
						<Skeleton className="h-4 w-32" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
