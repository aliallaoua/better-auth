import { createFileRoute } from "@tanstack/react-router";
import { ForgetPasswordForm } from "@/components/form/forget-password-form";

export const fallback = "/dashboard" as const;

export const Route = createFileRoute("/forget-password")({
	component: ForgetPasswordPage,
});

function ForgetPasswordPage() {
	return (
		<div className="container flex h-screen items-center justify-center py-4">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<ForgetPasswordForm />
			</div>
		</div>
	);
}
