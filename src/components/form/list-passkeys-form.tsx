import { formOptions } from '@tanstack/react-form';
import { Fingerprint, Trash } from 'lucide-react';
import { Activity, useState } from 'react';
import { toast } from 'sonner';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useAppForm } from '@/hooks/form';
import { authClient } from '@/lib/auth-client';
import type { Passkey } from '@/lib/auth-types';
import { AddPasskeySchema } from '@/schema';
// import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { FieldGroup, FieldSet } from '../ui/field';
import { Spinner } from '../ui/spinner';

export function ListPasskeysForm() {
	const { data } = authClient.useListPasskeys();
	const [isOpen, setIsOpen] = useState(false);

	const addPasskeyFormOpts = formOptions({
		defaultValues: {
			passkeyName: '',
		},
	});

	const form = useAppForm({
		...addPasskeyFormOpts,
		validators: {
			onChange: AddPasskeySchema,
		},
		onSubmit: async ({ value }) => {
			// if (!value.passkeyName) {
			// 	toast.error('Passkey name is required');
			// 	return;
			// }
			const res = await authClient.passkey.addPasskey({
				name: value.passkeyName,
			});
			if (res?.error) {
				toast.error(res?.error.message);
			} else {
				toast.success(
					'Passkey added successfully. You can now use it to login.'
				);
			}
		},
	});

	const [isDeletePasskey, setIsDeletePasskey] = useState<boolean>(false);
	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
			<DialogTrigger asChild>
				<Button className="cursor-pointer text-xs md:text-sm" variant="outline">
					<Fingerprint className="mr-2 size-4" />
					<span>Passkeys {data?.length ? `[${data?.length}]` : ''}</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="w-11/12 sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Passkeys</DialogTitle>
					<DialogDescription>List of passkeys</DialogDescription>
				</DialogHeader>
				{data?.length ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.map((passkey: Passkey) => (
								<TableRow
									className="flex items-center justify-between"
									key={passkey.id}
								>
									<TableCell>{passkey.name || 'My Passkey'}</TableCell>
									<TableCell className="text-right">
										<Button
											className="cursor-pointer"
											onClick={async () => {
												const res = await authClient.passkey.deletePasskey({
													id: passkey.id,
													fetchOptions: {
														onRequest: () => {
															setIsDeletePasskey(true);
														},
														onSuccess: () => {
															toast('Passkey deleted successfully');
															setIsDeletePasskey(false);
														},
														onError: (error: any) => {
															toast.error(error.error.message);
															setIsDeletePasskey(false);
														},
													},
												});
											}}
										>
											{isDeletePasskey ? (
												<Spinner />
											) : (
												<Trash
													className="cursor-pointer text-red-600"
													size={15}
												/>
											)}
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<p className="text-muted-foreground text-sm">No passkeys found</p>
				)}
				{/* {!data?.length && ( */}
				<Activity mode={data?.length ? 'hidden' : 'visible'}>
					<form
						className="flex flex-col gap-4"
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
					>
						<FieldGroup>
							<FieldSet>
								<form.AppField
									children={(field) => (
										<div className="grid gap-2">
											<field.TextField
												label="New Passkey"
												placeholder="My Passkey"
												required
											/>
										</div>
									)}
									name="passkeyName"
								/>

								<form.AppForm>
									<form.SubscribeButton
										className="w-full cursor-pointer"
										label={
											<>
												<Fingerprint className="mr-2 size-4" />
												Create Passkey
											</>
										}
									/>
								</form.AppForm>
							</FieldSet>
						</FieldGroup>
						{/* Display form-level errors */}
						{/* <form.Subscribe
							children={([errorMap]) =>
								errorMap.onSubmit ? (
									<Alert className="mt-4" variant="destructive">
										<AlertCircle className="size-4" />
										<AlertDescription>
											{errorMap.onSubmit.toString()}
										</AlertDescription>
									</Alert>
								) : null
							}
							selector={(state) => [state.errorMap]}
						/> */}
					</form>
				</Activity>
				{/* )} */}
				<DialogFooter>
					{/* <Button className="cursor-pointer" onClick={() => setIsOpen(false)}>
						Close
					</Button> */}
					<DialogClose asChild>
						<Button className="cursor-pointer">Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
