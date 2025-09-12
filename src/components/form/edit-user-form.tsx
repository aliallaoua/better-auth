import { formOptions } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { Edit, X } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAppForm } from '@/hooks/form';
import { authClient, useSession } from '@/lib/auth-client';
import { EditUserSchema } from '@/schema';

// import { Alert, AlertDescription } from '../ui/alert';

async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

export function EditUserForm() {
	const { data, isPending, error } = useSession();
	const router = useRouter();
	const [open, setOpen] = useState<boolean>(false);
	const [isLoading, startTransition] = useTransition();
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const editUserFormOpts = formOptions({
		defaultValues: {
			name: '',
			image: null,
		},
	});

	const form = useAppForm({
		...editUserFormOpts,
		validators: {
			onChange: EditUserSchema,
		},
		onSubmit: async ({ value }) => {
			startTransition(async () => {
				await authClient.updateUser({
					image: value.image
						? await convertImageToBase64(value.image)
						: undefined,
					name: value.name || undefined,
					fetchOptions: {
						onSuccess: () => {
							toast.success('User updated successfully');
						},
						onError: (error: any) => {
							toast.error(error.error.message);
						},
					},
				});

				// Reset form and close dialog
				form.reset();
				setImagePreview(null);
				router.invalidate();
				setOpen(false);
			});
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
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button className="cursor-pointer gap-2" size="sm" variant="secondary">
					<Edit size={13} />
					Edit User
				</Button>
			</DialogTrigger>
			<DialogContent className="w-11/12 sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
					<DialogDescription>Edit user information</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div className="grid gap-2">
						<form.AppField
							children={(field) => (
								<div className="grid gap-2">
									<field.TextField
										autoComplete="name"
										id="name"
										label="Full Name"
										placeholder={data?.user.name}
									/>
								</div>
							)}
							name="name"
						/>

						<form.AppField
							children={(field) => (
								<div className="grid gap-2">
									<Label htmlFor="image">Profile Image</Label>
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

					<DialogFooter className="mt-4">
						<form.AppForm>
							<form.SubscribeButton label="Update" />
						</form.AppForm>
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
