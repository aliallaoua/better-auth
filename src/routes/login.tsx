import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";
import { LogInForm } from "@/components/form/login-form";

const fallback = "/dashboard" as const;

export const Route = createFileRoute("/login")({
	validateSearch: z.object({
		redirect: z.string().default("").catch(""),
		// addAccount: z.boolean().default(false),
	}),
	beforeLoad: async ({ context, search }) => {
		// if (context.userSession && !search.addAccount) {
		if (context.userSession) {
			throw redirect({ to: search.redirect || fallback });
		}
	},
	component: LogInPage,
});

function LogInPage() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-14 md:p-20">
			<div className="w-full max-w-sm">
				<LogInForm />
			</div>
		</div>
	);
}
