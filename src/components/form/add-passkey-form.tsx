import { formOptions } from "@tanstack/react-form";
import { Fingerprint, Plus } from "lucide-react";
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
import { AddPasskeySchema } from "@/schema";
// import { Alert, AlertDescription } from '../ui/alert';
import { Button } from "../ui/button";

export function AddPasskeyForm() {
	const [isOpen, setIsOpen] = useState(false);

	const addPasskeyFormOpts = formOptions({
		defaultValues: {
			passkeyName: "",
		},
	});

	const form = useAppForm({
		...addPasskeyFormOpts,
		validators: {
			onChange: AddPasskeySchema,
		},
		onSubmit: async ({ value }) => {
			// if (!value.passkeyName) {
			// 	toast.error('Passkey name is required');
			// 	return;
			// }
			const res = await authClient.passkey.addPasskey({
				name: value.passkeyName,
			});
			if (res?.error) {
				toast.error(res?.error.message);
			} else {
				setIsOpen(false);
				toast.success(
					"Passkey added successfully. You can now use it to login."
				);
			}
		},
	});

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
			<DialogTrigger
				render={
					<Button
						className="cursor-pointer gap-2 text-xs md:text-sm"
						variant="outline"
					>
						<Plus size={15} />
						Add New Passkey
					</Button>
				}
			/>
			<DialogContent className="w-11/12 sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add New Passkey</DialogTitle>
					<DialogDescription>
						Create a new passkey to securely access your account without a
						password.
					</DialogDescription>
				</DialogHeader>
				<form
					className="flex flex-col gap-4"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<form.AppField
						children={(field) => (
							<field.TextField label="Passkey Name" required />
						)}
						name="passkeyName"
					/>
					<DialogFooter>
						<DialogFooter className="mt-4">
							<form.AppForm>
								<form.SubscribeButton
									label={
										<>
											<Fingerprint className="mr-2 size-4" />
											Create Passkey
										</>
									}
								/>
							</form.AppForm>
						</DialogFooter>
					</DialogFooter>
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
