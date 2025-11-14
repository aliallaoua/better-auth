import { formOptions } from "@tanstack/react-form-start";
import { useRouter } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import type { ErrorContext } from "better-auth/react";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAppForm } from "@/hooks/form";
import { authClient, useSession } from "@/lib/auth-client";
import { convertImageToBase64 } from "@/lib/utils/convert-image";
import type { EditUserSchema as EditUserType } from "@/schema";
import { EditUserSchema } from "@/schema";
import { FieldGroup } from "../ui/field";

export function EditUserForm() {
	const { data, isPending, error } = useSession();
	const router = useRouter();
	const [open, setOpen] = useState<boolean>(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [shouldDeleteImage, setShouldDeleteImage] = useState<boolean>(false);

	const editUserFormOpts = formOptions({
		defaultValues: {
			name: "",
			image: null,
		} satisfies EditUserType as EditUserType,
	});

	const form = useAppForm({
		...editUserFormOpts,
		validators: {
			onChange: EditUserSchema,
		},
		onSubmit: async ({ value }) => {
			let imageToUpdate: string | undefined | null;

			if (shouldDeleteImage) {
				imageToUpdate = null;
			} else if (value.image) {
				imageToUpdate = await convertImageToBase64(value.image);
			}

			await authClient.updateUser({
				image: imageToUpdate,
				name: value.name || undefined,
				fetchOptions: {
					onSuccess: () => {
						toast.success("User updated successfully");
					},
					onError: (error: ErrorContext) => {
						toast.error(error.error.message);
					},
				},
			});

			form.reset();
			setImagePreview(null);
			setShouldDeleteImage(false);
			router.invalidate();
			setOpen(false);
		},
	});

	useEffect(() => {
		if (open && data?.user) {
			// form.setFieldValue('name', data.user.name || '');
			setImagePreview(data.user.image || null);
			setShouldDeleteImage(false);
		}
	}, [open, data?.user]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			form.setFieldValue("image", file);
			setShouldDeleteImage(false);

			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDeleteImage = () => {
		setShouldDeleteImage(true);
		setImagePreview(null);
		form.setFieldValue("image", null);

		const fileInput = document.getElementById("image") as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}
	};

	const handleClearNewImage = () => {
		form.setFieldValue("image", null);
		setImagePreview(data?.user.image || null);
		setShouldDeleteImage(false);

		const fileInput = document.getElementById("image") as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}
	};

	const hasExistingImage = !!data?.user.image;
	const hasNewImage = !!form.getFieldValue("image");
	const showDeleteButton =
		hasExistingImage && !shouldDeleteImage && !hasNewImage;
	const showClearButton = hasNewImage;

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
					<FieldGroup>
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
										{imagePreview && !shouldDeleteImage && (
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
													onChange={handleImageChange}
												/>
												{showDeleteButton && (
													<X
														className="cursor-pointer"
														onClick={handleDeleteImage}
													/>
												)}

												{showClearButton && (
													<X
														className="cursor-pointer"
														onClick={handleClearNewImage}
													/>
												)} */}
											<field.ImageField
												className="w-full text-muted-foreground"
												id="image"
												onChange={handleImageChange}
												showButton={showDeleteButton || showClearButton}
												handleAction={() => {
													if (showDeleteButton) {
														handleDeleteImage();
													} else if (showClearButton) {
														handleClearNewImage();
													}
												}}
											/>
										</div>
									</div>
									{/* Action Buttons */}
									<div className="flex gap-2">
										{shouldDeleteImage && (
											<div className="text-muted-foreground text-sm">
												Photo will be removed when you save
											</div>
										)}
									</div>
								</div>
							)}
							name="image"
						/>
					</FieldGroup>

					<DialogFooter className="mt-4">
						<form.AppForm>
							<form.SubscribeButton label="Update" />
						</form.AppForm>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
