import { useRouter } from "@tanstack/react-router";
import type { ErrorContext, RequestContext } from "better-auth/react";
import {
	Laptop,
	LogOut,
	PhoneIcon,
	ShieldCheck,
	ShieldOff,
	StopCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";
import { AddPasskeyForm } from "@/components/form/add-passkey-form";
import { ChangeEmailForm } from "@/components/form/change-email-form";
import { ChangePasswordForm } from "@/components/form/change-password-form";
import { DeleteAccountForm } from "@/components/form/delete-account-form";
import { EditUserForm } from "@/components/form/edit-user-form";
import { ListPasskeysForm } from "@/components/form/list-passkeys-form";
import { TwoFactorDisableForm } from "@/components/form/two-factor-disable-form";
import { TwoFactorEnableForm } from "@/components/form/two-factor-enable-form";
import { TwoFactorQrForm } from "@/components/form/two-factor-qr-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useRevokeSessionMutation } from "@/data/user/revoke-session-mutation";
import { useSessionQuery } from "@/data/user/session-query";
import useSignOutMutation from "@/hooks/mutations/useSignOutMutation";
import type { Session } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";

export default function UserCard(props: {
	session: Session | null;
	activeSessions: Session["session"][];
}) {
	const router = useRouter();
	const { mutateAsync: signOutMutation, isPending: signOutMutationIsPending } =
		useSignOutMutation();
	const {
		mutate: revokeSessionMutation,
		isPending: revokeSessionMutationIsPending,
		variables: revokeSessionMutationVariables,
	} = useRevokeSessionMutation();
	const { data } = useSessionQuery();
	const session = data || props.session;

	const [twoFactorDialog, setTwoFactorDialog] = useState<boolean>(false);
	const [isSignOut, setIsSignOut] = useState<boolean>(false);
	const [emailVerificationPending, setEmailVerificationPending] =
		useState<boolean>(false);
	const [activeSessions, setActiveSessions] = useState(props.activeSessions);
	const removeActiveSession = (id: string) =>
		setActiveSessions(activeSessions.filter((session) => session.id !== id));

	return (
		<Card>
			<CardHeader>
				<CardTitle>User</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-1 gap-8">
				<div className="flex flex-col gap-2">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-4">
							<Avatar className="hidden size-9 sm:flex">
								<AvatarImage
									src={session?.user.image || undefined}
									alt="Avatar"
									className="object-cover"
								/>
								<AvatarFallback>{session?.user.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="grid">
								<div className="flex items-center gap-1">
									<p className="font-medium text-sm leading-none">
										{session?.user.name}
									</p>
								</div>
								<p className="text-sm">{session?.user.email}</p>
							</div>
						</div>
						<EditUserForm />
					</div>
				</div>

				{session?.user.emailVerified ? null : (
					<Alert>
						<AlertTitle>Verify Your Email Address</AlertTitle>
						<AlertDescription className="text-muted-foreground">
							Please verify your email address. Check your inbox for the
							verification email. If you haven't received the email, click the
							button below to resend.
							<Button
								size="sm"
								variant="secondary"
								className="mt-2"
								onClick={async () => {
									await authClient.sendVerificationEmail(
										{
											email: session?.user.email || "",
										},
										{
											onRequest(context: RequestContext) {
												setEmailVerificationPending(true);
											},
											onError(context: ErrorContext) {
												toast.error(context.error.message);
												setEmailVerificationPending(false);
											},
											onSuccess() {
												toast.success("Verification email sent successfully");
												setEmailVerificationPending(false);
											},
										}
									);
								}}
							>
								{emailVerificationPending ? (
									<Spinner />
								) : (
									"Resend Verification Email"
								)}
							</Button>
						</AlertDescription>
					</Alert>
				)}

				<div className="flex w-max flex-col gap-1 border-l-2 px-2">
					<p className="font-medium text-xs">Active Sessions</p>
					{activeSessions
						.filter((session) => session.userAgent)
						.map((session) => {
							const isCurrentSession = session.id === props.session?.session.id;
							const isTerminating =
								revokeSessionMutationIsPending &&
								revokeSessionMutationVariables?.token === session.token;
							return (
								<div key={session.id}>
									<div className="flex items-center gap-2 font-medium text-black text-sm dark:text-white">
										{new UAParser(session.userAgent || "").getDevice().type ===
										"mobile" ? (
											<PhoneIcon />
										) : (
											<Laptop size={16} />
										)}
										{new UAParser(session.userAgent || "").getOS().name ||
											session.userAgent}
										, {new UAParser(session.userAgent || "").getBrowser().name}
										<Button
											className="cursor-pointer border-red-600 bg-transparent text-red-500 text-xs underline opacity-80 hover:bg-transparent"
											onClick={async () => {
												revokeSessionMutation(
													{
														token: session.token,
													},
													{
														onSuccess: () => {
															removeActiveSession(session.id);
															if (isCurrentSession) {
																router.navigate({
																	to: "/",
																});
															}
														},
													}
												);
											}}
										>
											{isTerminating ? (
												<Spinner />
											) : isCurrentSession ? (
												"Sign Out"
											) : (
												"Terminate"
											)}
										</Button>
									</div>
								</div>
							);
						})}
				</div>
				<div className="flex flex-wrap items-center justify-between gap-2 border-y py-4">
					<div className="flex flex-col gap-2">
						<p className="text-sm">Passkeys</p>
						<div className="flex flex-wrap gap-2">
							<ButtonGroup>
								<AddPasskeyForm />
								<ListPasskeysForm />
							</ButtonGroup>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<p className="text-sm">Two Factor</p>
						<div className="flex gap-2">
							{!!session?.user.twoFactorEnabled && <TwoFactorQrForm />}
							<Dialog open={twoFactorDialog} onOpenChange={setTwoFactorDialog}>
								<DialogTrigger
									render={
										<Button
											variant={
												session?.user.twoFactorEnabled
													? "destructive"
													: "outline"
											}
											className="gap-2"
										>
											{session?.user.twoFactorEnabled ? (
												<ShieldOff size={16} />
											) : (
												<ShieldCheck size={16} />
											)}
											<span className="text-xs md:text-sm">
												{session?.user.twoFactorEnabled
													? "Disable 2FA"
													: "Enable 2FA"}
											</span>
										</Button>
									}
								/>
								<DialogContent className="w-11/12 sm:max-w-[425px]">
									<DialogHeader>
										<DialogTitle>
											{session?.user.twoFactorEnabled
												? "Disable 2FA"
												: "Enable 2FA"}
										</DialogTitle>
										<DialogDescription>
											{session?.user.twoFactorEnabled
												? "Disable the second factor authentication from your account"
												: "Enable 2FA to secure your account"}
										</DialogDescription>
									</DialogHeader>
									{session?.user.twoFactorEnabled ? (
										<TwoFactorDisableForm
											onSuccess={() => setTwoFactorDialog(false)}
										/>
									) : (
										<TwoFactorEnableForm
											onSuccess={() => setTwoFactorDialog(false)}
										/>
									)}
								</DialogContent>
							</Dialog>
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter className="items-center justify-between gap-2">
				<ButtonGroup>
					<ButtonGroup>
						<ChangeEmailForm />
					</ButtonGroup>
					<ButtonGroup>
						<ChangePasswordForm />
					</ButtonGroup>
					<ButtonGroup>
						<DeleteAccountForm />
					</ButtonGroup>
				</ButtonGroup>
				{session?.session.impersonatedBy ? (
					<Button
						className="z-10 cursor-pointer gap-2"
						variant="secondary"
						onClick={async () => {
							setIsSignOut(true);
							await authClient.admin.stopImpersonating();
							setIsSignOut(false);
							toast.info("Impersonation stopped successfully");
							router.navigate({ to: "/admin" });
						}}
						disabled={isSignOut}
					>
						<span className="text-sm">
							{isSignOut ? (
								<Spinner />
							) : (
								<div className="flex items-center gap-2">
									<StopCircle color="red" size={16} />
									Stop Impersonation
								</div>
							)}
						</span>
					</Button>
				) : (
					<Button
						className="z-10 cursor-pointer gap-2"
						variant="secondary"
						onClick={async () => {
							signOutMutation();
						}}
						disabled={signOutMutationIsPending}
					>
						<span className="text-sm">
							{signOutMutationIsPending ? (
								<Spinner />
							) : (
								<div className="flex items-center gap-2">
									<LogOut size={16} />
									Sign Out
								</div>
							)}
						</span>
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
