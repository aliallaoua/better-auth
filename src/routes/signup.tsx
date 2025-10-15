import { createFileRoute } from "@tanstack/react-router";

import { SignUpForm } from "@/components/form/sign-up-form";

export const fallback = "/dashboard" as const;
export const Route = createFileRoute("/signup")({
	// validateSearch: z.object({
	// 	redirect: z.string().optional().catch(''),
	// 	// addAccount: z.boolean().default(false),
	// }),
	// beforeLoad: async ({ context, search }) => {
	// 	// if (context.userSession && !search.addAccount) {
	// 	if (context.userSession) {
	// 		throw redirect({ to: search.redirect || fallback });
	// 	}
	// },
	component: SignupPage,
});

function SignupPage() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 p-14 md:p-20">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<SignUpForm />
			</div>
		</div>
	);
}
