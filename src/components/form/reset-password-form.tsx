import { formOptions } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
// import { AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/hooks/form";
import { authClient } from "@/lib/auth-client";
import { ResetPasswordSchema } from "@/schema";
import { FieldGroup } from "../ui/field";

// import { Alert, AlertDescription } from '../ui/alert';

export function ResetPasswordForm({ token }: { token: string }) {
	const router = useRouter();

	const resetPasswordFormOpts = formOptions({
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const form = useAppForm({
		...resetPasswordFormOpts,
		validators: {
			onChange: ResetPasswordSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const { error } = await authClient.resetPassword({
					newPassword: value.password,
					token,
				});

				if (error) {
					toast.error(error.message);
				} else {
					toast.success("Password reset successfully");
					router.navigate({
						to: "/login",
					});
				}
			} catch (e) {
				// Set form-level error
				form.setErrorMap({
					onSubmit: e.message,
				});
			}
		},
	});

	return (
		<div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Reset password</CardTitle>
					<CardDescription>
						Enter new password and confirm it to reset your password
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						className="flex flex-col gap-4"
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
					>
						<FieldGroup>
							<form.AppField
								children={(field) => (
									<field.PasswordField
										autoComplete="new-password"
										label="New password"
										placeholder="Password"
										required
									/>
								)}
								name="password"
							/>
							<form.AppField
								children={(field) => (
									<field.PasswordField
										autoComplete="new-password"
										label="Confirm password"
										placeholder="Confirm Password"
										required
									/>
								)}
								name="confirmPassword"
							/>

							<div className="flex flex-col gap-3">
								<form.AppForm>
									<form.SubscribeButton label="Reset password" />
								</form.AppForm>
							</div>
						</FieldGroup>

						{/* Display form-level errors */}
						{/* <form.Subscribe
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
				</CardContent>
			</Card>
		</div>
	);
}
