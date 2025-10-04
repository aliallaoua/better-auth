import { formOptions } from '@tanstack/react-form';
import { Link } from '@tanstack/react-router';
import { X } from 'lucide-react';
import { useState } from 'react';
// import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useAppForm } from '@/hooks/form';
import useSignUpMutation from '@/hooks/mutations/useSignUpMutation';
import { signInWithGoogle } from '@/lib/auth-functions';
import { SignUpSchema } from '@/schema';
import { Field, FieldGroup, FieldSeparator } from '../ui/field';
// import { Alert, AlertDescription } from '../ui/alert';

export function SignUpForm() {
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	// const signUpMutation = useSignUpMutation();
	const { mutateAsync: signUpMutation } = useSignUpMutation();

	const signUpFormOpts = formOptions({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			image: null,
		},
	});

	const form = useAppForm({
		...signUpFormOpts,
		validators: {
			onChange: SignUpSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				// await signUpMutation.mutateAsync(value);
				await signUpMutation(value);

				// } catch (e: any) {
			} catch (e: any) {
				// Set form-level error
				form.setErrorMap({
					onSubmit: e.message,
				});
			}
		},
	});

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			form.setFieldValue('image', file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const clearImage = () => {
		form.setFieldValue('image', null);
		setImagePreview(null);
		// Reset the file input
		const fileInput = document.getElementById('image') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	};

	return (
		<Card className="mx-auto w-[500px]">
			<CardHeader className="text-center">
				<CardTitle className="text-xl">Welcome</CardTitle>
				<CardDescription>Sign up with your Google account</CardDescription>
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
						<Field>
							<Button
								onClick={signInWithGoogle}
								type="button"
								variant="outline"
							>
								<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
										fill="currentColor"
									/>
								</svg>
								Sign up with Google
							</Button>
						</Field>

						<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
							Or continue with
						</FieldSeparator>

						<form.AppField
							children={(field) => (
								<field.TextField
									autoComplete="name"
									label="Name"
									placeholder="Name"
									required
								/>
							)}
							name="name"
						/>

						{/* <div className="grid gap-3">
							<Label htmlFor="firstName">First name</Label>
							<form.AppField
								name="firstName"
								children={(field) => (
									<field.TextField
										id="firstName"
									/>
								)}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="lastName">Last name</Label>
							<form.AppField
								name="lastName"
								children={(field) => (
									<field.TextField
										id="lastName"
									/>
								)}
							/>
						</div> */}
						<form.AppField
							children={(field) => (
								<field.TextField
									autoComplete="email"
									label="Email"
									placeholder="name@example.com"
									required
									type="email"
								/>
							)}
							name="email"
						/>
						<form.AppField
							children={(field) => (
								<field.PasswordField
									autoComplete="new-password"
									label="Password"
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
									placeholder="Password"
									required
								/>
							)}
							name="confirmPassword"
						/>

						<div className="grid gap-2">
							<form.AppField
								children={(field) => (
									<div className="grid gap-2">
										{/* <Label htmlFor="image">Profile Image</Label> */}
										<div className="flex items-end gap-4">
											{imagePreview && (
												<div className="relative size-16 overflow-hidden rounded-sm">
													<img
														alt="Profile preview"
														className="size-full object-cover"
														// height={16}
														src={imagePreview}
														// width={16}
													/>
												</div>
											)}
											<div className="flex w-full items-center gap-2">
												<field.ImageField
													className="w-full text-muted-foreground"
													id="image"
													label="Profile Image"
													onChange={handleImageChange}
												/>
												{imagePreview && (
													<X
														className="cursor-pointer"
														onClick={clearImage}
														size={20}
													/>
												)}
											</div>
										</div>
									</div>
								)}
								name="image"
							/>
						</div>

						<form.AppForm>
							<form.SubscribeButton label="Sign up" />
						</form.AppForm>

						<div className="text-center text-sm">
							Already have an account?{' '}
							<Link className="underline underline-offset-4" to="/signin">
								Sign in
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

			<div className="text-balance text-center text-muted-foreground text-xs *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
				By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
				and <a href="#">Privacy Policy</a>.
			</div>
		</Card>
	);
}
