import { createFileRoute } from "@tanstack/react-router";

import { SignInForm } from "@/components/form/sign-in-form";

export const fallback = "/dashboard" as const;

export const Route = createFileRoute("/signin")({
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
	component: SignInPage,
});

function SignInPage() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 p-14 md:p-20">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<SignInForm />
			</div>
		</div>
	);
}
