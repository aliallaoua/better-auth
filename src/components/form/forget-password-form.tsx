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
import { FieldGroup } from "../ui/field";

export function ForgetPasswordForm() {
	const [isSubmitted, setIsSubmitted] = useState(false);

	const forgetPasswordFormOpts = formOptions({
		defaultValues: {
			email: "",
		},
	});

	const form = useAppForm({
		...forgetPasswordFormOpts,
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
							<CheckCircle2 className="h-4 w-4" />
							<AlertDescription>
								If you don't see the email, check your spam folder.
							</AlertDescription>
						</Alert>
					</CardContent>
					<CardFooter className="flex justify-center">
						<Link to="/login">
							<Button variant="link" className="gap-2 px-0">
								<ArrowLeft size={15} />
								Back to sign in
							</Button>
						</Link>
					</CardFooter>
				</Card>
			</main>
		);
	}

	return (
		<main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
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

							<form.AppForm>
								<form.SubscribeButton label="Send reset link" />
							</form.AppForm>
							<div className="text-center text-muted-foreground">
								<Link
									className="hover:underline hover:underline-offset-4"
									to="/login"
								>
									<Button variant="link" className="gap-2 px-0">
										<ArrowLeft size={15} />
										Back to sign in
									</Button>
								</Link>
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
		</main>
	);
}
