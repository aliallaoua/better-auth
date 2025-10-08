import { formOptions } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/hooks/form";
import { authClient } from "@/lib/auth-client";
import { ForgotPasswordSchema } from "@/schema";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import {
	FieldDescription,
	FieldGroup,
	FieldSeparator,
	FieldSet,
} from "../ui/field";

export function ForgetPasswordForm() {
	const [isSubmitted, setIsSubmitted] = useState(false);

	const signInFormOpts = formOptions({
		defaultValues: {
			email: "",
		},
	});

	const form = useAppForm({
		...signInFormOpts,
		validators: {
			onChange: ForgotPasswordSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const { error } = await authClient.requestPasswordReset({
					email: value.email,
					redirectTo: "/reset-password",
				});
				if (error) {
					toast.error(error.message);
				} else {
					toast.success("Password reset email sent");
					setIsSubmitted(true);
				}
			} catch (e) {
				// Set form-level error
				form.setErrorMap({
					onSubmit: e.message,
				});
			}
		},
	});

	// If modal should be shown, render it instead of the form
	if (isSubmitted) {
		return (
			<main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
				<Card className="w-[350px]">
					<CardHeader>
						<CardTitle>Check your email</CardTitle>
						<CardDescription>
							We've sent a password reset link to your email.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Alert variant="default">
							<CheckCircle2 className="size-4" />
							<AlertDescription>
								If you don't see the email, check your spam folder.
							</AlertDescription>
						</Alert>
					</CardContent>
					<CardFooter>
						<Button
							className="w-full"
							onClick={() => setIsSubmitted(false)}
							variant="outline"
						>
							<ArrowLeft className="mr-2 size-4" /> Back to reset password
						</Button>
					</CardFooter>
				</Card>
			</main>
		);
	}

	return (
		<main className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
			<div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]" />
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Forgot password</CardTitle>
					<CardDescription>
						Enter your email to reset your password
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
							<FieldSet>
								<div className="grid gap-3">
									<form.AppField
										children={(field) => (
											<field.TextField
												autoComplete="email"
												label="Email"
												placeholder="Enter your email"
												required
												type="email"
											/>
										)}
										name="email"
									/>
								</div>

								<div className="flex flex-col gap-3">
									<form.AppForm>
										<form.SubscribeButton label="Send reset link" />
									</form.AppForm>
								</div>
							</FieldSet>
							<FieldSeparator />
							<FieldDescription className="text-center">
								<Link
									className="hover:underline hover:underline-offset-4"
									to="/signin"
								>
									Back to sign in
								</Link>
							</FieldDescription>
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
		</main>
	);
}
