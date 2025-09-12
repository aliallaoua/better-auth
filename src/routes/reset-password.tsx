import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';
import { ResetPasswordForm } from '@/components/form/reset-password-form';

const searchSchema = z.object({
	token: z.string(),
});
export const Route = createFileRoute('/reset-password')({
	validateSearch: searchSchema,
	component: ResetPasswordPage,
});

function ResetPasswordPage() {
	return (
		<div className="container flex h-screen items-center justify-center py-4">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<ResetPasswordForm />
			</div>
		</div>
	);
}
