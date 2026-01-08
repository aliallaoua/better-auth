import { formOptions } from "@tanstack/react-form";
import { useTransition } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/form";
import { authClient } from "@/lib/auth-client";

const disableSchema = z.object({
	password: z.string().min(8, "Password must be at least 8 characters."),
});

type DisableFormValues = z.infer<typeof disableSchema>;

interface TwoFactorDisableFormProps {
	onSuccess?: () => void;
}

export function TwoFactorDisableForm({ onSuccess }: TwoFactorDisableFormProps) {
	const [loading, startTransition] = useTransition();

	const formOpts = formOptions({
		defaultValues: {
			password: "",
		},
	});

	const form = useAppForm({
		...formOptions,
		validators: { onChange: disableSchema },
		onSubmit: async ({ value }) => {
			await authClient.twoFactor.disable({
				password: data.password,
				fetchOptions: {
					onSuccess() {
						toast.success("2FA disabled successfully");
						onSuccess?.();
					},
					onError(context) {
						toast.error(context.error.message);
					},
				},
			});
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="flex flex-col gap-4"
		>
			<FieldGroup>
				<form.AppField
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
			<form.AppForm>
				<form.SubscribeButton className="cursor-pointer" label="Disable 2FA" />
			</form.AppForm>
		</form>
	);
}
