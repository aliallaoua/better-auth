import { formOptions } from "@tanstack/react-form";
import type { ErrorContext, SuccessContext } from "better-auth/client";
import { useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import * as z from "zod";
import CopyButton from "@/components/ui/copy-button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/form";
import { authClient } from "@/lib/auth-client";

const passwordSchema = z.object({
	password: z.string().min(8, "Password must be at least 8 characters."),
});

const otpSchema = z.object({
	otp: z.string().min(6, "OTP must be at least 6 characters."),
});

interface TwoFactorEnableFormProps {
	onSuccess?: () => void;
}

export function TwoFactorEnableForm({ onSuccess }: TwoFactorEnableFormProps) {
	const [totpURI, setTotpURI] = useState<string>("");

	const passwordFormOpts = formOptions({
		defaultValues: {
			password: "",
		},
	});

	const passwordForm = useAppForm({
		...passwordFormOpts,
		validators: {
			onChange: passwordSchema,
		},
		onSubmit: async ({ value }) => {
			await authClient.twoFactor.enable({
				password: value.password,
				fetchOptions: {
					onSuccess(ctx: SuccessContext) {
						setTotpURI(ctx.data.totpURI);
					},
					onError(context: ErrorContext) {
						toast.error(context.error.message);
					},
				},
			});
		},
	});

	const otpFormOpts = formOptions({
		defaultValues: {
			otp: "",
		},
	});

	const otpForm = useAppForm({
		...otpFormOpts,
		validators: {
			onChange: otpSchema,
		},
		onSubmit: async ({ value }) => {
			await authClient.twoFactor.verifyTotp({
				code: value.otp,
				fetchOptions: {
					onSuccess() {
						toast.success("2FA enabled successfully");
						onSuccess?.();
					},
					onError(context: ErrorContext) {
						toast.error(context.error.message);
						otpForm.reset();
					},
				},
			});
		},
	});

	if (totpURI) {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-center">
					<QRCode value={totpURI} />
				</div>
				<div className="flex items-center justify-center gap-2">
					<p className="text-muted-foreground text-sm">Copy URI to clipboard</p>
					<CopyButton textToCopy={totpURI} />
				</div>
				<form
					className="flex flex-col gap-4"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						otpForm.handleSubmit();
					}}
				>
					<FieldGroup>
						<otpForm.AppField
							name="otp"
							children={(field) => (
								<div className="grid gap-2">
									<field.TextField
										label="Scan the QR code with your TOTP app"
										placeholder="Enter OTP code"
										required
									/>
								</div>
							)}
						/>
					</FieldGroup>
					<otpForm.AppForm>
						<otpForm.SubscribeButton label="Verify & Enable" />
					</otpForm.AppForm>
				</form>
			</div>
		);
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				passwordForm.handleSubmit();
			}}
			className="flex flex-col gap-4"
		>
			<FieldGroup>
				<passwordForm.AppField
					name="password"
					children={(field) => (
						<field.PasswordField
							label="Password"
							placeholder="Enter your password"
							autoComplete="current-password"
							required
						/>
					)}
				/>
			</FieldGroup>
			<passwordForm.AppForm>
				<passwordForm.SubscribeButton
					className="cursor-pointer"
					label="Continue"
				/>
			</passwordForm.AppForm>
		</form>
	);
}
