import { formOptions } from "@tanstack/react-form-start";
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
import { ChangeEmailSchema } from "@/schema";
// import { Alert, AlertDescription } from '../ui/alert';
import { Button } from "../ui/button";

export function ChangeEmailForm() {
	const [open, setOpen] = useState<boolean>(false);
	const changeEmailFormOpts = formOptions({
		defaultValues: {
			newEmail: "",
		},
	});

	const form = useAppForm({
		...changeEmailFormOpts,
		validators: {
			onChange: ChangeEmailSchema,
		},
		onSubmit: async ({ value }) => {
			const res = await authClient.changeEmail({
				newEmail: value.newEmail,
			});
			if (res.error) {
				toast.error(
					res.error.message ||
						"Couldn't send your approval email! Make sure it's correct"
				);
			} else {
				setOpen(false);
				toast.success("Email approval sent successfully");
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
					<span className="text-muted-foreground text-sm">Change Email</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="w-11/12 sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Change Email</DialogTitle>
					<DialogDescription>Change your email</DialogDescription>
				</DialogHeader>
				<form
					className="flex flex-col gap-4"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div className="grid gap-6">
						<div className="flex flex-col gap-6">
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
								name="newEmail"
							/>

							<DialogFooter>
								<form.AppForm>
									<form.SubscribeButton label="Request change" />
								</form.AppForm>
							</DialogFooter>
						</div>
					</div>

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
