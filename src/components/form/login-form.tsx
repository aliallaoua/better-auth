import { formOptions } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldSeparator,
} from "@/components/ui/field";
import { useAppForm } from "@/hooks/form";
import useSignInMutation from "@/hooks/mutations/useSignInMutation";
import { authClient } from "@/lib/auth-client";
import {
	signInWithGithub,
	signInWithGoogle,
	signInWithPasskey,
} from "@/lib/auth-functions";
import { cn } from "@/lib/utils";
import { SignInSchema } from "@/schema";
import { GitHubIcon } from "../github-icon";
import { LastUsedIndicator } from "../last-used-indicator";

export function LogInForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { mutateAsync: signInMutation } = useSignInMutation();

	const logInFormOpts = formOptions({
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	const form = useAppForm({
		...logInFormOpts,
		validators: {
			onChange: SignInSchema,
		},
		onSubmit: async ({ value }) => {
			// try {
			// 	await signInMutation(value);
			// } catch (e) {
			// 	form.setErrorMap({
			// 		onSubmit: e.message,
			// 	});
			// }
			await signInMutation(value);
		},
	});

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome back</CardTitle>
					<CardDescription>
						Sign in with your Github or Google account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<FieldGroup>
							<Field>
								<Button
									variant="outline"
									type="button"
									className={cn("relative flex w-full items-center gap-2")}
									onClick={signInWithGithub}
								>
									<GitHubIcon />
									<span>Sign in with GitHub</span>
									{authClient.isLastUsedLoginMethod("github") && (
										<LastUsedIndicator />
									)}
								</Button>
								<Button
									variant="outline"
									type="button"
									className={cn("relative flex w-full gap-2")}
									onClick={signInWithGoogle}
								>
									<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path
											d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
											fill="currentColor"
										/>
									</svg>
									<span>Sign in with Google</span>
									{authClient.isLastUsedLoginMethod("google") && (
										<LastUsedIndicator />
									)}
								</Button>
								<Button
									variant="outline"
									type="button"
									className={cn("relative flex w-full items-center gap-2")}
									onClick={signInWithPasskey}
								>
									<Key size={16} />
									<span>Sign in with Passkey</span>
									{authClient.isLastUsedLoginMethod("passkey") && (
										<LastUsedIndicator />
									)}
								</Button>
							</Field>
							<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
								Or continue with
							</FieldSeparator>
							<form.AppField
								name="email"
								children={(field) => (
									<field.TextField
										autoComplete="email"
										label="Email"
										placeholder="name@example.com"
										required
										type="email"
									/>
								)}
							/>

							<form.AppField
								name="password"
								children={(field) => (
									<field.PasswordField
										autoComplete="current-password"
										forgotPassword
										label="Password"
										placeholder="Password"
										required
									/>
								)}
							/>

							<form.AppField
								name="rememberMe"
								children={(field) => (
									<field.CheckboxField label="Remember Me" />
								)}
							/>

							<Field>
								<form.AppForm>
									<div className="relative flex flex-col space-x-2">
										{authClient.isLastUsedLoginMethod("email") && (
											<LastUsedIndicator />
										)}
										<form.SubscribeButton label="Log In" />
									</div>
								</form.AppForm>
								<FieldDescription className="text-center">
									Don&apos;t have an account? <Link to="/signup">Sign up</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center">
				By clicking continue, you agree to our{" "}
				<Link to="#">Terms of Service</Link> and{" "}
				<Link to="#">Privacy Policy</Link>.
			</FieldDescription>
		</div>
	);
}
