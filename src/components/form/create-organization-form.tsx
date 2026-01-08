import { formOptions } from "@tanstack/react-form";
import { PlusIcon } from "lucide-react";
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
import { useOrganizationCreateMutation } from "@/data/organization/organization-create-mutation";
import { useAppForm } from "@/hooks/form";
import { CreateOrganizationSchema } from "@/schema";
// import { Alert, AlertDescription } from '../ui/alert';
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";

export function CreateOrganizationForm() {
	const { mutate: createMutation, isSuccess } = useOrganizationCreateMutation();
	const [open, setOpen] = useState(false);
	const createOrganizationFormOpts = formOptions({
		defaultValues: {
			name: "",
			slug: "",
			isSlugEdited: false, // Track if user manually edited slug
		},
	});

	const form = useAppForm({
		...createOrganizationFormOpts,
		validators: {
			onChange: CreateOrganizationSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				createMutation({
					name: value.name,
					slug: value.slug,
				});

				if (isSuccess) {
					setOpen(false);
				}
			} catch (error: any) {
				toast.error(error.message);
			}
		},
	});

	// Helper function to generate slug from name
	const generateSlug = (name: string) => {
		return name
			.trim()
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger
				render={
					<Button
						className="w-full cursor-pointer gap-2"
						size="sm"
						variant="default"
					>
						<PlusIcon />
						<p>New Organization</p>
					</Button>
				}
			/>
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
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.AppField
							name="name"
							children={(field) => (
								<field.TextField
									label="Organization Name"
									onChange={(e) => {
										const newName = e.target.value;
										field.handleChange(newName);

										// Auto-generate slug only if user hasn't manually edited it
										const isSlugEdited = form.getFieldValue("isSlugEdited");
										if (!isSlugEdited) {
											const generatedSlug = generateSlug(newName);
											form.setFieldValue("slug", generatedSlug);
										}
									}}
									placeholder="Name"
									required
								/>
							)}
						/>
						<form.AppField
							name="slug"
							children={(field) => (
								<field.TextField
									label="Organization Slug"
									onChange={(e) => {
										field.handleChange(e.target.value);
										// Mark slug as manually edited
										form.setFieldValue("isSlugEdited", true);
									}}
									placeholder="Slug"
									required
								/>
							)}
						/>

						{/* Hidden field to track if slug was manually edited */}
						{/* <form.AppField
								name="isSlugEdited"
								children={(field) => <field.TextField label="" type="hidden" />}
							/> */}

						<DialogFooter>
							<form.AppForm>
								<form.SubscribeButton label="Create" />
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
