import { formOptions } from "@tanstack/react-form";
// import { AlertCircle } from 'lucide-react';
import { useState } from "react";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/form";
import { authClient } from "@/lib/auth-client";
import { ChangePasswordSchema } from "@/schema";
// import { Alert, AlertDescription } from '../ui/alert';
import { Button } from "../ui/button";
import { FieldGroup, FieldSet } from "../ui/field";

export function ChangePasswordForm() {
	const [open, setOpen] = useState<boolean>(false);
	const [signOutDevices, setSignOutDevices] = useState<boolean>(false);
	const changePasswordFormOpts = formOptions({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
			signOutDevices: false,
		},
	});

	const form = useAppForm({
		...changePasswordFormOpts,
		validators: {
			onChange: ChangePasswordSchema,
		},
		onSubmit: async ({ value }) => {
			const res = await authClient.changePassword({
				newPassword: value.newPassword,
				currentPassword: value.currentPassword,
				revokeOtherSessions: signOutDevices,
			});
			if (res.error) {
				toast.error(
					res.error.message ||
						"Couldn't change your password! Make sure it's correct"
				);
			} else {
				setOpen(false);
				toast.success("Password changed successfully");
				form.reset();
			}
		},
	});

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button
					className="z-10 cursor-pointer gap-2"
					size="sm"
					variant="outline"
				>
					<svg
						height="1em"
						viewBox="0 0 24 24"
						width="1em"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M2.5 18.5v-1h19v1zm.535-5.973l-.762-.442l.965-1.693h-1.93v-.884h1.93l-.965-1.642l.762-.443L4 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L4 10.835zm8 0l-.762-.442l.966-1.693H9.308v-.884h1.93l-.965-1.642l.762-.443L12 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L12 10.835zm8 0l-.762-.442l.966-1.693h-1.931v-.884h1.93l-.965-1.642l.762-.443L20 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L20 10.835z"
							fill="currentColor"
						/>
					</svg>
					<span className="text-muted-foreground text-sm">Change Password</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="w-11/12 sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Change Password</DialogTitle>
					<DialogDescription>Change your password</DialogDescription>
				</DialogHeader>
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
							<form.AppField
								children={(field) => (
									<field.PasswordField
										autoComplete="current-password"
										label="Current Password"
										placeholder="Password"
										required
									/>
								)}
								name="currentPassword"
							/>
							<form.AppField
								children={(field) => (
									<field.PasswordField
										autoComplete="new-password"
										label="New Password"
										placeholder="New Password"
										required
									/>
								)}
								name="newPassword"
							/>
							<form.AppField
								children={(field) => (
									<field.PasswordField
										autoComplete="new-password"
										label="Confirm Password"
										placeholder="Confirm Password"
										required
									/>
								)}
								name="confirmPassword"
							/>
							<div className="flex items-center gap-2">
								<form.AppField
									children={(field) => (
										<field.CheckboxField
											label="Sign out from other devices"
											onCheckedChange={(checked) =>
												checked
													? setSignOutDevices(true)
													: setSignOutDevices(false)
											}
										/>
									)}
									name="signOutDevices"
								/>
							</div>

							<DialogFooter>
								<form.AppForm>
									<form.SubscribeButton label="Change Password" />
								</form.AppForm>
							</DialogFooter>
						</FieldSet>
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
			</DialogContent>
		</Dialog>
	);
}
