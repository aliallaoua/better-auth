import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import z from 'zod';

import { SignInForm } from '@/components/form/sign-in-form';

export const fallback = '/dashboard' as const;

export const Route = createFileRoute('/signin')({
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
		<div className="container flex h-screen items-center justify-center py-4">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<SignInForm />
			</div>
		</div>
	);
}
