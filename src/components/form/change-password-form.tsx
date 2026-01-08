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
import { useChangePasswordMutation } from "@/data/user/change-password-mutation";
import { useAppForm } from "@/hooks/form";
import { ChangePasswordSchema } from "@/schema";
// import { Alert, AlertDescription } from '../ui/alert';
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";

export function ChangePasswordForm() {
	const [open, setOpen] = useState<boolean>(false);
	const { mutate: changePasswordMutation } = useChangePasswordMutation();
	const changePasswordFormOpts = formOptions({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
			revokeOtherSessions: false,
		},
	});

	const form = useAppForm({
		...changePasswordFormOpts,
		validators: {
			onChange: ChangePasswordSchema,
		},
		onSubmit: async ({ value }) => {
			changePasswordMutation(
				{
					currentPassword: value.currentPassword,
					newPassword: value.newPassword,
					revokeOtherSessions: value.revokeOtherSessions,
				},
				{
					onSuccess: () => {
						form.reset();
						toast.success("Password changed successfully");
						setOpen(false);
					},
					onError: (error) => {
						toast.error(error.message);
					},
				}
			);
		},
	});

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger
				render={
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
						<span className="text-muted-foreground text-sm">
							Change Password
						</span>
					</Button>
				}
			/>
			<DialogContent className="w-11/12 sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Change Password</DialogTitle>
					<DialogDescription>Change your password</DialogDescription>
				</DialogHeader>
				<form
					className="flex flex-col gap-4"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.AppField
							name="currentPassword"
							children={(field) => (
								<field.PasswordField
									autoComplete="current-password"
									label="Current Password"
									placeholder="Current Password"
									required
								/>
							)}
						/>
						<form.AppField
							name="newPassword"
							children={(field) => (
								<field.PasswordField
									autoComplete="new-password"
									label="New Password"
									placeholder="New Password"
									required
								/>
							)}
						/>
						<form.AppField
							name="confirmPassword"
							children={(field) => (
								<field.PasswordField
									autoComplete="new-password"
									label="Confirm Password"
									placeholder="Confirm Password"
									required
								/>
							)}
						/>
						<div className="flex items-center gap-2">
							<form.AppField
								name="revokeOtherSessions"
								children={(field) => (
									<field.CheckboxField label="Sign out from other devices" />
								)}
							/>
						</div>

						<DialogFooter>
							<form.AppForm>
								<form.SubscribeButton label="Change Password" />
							</form.AppForm>
						</DialogFooter>
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
