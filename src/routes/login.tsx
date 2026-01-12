import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import z from "zod";
import { LogInForm } from "@/components/form/login-form";
import { authClient } from "@/lib/auth-client";

const SignInSchema = z.object({
	redirect: z.string().optional().catch("/"),
	callbackUrl: z.string().default("").catch(""),
	// addAccount: z.boolean().default(false),
});

const fallback = "/dashboard" as const;

export const Route = createFileRoute("/login")({
	validateSearch: SignInSchema,
	beforeLoad: async ({ context, search }) => {
		// if (context.userSession && !search.addAccount) {
		if (context.userSession) {
			throw redirect({ to: search.redirect || fallback });
		}
	},
	loader: async () => {},
	component: LogInComponent,
});

function LogInComponent() {
	const router = useRouter();
	const { callbackUrl } = Route.useSearch();

	useEffect(() => {
		authClient.oneTap({
			fetchOptions: {
				onError: ({ error }) => {
					toast.error(error.message || "An error occured");
				},
				onSuccess: () => {
					toast.success("Successfully signed in");
					router.navigate({
						to: callbackUrl || fallback,
					});
				},
			},
		});
	}, [router, callbackUrl]);
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-14 md:p-20">
			<div className="w-full max-w-sm">
				<LogInForm />
			</div>
		</div>
	);
}
