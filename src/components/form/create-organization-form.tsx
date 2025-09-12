import { formOptions } from '@tanstack/react-form';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useAppForm } from '@/hooks/form';
import { organization } from '@/lib/auth-client';
import { CreateOrganizationSchema } from '@/schema';
// import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';

export function CreateOrganizationForm() {
	const [open, setOpen] = useState(false);
	const signInFormOpts = formOptions({
		defaultValues: {
			name: '',
			slug: '',
			isSlugEdited: false, // Track if user manually edited slug
		},
	});

	const form = useAppForm({
		...signInFormOpts,
		validators: {
			onChange: CreateOrganizationSchema,
		},
		onSubmit: async ({ value }) => {
			await organization.create(
				{
					name: value.name,
					slug: value.slug,
				},
				{
					onSuccess: () => {
						toast.success('Organization created successfully');
						setOpen(false);
						form.reset();
					},
					onError: (error: any) => {
						toast.error(error.error.message);
					},
				}
			);
		},
	});

	// Helper function to generate slug from name
	const generateSlug = (name: string) => {
		return name.trim().toLowerCase().replace(/\s+/g, '-');
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button
					className="w-full cursor-pointer gap-2"
					size="sm"
					variant="default"
				>
					<PlusIcon />
					<p>New Organization</p>
				</Button>
			</DialogTrigger>
			<DialogContent className="w-11/12 sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>New Organization</DialogTitle>
					<DialogDescription>
						Create a new organization to collaborate with your team.
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
					<div className="grid gap-6">
						<div className="flex flex-col gap-6">
							<div className="grid gap-3">
								<form.AppField
									children={(field) => (
										<field.TextField
											label="Organization Name"
											onChange={(e) => {
												const newName = e.target.value;
												field.handleChange(newName);

												// Auto-generate slug only if user hasn't manually edited it
												const isSlugEdited = form.getFieldValue('isSlugEdited');
												if (!isSlugEdited) {
													const generatedSlug = generateSlug(newName);
													form.setFieldValue('slug', generatedSlug);
												}
											}}
											placeholder="Name"
											required
										/>
									)}
									name="name"
								/>
							</div>
							<div className="grid gap-3">
								<form.AppField
									children={(field) => (
										<field.TextField
											label="Organization Slug"
											onChange={(e) => {
												field.handleChange(e.target.value);
												// Mark slug as manually edited
												form.setFieldValue('isSlugEdited', true);
											}}
											placeholder="Slug"
											required
										/>
									)}
									name="slug"
								/>
							</div>

							{/* Hidden field to track if slug was manually edited */}
							<form.AppField
								children={(field) => <field.TextField label="" type="hidden" />}
								name="isSlugEdited"
							/>

							<DialogFooter>
								<form.AppForm>
									<form.SubscribeButton label="Create" />
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
