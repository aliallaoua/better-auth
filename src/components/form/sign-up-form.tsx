import { formOptions } from "@tanstack/react-form-start";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/hooks/form";
import useSignUpMutation from "@/hooks/mutations/useSignUpMutation";
import { cn } from "@/lib/utils";
import type { SignUpSchema as SignUpType } from "@/schema";
import { SignUpSchema } from "@/schema";
import { Field, FieldDescription, FieldGroup } from "../ui/field";

export function SignUpForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const { mutateAsync: signUpMutation } = useSignUpMutation();

	const signUpFormOpts = formOptions({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			image: null,
		} satisfies SignUpType as SignUpType,
	});

	const form = useAppForm({
		...signUpFormOpts,
		validators: {
			onChange: SignUpSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await signUpMutation(value);
			} catch (e) {
				form.setErrorMap({
					onSubmit: e.message,
				});
			}
		},
	});

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			form.setFieldValue("image", file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const clearImage = () => {
		form.setFieldValue("image", null);
		setImagePreview(null);
		// Reset the file input
		const fileInput = document.getElementById("image") as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Create your account</CardTitle>
					<CardDescription>
						Enter your email below to create your account
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
									<field.TextField
										autoComplete="name"
										label="Full Name"
										placeholder="Name"
										required
									/>
								)}
								name="name"
							/>

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

							<form.AppField
								children={(field) => (
									<div className="grid gap-2">
										{/* <Label htmlFor="image">Profile Image</Label> */}
										<div className="flex items-end gap-4">
											{imagePreview && (
												<div className="relative size-16 overflow-hidden rounded-sm">
													<Image
														src={imagePreview}
														alt="Profile preview"
														layout="fullWidth"
														objectFit="cover"
														className="size-full object-cover"
													/>
												</div>
											)}
											<div className="flex w-full items-center gap-2">
												{/* <field.ImageField
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
												)} */}
												<field.ImageField
													className="w-full text-muted-foreground"
													id="image"
													label="Profile Image"
													onChange={handleImageChange}
													showButton={!!imagePreview}
													handleAction={clearImage}
												/>
											</div>
										</div>
									</div>
								)}
								name="image"
							/>

							<Field>
								<form.AppForm>
									<form.SubscribeButton label="Create Account" />
								</form.AppForm>
								<FieldDescription className="px-6 text-center">
									Already have an account?{" "}
									<Link className="underline underline-offset-4" to="/login">
										Log in
									</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center">
				By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
				and <a href="#">Privacy Policy</a>.
			</FieldDescription>
		</div>
	);
}
