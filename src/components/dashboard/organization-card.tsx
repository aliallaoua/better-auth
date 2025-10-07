import { formOptions } from "@tanstack/react-form";
import type { ErrorContext, SuccessContext } from "better-auth/react";
import { ChevronDownIcon, MailPlus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Activity, useState } from "react";
import { toast } from "sonner";
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
import { useAppForm } from "@/hooks/form";
import {
	organization,
	useListOrganizations,
	useSession,
} from "@/lib/auth-client";
import type {
	ActiveOrganization,
	Invitation,
	Member,
	Organization,
	Session,
} from "@/lib/auth-types";
import { InviteMemberSchema } from "@/schema";
import { CreateOrganizationForm } from "../form/create-organization-form";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";

export function OrganizationCard(props: {
	session: Session | null;
	activeOrganization: ActiveOrganization | null;
}) {
	const organizations = useListOrganizations();
	const [optimisticOrg, setOptimisticOrg] = useState<ActiveOrganization | null>(
		props.activeOrganization
	);
	const [isRevoking, setIsRevoking] = useState<string[]>([]);
	const inviteVariants = {
		hidden: { opacity: 0, height: 0 },
		visible: { opacity: 1, height: "auto" },
		exit: { opacity: 0, height: 0 },
	};

	const { data } = useSession();
	const session = data || props.session;

	const currentMember = optimisticOrg?.members.find(
		(member: Member) => member.userId === session?.user.id
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Organization</CardTitle>
				<div className="flex justify-between">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<div className="flex cursor-pointer items-center gap-1">
								<p className="text-sm">
									<span className="font-bold" />{" "}
									{optimisticOrg?.name || "Personal"}
								</p>

								<ChevronDownIcon />
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem
								className="py-1"
								onClick={async () => {
									organization.setActive({
										organizationId: null,
									});
									setOptimisticOrg(null);
								}}
							>
								<p className="sm text-sm">Personal</p>
							</DropdownMenuItem>
							{organizations.data?.map((org: Organization) => (
								<DropdownMenuItem
									className="py-1"
									key={org.id}
									onClick={async () => {
										if (org.id === optimisticOrg?.id) {
											return;
										}
										setOptimisticOrg({
											members: [],
											invitations: [],
											...org,
										});
										const { data } = await organization.setActive({
											organizationId: org.id,
										});
										setOptimisticOrg(data);
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
							src={optimisticOrg?.logo || undefined}
						/>
						<AvatarFallback className="rounded-none">
							{optimisticOrg?.name?.charAt(0) || "P"}
						</AvatarFallback>
					</Avatar>
					<div>
						<p>{optimisticOrg?.name || "Personal"}</p>
						<p className="text-muted-foreground text-xs">
							{optimisticOrg?.members.length || 1} members
						</p>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-8 md:flex-row">
					<div className="flex flex-col gap-2 grow">
						<p className="border-b-2 border-b-foreground/10 font-medium">
							Members
						</p>
						<div className="flex flex-col gap-2">
							{optimisticOrg?.members.map((member: Member) => (
								<div
									className="flex items-center justify-between"
									key={member.id}
								>
									<div className="flex items-center gap-2">
										<Avatar className="size-9 sm:flex">
											<AvatarImage
												className="object-cover"
												src={member.user.image || undefined}
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
									{/* {member.role !== "owner" &&
										(currentMember?.role === "owner" ||
											currentMember?.role === "admin") && (
											<Button
												className="cursor-pointer"
												onClick={() => {
													organization.removeMember({
														memberIdOrEmail: member.id,
													});
												}}
												size="sm"
												variant="destructive"
											>
												{currentMember?.id === member.id ? "Leave" : "Remove"}
											</Button>
										)} */}
									<Activity
										mode={
											member.role !== "owner" &&
											(currentMember?.role === "owner" ||
												currentMember?.role === "admin")
												? "visible"
												: "hidden"
										}
									>
										<Button
											className="cursor-pointer"
											onClick={() => {
												organization.removeMember({
													memberIdOrEmail: member.id,
												});
											}}
											size="sm"
											variant="destructive"
										>
											{currentMember?.id === member.id ? "Leave" : "Remove"}
										</Button>
									</Activity>
								</div>
							))}
							{/* {!optimisticOrg?.id && (
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
							)} */}
							<Activity mode={optimisticOrg?.id ? "hidden" : "visible"}>
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
							</Activity>
						</div>
					</div>
					<div className="flex flex-col gap-2 grow">
						<p className="font-medium border-b-2 border-b-foreground/10">
							Invites
						</p>
						<div className="flex flex-col gap-2">
							<AnimatePresence>
								{optimisticOrg?.invitations
									.filter(
										(invitation: Invitation) => invitation.status === "pending"
									)
									.map((invitation: Invitation) => (
										<motion.div
											animate="visible"
											className="flex items-center justify-between"
											exit="exit"
											initial="hidden"
											key={invitation.id}
											layout
											variants={inviteVariants}
										>
											<div>
												<p className="text-sm">{invitation.email}</p>
												<p className="text-muted-foreground text-xs">
													{invitation.role}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<Button
													className="cursor-pointer"
													disabled={isRevoking.includes(invitation.id)}
													onClick={() => {
														organization.cancelInvitation(
															{
																invitationId: invitation.id,
															},
															{
																onRequest: () => {
																	setIsRevoking([...isRevoking, invitation.id]);
																},
																onSuccess: () => {
																	toast.message(
																		"Invitation revoked successfully"
																	);
																	setIsRevoking(
																		isRevoking.filter(
																			(id) => id !== invitation.id
																		)
																	);
																	setOptimisticOrg({
																		...optimisticOrg,
																		invitations:
																			optimisticOrg?.invitations.filter(
																				(inv: Invitation) =>
																					inv.id !== invitation.id
																			),
																	});
																},
																onError: (ctx: ErrorContext) => {
																	toast.error(ctx.error.message);
																	setIsRevoking(
																		isRevoking.filter(
																			(id) => id !== invitation.id
																		)
																	);
																},
															}
														);
													}}
													size="sm"
													variant="destructive"
												>
													{isRevoking.includes(invitation.id) ? (
														<Spinner />
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
									))}
							</AnimatePresence>
							{/* {optimisticOrg?.invitations.length === 0 && (
								<motion.p
									animate={{ opacity: 1 }}
									className="text-muted-foreground text-sm"
									exit={{ opacity: 0 }}
									initial={{ opacity: 0 }}
								>
									No Active Invitations
								</motion.p>
							)} */}
							<Activity
								mode={
									optimisticOrg?.invitations.length === 0 ? "visible" : "hidden"
								}
							>
								<motion.p
									animate={{ opacity: 1 }}
									className="text-muted-foreground text-sm"
									exit={{ opacity: 0 }}
									initial={{ opacity: 0 }}
								>
									No Active Invitations
								</motion.p>
							</Activity>
							{/* {!optimisticOrg?.id && (
								<Label className="text-muted-foreground text-xs">
									You can&apos;t invite members to your personal workspace.
								</Label>
							)} */}
							<Activity mode={optimisticOrg?.id ? "hidden" : "visible"}>
								<Label className="text-muted-foreground text-xs">
									You can&apos;t invite members to your personal workspace.
								</Label>
							</Activity>
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
							<Activity mode={optimisticOrg?.id ? "visible" : "hidden"}>
								<InviteMemberDialog
									optimisticOrg={optimisticOrg}
									setOptimisticOrg={setOptimisticOrg}
								/>
							</Activity>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function InviteMemberDialog({
	setOptimisticOrg,
	optimisticOrg,
}: {
	setOptimisticOrg: (org: ActiveOrganization | null) => void;
	optimisticOrg: ActiveOrganization | null;
}) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

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
			setLoading(true);
			try {
				const invite = organization.inviteMember({
					email: value.email,
					role: value.role,
					fetchOptions: {
						throw: true,
						onSuccess: (ctx: SuccessContext<any>) => {
							if (optimisticOrg) {
								setOptimisticOrg({
									...optimisticOrg,
									invitations: [
										...(optimisticOrg?.invitations || []),
										ctx.data,
									],
								});
							}
							setOpen(false);
							form.reset();
						},
					},
				});

				toast.promise(invite, {
					loading: "Inviting member...",
					success: "Member invited successfully",
					error: (error) => error.error.message,
				});
			} finally {
				setLoading(false);
			}
		},
	});
	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button
					className="w-full cursor-pointer gap-2"
					size="sm"
					variant="secondary"
				>
					<MailPlus size={16} />
					<p>Invite Member</p>
				</Button>
			</DialogTrigger>
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
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div className="flex flex-col gap-2">
						<form.AppField
							children={(field) => (
								<div className="grid gap-2">
									<field.TextField
										autoComplete="email"
										id={field.name}
										label="Email"
										name={field.name}
										required
										type="email"
									/>
								</div>
							)}
							name="email"
						/>
						<form.AppField name="role">
							{(field) => (
								<field.SelectField
									label="Role"
									placeholder="Select a role"
									values={[
										{ label: "Admin", value: "admin" },
										{ label: "Member", value: "member" },
									]}
								/>
							)}
						</form.AppField>
					</div>
					<DialogFooter>
						<form.AppForm>
							<form.SubscribeButton
								className="w-full"
								disabled={loading || !form.state.canSubmit}
								label="Invite"
							/>
						</form.AppForm>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
