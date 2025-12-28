import { formOptions } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import z from "zod";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/form";
import { authClient } from "@/lib/auth-client";

const totpSchema = z.object({
	code: z
		.string()
		.length(6, "TOTP code must be 6 digits.")
		.regex(/^\d+$/, "TOTP code must be digits only."),
});

export function TwoFactorTotpForm() {
	const router = useRouter();

	const {
		mutate: verifyTotpMutation,
		isPending,
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
			onChange: totpSchema,
		},
		onSubmit: async ({ value }) => {
			verifyTotpMutation(value.code);
		},
	});

	if (isSuccess && data?.data?.token) {
		return (
			<div className="flex flex-col items-center justify-center space-y-2 py-4">
				<CheckCircle2 className="h-12 w-12 text-green-500" />
				<p className="font-semibold text-lg">Verification Successful</p>
			</div>
		);
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="grid gap-4"
		>
			<FieldGroup>
				<form.AppField
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
					name="code"
				/>
			</FieldGroup>
			<form.AppForm>
				<form.SubscribeButton className="cursor-pointer" label="Verify" />
			</form.AppForm>
		</form>
	);
}
