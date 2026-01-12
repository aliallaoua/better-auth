import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";
import { SignUpForm } from "@/components/form/sign-up-form";

const fallback = "/dashboard" as const;
export const Route = createFileRoute("/signup")({
	validateSearch: z.object({
		redirect: z.string().optional().catch("/"),
		// addAccount: z.boolean().default(false),
	}),
	beforeLoad: async ({ context, search }) => {
		// if (context.userSession && !search.addAccount) {
		if (context.userSession) {
			throw redirect({ to: search.redirect || fallback });
		}
	},
	component: SignupComponent,
});

function SignupComponent() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-14 md:p-20">
			<div className="w-full max-w-sm">
				<SignUpForm />
			</div>
		</div>
	);
}
