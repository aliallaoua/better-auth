import { formOptions } from "@tanstack/react-form";
import { Trash2 } from "lucide-react";
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
import { DeleteAccountSchema } from "@/schema";
// import { Alert, AlertDescription } from '../ui/alert';
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";

export function DeleteAccountForm() {
	const [open, setOpen] = useState<boolean>(false);
	const deleteAccountFormOpts = formOptions({
		defaultValues: {
			password: "",
		},
	});

	const form = useAppForm({
		...deleteAccountFormOpts,
		validators: {
			onChange: DeleteAccountSchema,
		},
		onSubmit: async ({ value }) => {
			const res = await authClient.deleteUser({
				password: value.password,
			});
			if (res.error) {
				toast.error(
					res.error.message ||
						"Couldn't send your confirmation email! Make sure it's correct"
				);
				// form.setErrorMap({
				// 	onSubmit: res.error.message,
				// });
			} else {
				setOpen(false);
				toast.success("Email confirmation sent successfully");
				form.reset();
			}
		},
	});

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger
				render={
					<Button
						// className="cursor-pointer border-red-600 bg-transparent text-red-500 text-xs underline opacity-80 hover:bg-transparent"
						className="z-10 cursor-pointer gap-2"
						size="sm"
						variant="destructive"
					>
						<Trash2 className="size-4" />
						Delete Account
					</Button>
				}
			/>
			<DialogContent className="w-11/12 sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Delete Account</DialogTitle>
					<DialogDescription>
						Enter your password to delete your account
					</DialogDescription>
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
							name="password"
							children={(field) => (
								<field.PasswordField
									autoComplete="current-password"
									label="Password"
									placeholder="Enter your password"
									required
								/>
							)}
						/>

						<DialogFooter>
							<form.AppForm>
								<form.SubscribeButton label="Delete" variant="destructive" />
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
