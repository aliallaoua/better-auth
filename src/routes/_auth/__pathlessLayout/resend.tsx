import { formOptions } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import {
	FieldDescription,
	FieldGroup,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { sendTestEmail } from "@/functions/send";
import { useAppForm } from "@/hooks/form";

export const Route = createFileRoute("/_auth/__pathlessLayout/resend")({
	component: ResendComponent,
});

function ResendComponent() {
	const emailFormOpts = formOptions({
		defaultValues: {
			email: "",
			emailtype: "",
			emailmethod: "",
		},
	});

	const form = useAppForm({
		...emailFormOpts,
		validators: {
			onChange: z.object({
				email: z.email("Please enter a valid email address"),
				emailtype: z.enum(["html", "react"]),
				emailmethod: z.enum(["serverFn", "serverRoute"]),
			}),
		},
		onSubmit: async ({ value }) => {
			const url = "http://localhost:3000";
			try {
				await (value.emailmethod === "serverFn"
					? handleSendEmailUsingServerFunction({
							email: value.email,
							name: value.email,
							url,
							emailType: value.emailtype,
						})
					: handleSendEmailUsingServerRoute({
							email: value.email,
							name: value.email,
							url,
							emailType: value.emailtype,
						}));
				toast.success("Email sent successfully. Please check your email.");
				form.reset();
			} catch (e) {
				const errorMessage =
					e instanceof Error
						? e.message
						: "Failed to send email. Please try again.";
				form.setErrorMap({
					onSubmit: errorMessage,
				});
				toast.error(errorMessage);
			}
		},
	});

	const handleSendEmailUsingServerRoute = async ({
		name,
		email,
		url,
		emailType,
	}: {
		name: string;
		email: string;
		url: string;
		emailType: string;
	}) => {
		const response = await fetch("/api/send", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				email,
				url,
				emailType,
			}),
		});

		if (!response.ok) {
			throw new Error("Failed to send email via server route");
		}

		const data = await response.json();
		console.log("Success:", data);
		return data;
	};

	const handleSendEmailUsingServerFunction = async ({
		name,
		email,
		url,
		emailType,
	}: {
		name: string;
		email: string;
		url: string;
		emailType: string;
	}) => {
		await sendTestEmail({
			data: {
				name,
				email,
				url,
				emailType,
			},
		});
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center p-4">
			<div className="w-full max-w-2xl rounded-xl p-8 shadow-xl backdrop-blur-md dark:border-8 dark:border-black/10 dark:bg-black/50">
				<form
					className="space-y-8"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<FieldSet>
							<FieldLegend>Send email</FieldLegend>
							<FieldDescription>
								Send email with Resend using TanStack Server Functions or Server
								Routes
							</FieldDescription>
							<FieldGroup className="space-y-4 pt-4">
								<form.AppField
									children={(field) => (
										<field.TextField
											autoComplete="email"
											label="Email"
											placeholder="name@example.com"
											required
											type="email"
										/>
									)}
									name="email"
								/>

								<form.AppField name="emailtype">
									{(field) => (
										<field.SelectField
											label="Email type"
											placeholder="Select a type"
											values={[
												{ label: "HTML", value: "html" },
												{ label: "React", value: "react" },
											]}
										/>
									)}
								</form.AppField>

								<form.AppField name="emailmethod">
									{(field) => (
										<field.SelectField
											label="Email method"
											placeholder="Select a method"
											values={[
												{ label: "Server Function", value: "serverFn" },
												{ label: "Server Route", value: "serverRoute" },
											]}
										/>
									)}
								</form.AppField>
							</FieldGroup>
						</FieldSet>

						{form.state.errorMap.onSubmit && (
							<div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-destructive text-sm">
								{form.state.errorMap.onSubmit}
							</div>
						)}

						<div className="flex justify-end pt-2">
							<form.AppForm>
								<form.SubscribeButton
									className="min-w-32 cursor-pointer font-semibold transition-all hover:scale-105"
									label="Send Email"
								/>
							</form.AppForm>
						</div>
					</FieldGroup>
				</form>
			</div>
		</div>
	);
}
