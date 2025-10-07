import { formOptions } from "@tanstack/react-form";
import type { ErrorContext, SuccessContext } from "better-auth/react";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { useAppForm } from "@/hooks/form";
import { authClient } from "@/lib/auth-client";
import type { Session } from "@/lib/auth-types";
import { TwoFactorOTPSchema, TwoFactorPasswordSchema } from "@/schema";
// import { Alert, AlertDescription } from '../ui/alert';
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";

export function TwoFactorForm({ session }: { session: Session }) {
	const [isPendingTwoFa, setIsPendingTwoFa] = useState<boolean>(false);
	const [twoFactorDialog, setTwoFactorDialog] = useState<boolean>(false);
	const [twoFactorVerifyURI, setTwoFactorVerifyURI] = useState<string>("");
	const [twoFaPassword, setTwoFaPassword] = useState<string>("");

	// Password form for enabling/disabling 2FA
	const passwordFormOpts = formOptions({
		defaultValues: {
			password: "",
		},
	});

	const passwordForm = useAppForm({
		...passwordFormOpts,
		validators: {
			onChange: TwoFactorPasswordSchema,
		},
		onSubmit: async ({ value }) => {
			setIsPendingTwoFa(true);
			try {
				if (session?.user.twoFactorEnabled) {
					// Disable 2FA
					await authClient.twoFactor.disable({
						password: value.password,
						fetchOptions: {
							onError(context: ErrorContext) {
								toast.error(context.error.message);
							},
							onSuccess() {
								toast.success("2FA disabled successfully");
								setTwoFactorDialog(false);
								passwordForm.reset();
							},
						},
					});
				} else {
					// Enable 2FA - get the QR code and store password for later
					await authClient.twoFactor.enable({
						password: value.password,
						fetchOptions: {
							onError(context: ErrorContext) {
								toast.error(context.error.message);
							},
							onSuccess(ctx: SuccessContext<any>) {
								setTwoFactorVerifyURI(ctx.data.totpURI);
								setTwoFaPassword(value.password); // Store password for OTP verification
								toast.success("Please scan the QR code and enter the OTP");
								// Don't reset the form yet - we need the password
							},
						},
					});
				}
			} finally {
				setIsPendingTwoFa(false);
			}
		},
	});

	// OTP form for verifying the 2FA setup
	const otpFormOpts = formOptions({
		defaultValues: {
			code: "",
		},
	});

	const otpForm = useAppForm({
		...otpFormOpts,
		validators: {
			onChange: TwoFactorOTPSchema,
		},
		onSubmit: async ({ value }) => {
			setIsPendingTwoFa(true);
			try {
				// First verify the OTP
				await authClient.twoFactor.verifyTotp({
					code: value.code,
					fetchOptions: {
						onError(context: ErrorContext) {
							setIsPendingTwoFa(false);
							otpForm.reset();
							toast.error(context.error.message);
						},
						onSuccess() {
							toast("2FA enabled successfully");
							setTwoFactorVerifyURI("");
							setIsPendingTwoFa(false);
							setTwoFaPassword(""); // Clear stored password
							otpForm.reset();
							passwordForm.reset();
							setTwoFactorDialog(false);
						},
					},
				});
				return; // Exit early after successful OTP verification
			} catch (error) {
				// If OTP verification fails, we still need to call enable() according to original logic
			}

			// This part matches your original code - calling enable again with stored password
			try {
				await authClient.twoFactor.enable({
					password: twoFaPassword,
					fetchOptions: {
						onError(context: ErrorContext) {
							toast.error(context.error.message);
						},
						onSuccess(ctx: SuccessContext<any>) {
							setTwoFactorVerifyURI(ctx.data.totpURI);
							toast.success("2FA enabled successfully");
							otpForm.reset();
						},
					},
				});
			} finally {
				setIsPendingTwoFa(false);
			}
		},
	});

	const handleDialogClose = (open: boolean) => {
		if (!open) {
			// Reset all forms, state, and stored password when dialog closes
			passwordForm.reset();
			otpForm.reset();
			setTwoFactorVerifyURI("");
			setTwoFaPassword("");
		}
		setTwoFactorDialog(open);
	};

	return (
		<Dialog onOpenChange={handleDialogClose} open={twoFactorDialog}>
			<DialogTrigger asChild>
				<Button
					className="cursor-pointer gap-2"
					variant={session?.user.twoFactorEnabled ? "destructive" : "outline"}
				>
					{session?.user.twoFactorEnabled ? (
						<ShieldOff size={16} />
					) : (
						<ShieldCheck size={16} />
					)}
					<span className="text-xs md:text-sm">
						{session?.user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
					</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="w-11/12 sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{session?.user.twoFactorEnabled
							? "Disable 2FA"
							: twoFactorVerifyURI
								? "Verify OTP"
								: "Enable 2FA"}
					</DialogTitle>
					<DialogDescription>
						{session?.user.twoFactorEnabled
							? "Enter your password to disable two-factor authentication"
							: twoFactorVerifyURI
								? "Scan the QR code and enter the OTP from your authenticator app"
								: "Enter your password to enable two-factor authentication"}
					</DialogDescription>
				</DialogHeader>

				{twoFactorVerifyURI ? (
					// Show OTP form when we have a QR code
					<div className="space-y-4">
						<div className="flex items-center justify-center">
							<QRCode value={twoFactorVerifyURI} />
						</div>
						<form
							className="flex flex-col gap-4"
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								otpForm.handleSubmit();
							}}
						>
							<otpForm.AppField
								children={(field) => (
									<div className="grid gap-2">
										<field.TextField
											label="Scan the QR code with your TOTP app"
											placeholder="Enter OTP"
											required
										/>
									</div>
								)}
								name="code"
							/>
							<DialogFooter>
								<otpForm.AppForm>
									<otpForm.SubscribeButton
										className="cursor-pointer"
										disabled={isPendingTwoFa || !otpForm.state.canSubmit}
										label="Enable 2FA"
									/>
								</otpForm.AppForm>
							</DialogFooter>
							{/* <otpForm.Subscribe
								children={([errorMap]) =>
									errorMap.onSubmit ? (
										<Alert className="mt-4" variant="destructive">
											<AlertCircle className="size-4" />
											<AlertDescription>
												{errorMap.onSubmit.toString()}
											</AlertDescription>
										</Alert>
									) : null
								}
								selector={(state) => [state.errorMap]}
							/> */}
						</form>
					</div>
				) : (
					// Show password form for enable/disable
					<form
						className="flex flex-col gap-4"
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							passwordForm.handleSubmit();
						}}
					>
						<passwordForm.AppField
							children={(field) => (
								<field.PasswordField
									label="Password"
									placeholder="Password"
									required
								/>
							)}
							name="password"
						/>
						<DialogFooter>
							<passwordForm.AppForm>
								<passwordForm.SubscribeButton
									className="cursor-pointer"
									disabled={isPendingTwoFa || !passwordForm.state.canSubmit}
									label={
										session?.user.twoFactorEnabled ? "Disable 2FA" : "Continue"
									}
								/>
							</passwordForm.AppForm>
						</DialogFooter>
						{/* <passwordForm.Subscribe
							children={([errorMap]) =>
								errorMap.onSubmit ? (
									<Alert className="mt-4" variant="destructive">
										<AlertCircle className="size-4" />
										<AlertDescription>
											{errorMap.onSubmit.toString()}
										</AlertDescription>
									</Alert>
								) : null
							}
							selector={(state) => [state.errorMap]}
						/> */}
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
