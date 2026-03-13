import { formOptions } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { VerificationSuccess } from "@/components/verification-success";
import { useAppForm } from "@/hooks/form";
import { authClient } from "@/lib/auth-client";
import { TwoFactorOTPSchema } from "@/schema";

interface TwoFactorEmailOtpFormProps {
	userEmail?: string;
}

export function TwoFactorEmailOtpForm({
	userEmail = "your email",
}: TwoFactorEmailOtpFormProps) {
	const router = useRouter();
	const [isOtpSent, setIsOtpSent] = useState(false);

	const { mutate: sendOtpMutation, isPending } = useMutation({
		mutationFn: async () => {
			return await authClient.twoFactor.sendOtp();
		},
		onSuccess: () => {
			setIsOtpSent(true);
			toast.info(`OTP sent to ${userEmail}`);
		},
		onError: (error: any) => {
			toast.error(error.message || "Failed to send OTP");
		},
	});

	const {
		mutate: verifyOtpMutation,
		isSuccess,
		data,
	} = useMutation({
		mutationFn: async (code: string) => {
			return await authClient.twoFactor.verifyOtp({ code });
		},
		onSuccess: (res) => {
			if (res.data) {
				toast.success("OTP validated successfully");
				router.navigate({ to: "/dashboard" });
			} else {
				toast.error("Invalid OTP");
			}
		},
		onError: (error: any) => {
			toast.error(error.message || "Invalid OTP");
		},
	});

	const formOpts = formOptions({
		defaultValues: {
			code: "",
		},
	});

	const form = useAppForm({
		...formOpts,
		validators: {
			onChange: TwoFactorOTPSchema,
		},
		onSubmit: async ({ value }) => {
			verifyOtpMutation(value.code);
		},
	});

	if (isSuccess && data?.data) {
		return <VerificationSuccess />;
	}

	if (!isOtpSent) {
		return (
			<div className="grid gap-4">
				<Button
					onClick={() => sendOtpMutation()}
					className="w-full"
					disabled={isPending}
				>
					{isPending ? (
						<Loader2 size={16} className="animate-spin" />
					) : (
						<>
							<Mail className="mr-2 size-4" /> Send OTP to Email
						</>
					)}
				</Button>
			</div>
		);
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="grid gap-4"
		>
			<FieldGroup>
				<form.AppField
					name="code"
					children={(field) => (
						<field.TextField
							label="One-Time Password"
							placeholder="Enter 6-digit OTP"
							required
							inputMode="numeric"
							maxLength={6}
							autoComplete="one-time-code"
						/>
					)}
				/>
			</FieldGroup>
			<form.AppForm>
				<form.SubscribeButton className="cursor-pointer" label="Validate OTP" />
			</form.AppForm>
		</form>
	);
}
