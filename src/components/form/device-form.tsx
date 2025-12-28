import { formOptions } from "@tanstack/react-form";
import { getRouteApi, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/form";
import { authClient } from "@/lib/auth-client";
import { DeviceSchema } from "@/schema";

export function DeviceForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const routeApi = getRouteApi("/(auth)/device/");
	const { userCode } = routeApi.useSearch();

	const logInFormOpts = formOptions({
		defaultValues: {
			userCode: userCode ?? "",
		},
	});

	const form = useAppForm({
		...logInFormOpts,
		validators: {
			onChange: DeviceSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const finalCode = value.userCode
					.trim()
					.replaceAll(/-/g, "")
					.toUpperCase();
				// Get the device authorization status
				const response = await authClient.device({
					query: {
						user_code: finalCode,
					},
				});

				if (response.data) {
					router.navigate({
						to: "/device/approve",
						search: {
							userCode: finalCode,
						},
					});
				}
			} catch (error: any) {
				toast.error(
					error.message || "Invalide code. Please check and try again."
				);
			}
		},
	});

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-md p-6">
				<div className="space-y-4">
					<div className="text-center">
						<h1 className="font-bold text-2xl">Device Authorization</h1>
						<p className="mt-2 text-muted-foreground">
							Enter the code displayed on your device
						</p>
					</div>
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
									<field.TextField
										label="Device Code"
										placeholder="XXXX-XXXX"
										required
									/>
								)}
								name="userCode"
							/>

							<Field>
								<form.AppForm>
									<form.SubscribeButton label="Continue" />
								</form.AppForm>
							</Field>
						</FieldGroup>
					</form>
				</div>
			</Card>
		</div>
	);
}
