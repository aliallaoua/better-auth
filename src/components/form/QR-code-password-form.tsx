import { formOptions } from '@tanstack/react-form';
import { QrCode } from 'lucide-react';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { useAppForm } from '@/hooks/form';
import { authClient } from '@/lib/auth-client';
import { TwoFactorPasswordSchema } from '@/schema';
// import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import CopyButton from '../ui/copy-button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { FieldGroup, FieldSet } from '../ui/field';

export function QRCodePasswordForm({
	twoFactorVerifyURI,
	setTwoFactorVerifyURI,
}: {
	twoFactorVerifyURI: string;
	setTwoFactorVerifyURI: (uri: string) => void;
}) {
	const [loading, setLoading] = useState(false);

	const passwordFormOpts = formOptions({
		defaultValues: {
			password: '',
		},
	});

	const form = useAppForm({
		...passwordFormOpts,
		validators: {
			onChange: TwoFactorPasswordSchema,
		},
		onSubmit: async ({ value }) => {
			setLoading(true);
			try {
				await authClient.twoFactor.getTotpUri(
					{ password: value.password },
					{
						onSuccess(context: any) {
							setTwoFactorVerifyURI(context.data.totpURI);
							form.reset();
						},
						onError(context: any) {
							toast.error(context.error.message);
						},
					}
				);
			} finally {
				setLoading(false);
			}
		},
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="cursor-pointer gap-2" variant="outline">
					<QrCode size={16} />
					<span className="text-xs md:text-sm">Scan QR Code</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="w-11/12 sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Scan QR Code</DialogTitle>
					<DialogDescription>
						Scan the QR code with your TOTP app
					</DialogDescription>
				</DialogHeader>
				{twoFactorVerifyURI ? (
					<>
						<div className="flex items-center justify-center">
							<QRCode value={twoFactorVerifyURI} />
						</div>
						<div className="flex items-center justify-center gap-2">
							<p className="text-muted-foreground text-sm">
								Copy URI to clipboard
							</p>
							<CopyButton textToCopy={twoFactorVerifyURI} />
						</div>
					</>
				) : (
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
											label=""
											placeholder="Enter Password"
											required
										/>
									)}
									name="password"
								/>
								<form.AppForm>
									<form.SubscribeButton
										className="cursor-pointer"
										disabled={loading || !form.state.canSubmit}
										label="Show QR Code"
									/>
								</form.AppForm>
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
				)}
			</DialogContent>
		</Dialog>
	);
}
