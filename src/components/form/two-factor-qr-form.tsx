import { formOptions } from "@tanstack/react-form";
import type { ErrorContext, SuccessContext } from "better-auth/react";
import { QrCode } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { useAppForm } from "@/hooks/form";
import { authClient } from "@/lib/auth-client";
import { PasswordSchema } from "@/schema";

// import { Alert, AlertDescription } from '../ui/alert';
import { Button } from "../ui/button";
import CopyButton from "../ui/copy-button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { FieldGroup } from "../ui/field";

export function TwoFactorQrForm() {
	const [totpURI, setTotpURI] = useState<string>("");

	const passwordFormOpts = formOptions({
		defaultValues: {
			password: "",
		},
	});

	const form = useAppForm({
		...passwordFormOpts,
		validators: {
			onChange: PasswordSchema,
		},
		onSubmit: async ({ value }) => {
			await authClient.twoFactor.getTotpUri(
				{ password: value.password },
				{
					onSuccess(context: SuccessContext<any>) {
						setTotpURI(context.data.totpURI);
						form.reset();
					},
					onError(context: ErrorContext) {
						toast.error(context.error.message);
					},
				}
			);
		},
	});

	if (totpURI) {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-center">
					<QRCode value={totpURI} />
				</div>
				<div className="flex items-center justify-center gap-2">
					<p className="text-muted-foreground text-sm">Copy URI to clipboard</p>
					<CopyButton textToCopy={totpURI} />
				</div>
			</div>
		);
	}

	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button className="cursor-pointer gap-2" variant="outline">
						<QrCode size={16} />
						<span className="text-xs md:text-sm">Scan QR Code</span>
					</Button>
				}
			/>
			<DialogContent className="w-11/12 sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Scan QR Code</DialogTitle>
					<DialogDescription>
						Scan the QR code with your TOTP app
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
					<FieldGroup>
						<form.AppField
							children={(field) => (
								<field.PasswordField
									label=""
									placeholder="Enter your password"
									required
								/>
							)}
							name="password"
						/>
						<form.AppForm>
							<form.SubscribeButton label="Show QR Code" />
						</form.AppForm>
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
