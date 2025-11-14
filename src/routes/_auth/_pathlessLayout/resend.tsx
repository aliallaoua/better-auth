import { formOptions } from "@tanstack/react-form-start";
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

export const Route = createFileRoute("/_auth/_pathlessLayout/resend")({
	component: BetterAuthPage,
});

function BetterAuthPage() {
	// const { data: session } = useSession();

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
				email: z.email(),
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
				// Set form-level error
				form.setErrorMap({
					onSubmit: e.message,
				});
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
		await fetch("/api/send", {
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
		})
			.then((response) => response.json())
			.then((data) => console.log("Success:", data))
			.catch((error) => console.error("Error:", error));
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
		<div className="flex min-h-screen w-full items-center justify-center">
			<div className="w-full max-w-2xl rounded-xl p-8 shadow-xl backdrop-blur-md dark:border-8 dark:border-black/10 dark:bg-black/50">
				<form
					className="space-y-6"
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
							<FieldGroup>
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

						<div className="flex justify-end">
							<form.AppForm>
								<form.SubscribeButton className="cursor-pointer" label="Send" />
							</form.AppForm>
						</div>
					</FieldGroup>
				</form>
				{/* <div className="flex w-full items-center gap-4">
					<Separator className="flex-1" />
					<span className="text-sm text-muted-foreground whitespace-nowrap">
						Or use Better Auth
					</span>
					<Separator className="flex-1" />
				</div>

				<div className="flex flex-col items-center gap-1 pt-4">
					{session?.user ? (
						<Button size="sm">
							<Link to="/dashboard">
								<span>Dashboard</span>
							</Link>
						</Button>
					) : (
						<Button size="sm">
							<Link to="/login">
								<span>Log In</span>
							</Link>
						</Button>
					)}
				</div> */}
			</div>
		</div>
	);
}
