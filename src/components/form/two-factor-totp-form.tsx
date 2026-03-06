import { formOptions } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { FieldGroup } from "@/components/ui/field";
import { VerificationSuccess } from "@/components/verification-success";
import { useAppForm } from "@/hooks/form";
import { authClient } from "@/lib/auth-client";
import { TwoFactorOTPSchema } from "@/schema";

export function TwoFactorTotpForm() {
	const router = useRouter();

	const {
		mutate: verifyTotpMutation,
		isSuccess,
		data,
	} = useMutation({
		mutationFn: async (code: string) => {
			return await authClient.twoFactor.verifyTotp({ code });
		},
		onSuccess: (res) => {
			if (res.data?.token) {
				toast.success("TOTP verified successfully");
				router.navigate({ to: "/dashboard" });
			} else {
				toast.error("Invalid TOTP code");
			}
		},
		onError: (error: any) => {
			toast.error(error.message || "Invalid TOTP code");
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
			verifyTotpMutation(value.code);
		},
	});

	if (isSuccess && data?.data?.token) {
		return <VerificationSuccess />;
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
							label="TOTP Code"
							placeholder="Enter 6-digit code"
							required
							inputMode="numeric"
							maxLength={6}
							autoComplete="one-time-code"
						/>
					)}
				/>
			</FieldGroup>
			<form.AppForm>
				<form.SubscribeButton className="cursor-pointer" label="Verify" />
			</form.AppForm>
		</form>
	);
}
