import { formOptions } from '@tanstack/react-form';
import { createFileRoute, Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { sendTestEmail } from '@/functions/send';
import { useAppForm } from '@/hooks/form';
import { useSession } from '@/lib/auth-client';

export const Route = createFileRoute('/better-auth')({
	component: BetterAuthPage,
});

function BetterAuthPage() {
	const { data: session } = useSession();

	const emailFormOpts = formOptions({
		defaultValues: {
			email: '',
			emailtype: '',
			emailmethod: '',
		},
	});

	const form = useAppForm({
		...emailFormOpts,
		validators: {
			onChange: z.object({
				email: z.email(),
				emailtype: z.enum(['html', 'react']),
				emailmethod: z.enum(['fn', 'route']),
			}),
		},
		onSubmit: async ({ value }) => {
			const url = 'http://localhost:3000';
			try {
				value.emailmethod === 'fn'
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
						});
				toast.success('Email sent successfully. Please check your email.');
			} catch (e: any) {
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
		await fetch('/api/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				email,
				url,
				emailType,
			}),
		})
			.then((response) => response.json())
			.then((data) => console.log('Success:', data))
			.catch((error) => console.error('Error:', error));
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
		<div className="flex min-h-screen items-center justify-center">
			<div className="w-full max-w-2xl rounded-xl dark:border-8 dark:border-black/10 dark:bg-black/50 p-8 shadow-xl backdrop-blur-md">
				<form
					className="space-y-6"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
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
									{ label: 'HTML', value: 'html' },
									{ label: 'React', value: 'react' },
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
									{ label: 'Server Function', value: 'fn' },
									{ label: 'Server Route', value: 'route' },
								]}
							/>
						)}
					</form.AppField>

					<div className="flex justify-end">
						<form.AppForm>
							<form.SubscribeButton className="cursor-pointer" label="Send" />
						</form.AppForm>
					</div>
				</form>
				<div className="flex w-full max-w-md items-center gap-4">
					<Separator className="flex-1" />
					<span className="text-sm text-muted-foreground whitespace-nowrap">
						Or use Better Auth
					</span>
					<Separator className="flex-1" />
				</div>

				{session?.user ? (
					<Button size="sm">
						<Link to="/dashboard">
							<span>Dashboard</span>
						</Link>
					</Button>
				) : (
					<Button size="sm">
						<Link to="/signin">
							<span>Sign In</span>
						</Link>
					</Button>
				)}
			</div>
		</div>
	);
}
