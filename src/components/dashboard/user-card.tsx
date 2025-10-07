import { useRouter } from "@tanstack/react-router";
import type { ErrorContext } from "better-auth/react";
import { Laptop, LogOut, PhoneIcon, StopCircle } from "lucide-react";
import { Activity, useState } from "react";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import useSignOutMutation from "@/hooks/mutations/useSignOutMutation";
import { authClient, useSession } from "@/lib/auth-client";
import type { Session } from "@/lib/auth-types";
import { AddPasskeyForm } from "../form/add-passkey-form";
import { ChangeEmailForm } from "../form/change-email-form";
import { ChangePasswordForm } from "../form/change-password-form";
import { DeleteAccountForm } from "../form/delete-account-form";
import { EditUserForm } from "../form/edit-user-form";
import { ListPasskeysForm } from "../form/list-passkeys-form";
import { QRCodePasswordForm } from "../form/qr-code-password-form";
import { TwoFactorForm } from "../form/two-factor-form";
import { ButtonGroup } from "../ui/button-group";
import { Spinner } from "../ui/spinner";

export default function UserCard(props: {
	session: Session | null;
	activeSessions: Session["session"][];
}) {
	const router = useRouter();
	const { data, isPending } = useSession();
	const session = data || props.session;
	const [isTerminating, setIsTerminating] = useState<string>();
	const [twoFactorVerifyURI, setTwoFactorVerifyURI] = useState<string>("");
	const [isSignOut, setIsSignOut] = useState<boolean>(false);
	const [emailVerificationPending, setEmailVerificationPending] =
		useState<boolean>(false);
	const [activeSessions, setActiveSessions] = useState(props.activeSessions);
	const removeActiveSession = (id: string) =>
		setActiveSessions(activeSessions.filter((session) => session.id !== id));
	const { mutateAsync: signOutMutation } = useSignOutMutation();

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
									alt="Avatar"
									className="object-cover"
									src={session?.user.image || undefined}
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
					<ButtonGroup>
						<ButtonGroup>
							<ChangeEmailForm />
						</ButtonGroup>
						<ButtonGroup>
							<DeleteAccountForm />
						</ButtonGroup>
					</ButtonGroup>
				</div>

				{session?.user.emailVerified ? null : (
					<Alert>
						<AlertTitle>Verify Your Email Address</AlertTitle>
						<AlertDescription className="text-muted-foreground">
							Please verify your email address. Check your inbox for the
							verification email. If you haven't received the email, click the
							button below to resend.
							<Button
								className="mt-2 cursor-pointer"
								onClick={async () => {
									await authClient.sendVerificationEmail(
										{
											email: session?.user.email || "",
										},
										{
											// onRequest(context: any) {
											onRequest() {
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
								size="sm"
								variant="secondary"
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
												setIsTerminating(session.id);
												const res = await authClient.revokeSession({
													token: session.token,
												});

												if (res.error) {
													toast.error(res.error.message);
												} else {
													toast.success("Session terminated successfully");
													removeActiveSession(session.id);
												}
												if (session.id === props.session?.session.id) {
													router.invalidate();
												}
												setIsTerminating(undefined);
											}}
										>
											{isTerminating === session.id ? (
												<Spinner />
											) : session.id === props.session?.session.id ? (
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
							{/* {!!session?.user.twoFactorEnabled && (
								<QRCodePasswordForm
									setTwoFactorVerifyURI={(uri) => setTwoFactorVerifyURI(uri)}
									twoFactorVerifyURI={twoFactorVerifyURI}
								/>
							)} */}
							<Activity
								mode={session?.user.twoFactorEnabled ? "visible" : "hidden"}
							>
								<QRCodePasswordForm
									setTwoFactorVerifyURI={(uri) => setTwoFactorVerifyURI(uri)}
									twoFactorVerifyURI={twoFactorVerifyURI}
								/>
							</Activity>

							<TwoFactorForm session={session} />
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter className="items-center justify-between gap-2">
				<ChangePasswordForm />
				{session?.session.impersonatedBy ? (
					<Button
						className="z-10 cursor-pointer gap-2"
						disabled={isSignOut}
						onClick={async () => {
							setIsSignOut(true);
							await authClient.admin.stopImpersonating();
							setIsSignOut(false);
							toast.info("Impersonation stopped successfully");
							router.navigate({ to: "/admin" });
						}}
						variant="secondary"
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
						disabled={isSignOut}
						onClick={async () => {
							setIsSignOut(true);
							await signOutMutation();
							setIsSignOut(false);
						}}
						variant="secondary"
					>
						<span className="text-sm">
							{isSignOut ? (
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
