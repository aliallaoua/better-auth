import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Plus, RefreshCw, Trash, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppForm } from '@/hooks/form';
import { authClient } from '@/lib/auth-client';
import { BanUserSchema, CreateUserSchema } from '@/schema';

export const Route = createFileRoute('/_auth/_pathlessLayout/admin/admin copy')(
	{
		component: AdminDashboard,
	}
);

function UserTableSkeleton() {
	return (
		<div className="space-y-3">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Email</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Banned</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 5 }).map((_, i) => (
							<TableRow key={i}>
								<TableCell>
									<Skeleton className="h-4 w-[200px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-[150px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-[80px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-6 w-[60px]" />
								</TableCell>
								<TableCell>
									<div className="flex space-x-2">
										<Skeleton className="size-8" />
										<Skeleton className="size-8" />
										<Skeleton className="h-8 w-[100px]" />
										<Skeleton className="h-8 w-[60px]" />
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

function AdminDashboard() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState<string | undefined>();
	const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState<string>('');

	const { data: users, isLoading: isUsersLoading } = useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const data = await authClient.admin.listUsers(
				{
					query: {
						limit: 10,
						sortBy: 'createdAt',
						sortDirection: 'desc',
					},
				},
				{
					throw: true,
				}
			);
			return data?.users || [];
		},
	});

	const createUserForm = useAppForm({
		defaultValues: {
			email: '',
			password: '',
			name: '',
			role: 'user' as 'admin' | 'user',
		},
		validators: {
			onChange: CreateUserSchema,
		},
		onSubmit: async ({ value }) => {
			setIsLoading('create');
			try {
				await authClient.admin.createUser({
					email: value.email,
					password: value.password,
					name: value.name,
					role: value.role,
				});
				toast.success('User created successfully');
				createUserForm.reset();
				setIsDialogOpen(false);
				queryClient.invalidateQueries({
					queryKey: ['users'],
				});
			} catch (error: any) {
				toast.error(error.message || 'Failed to create user');
			} finally {
				setIsLoading(undefined);
			}
		},
	});

	const banUserForm = useAppForm({
		defaultValues: {
			reason: '',
			expirationDate: undefined as Date | undefined,
		},
		validators: {
			onChange: BanUserSchema,
		},
		onSubmit: async ({ value }) => {
			setIsLoading(`ban-${selectedUserId}`);
			try {
				if (!value.expirationDate) {
					throw new Error('Expiration date is required');
				}
				await authClient.admin.banUser({
					userId: selectedUserId,
					banReason: value.reason,
					banExpiresIn: value.expirationDate.getTime() - Date.now(),
				});
				toast.success('User banned successfully');
				setIsBanDialogOpen(false);
				queryClient.invalidateQueries({
					queryKey: ['users'],
				});
			} catch (error: any) {
				toast.error(error.message || 'Failed to ban user');
			} finally {
				setIsLoading(undefined);
			}
		},
	});

	const handleDeleteUser = async (id: string) => {
		setIsLoading(`delete-${id}`);
		try {
			await authClient.admin.removeUser({ userId: id });
			toast.success('User deleted successfully');
			queryClient.invalidateQueries({
				queryKey: ['users'],
			});
		} catch (error: any) {
			toast.error(error.message || 'Failed to delete user');
		} finally {
			setIsLoading(undefined);
		}
	};

	const handleRevokeSessions = async (id: string) => {
		setIsLoading(`revoke-${id}`);
		try {
			await authClient.admin.revokeUserSessions({ userId: id });
			toast.success('Sessions revoked for user');
		} catch (error: any) {
			toast.error(error.message || 'Failed to revoke sessions');
		} finally {
			setIsLoading(undefined);
		}
	};

	const handleImpersonateUser = async (id: string) => {
		setIsLoading(`impersonate-${id}`);
		try {
			await authClient.admin.impersonateUser({ userId: id });
			toast.success('Impersonated user');
			router.navigate({ to: '/dashboard' });
		} catch (error: any) {
			toast.error(error.message || 'Failed to impersonate user');
		} finally {
			setIsLoading(undefined);
		}
	};

	const handleBanClick = (userId: string) => {
		setSelectedUserId(userId);
		banUserForm.reset();
		setIsBanDialogOpen(true);
	};

	const handleUnbanUser = async (userId: string) => {
		setIsLoading(`ban-${userId}`);
		try {
			await authClient.admin.unbanUser(
				{
					userId,
				},
				{
					onError(context) {
						toast.error(context.error.message || 'Failed to unban user');
						setIsLoading(undefined);
					},
					onSuccess() {
						queryClient.invalidateQueries({
							queryKey: ['users'],
						});
						toast.success('User unbanned successfully');
						setIsLoading(undefined);
					},
				}
			);
		} catch (error: any) {
			toast.error(error.message || 'Failed to unban user');
			setIsLoading(undefined);
		}
	};

	return (
		<div className="container mx-auto space-y-8 p-4">
			<Toaster richColors />
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-2xl">Admin Dashboard</CardTitle>
					<Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
						<DialogTrigger asChild>
							<Button className="cursor-pointer">
								<Plus className="mr-2 size-4" /> Create User
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Create New User</DialogTitle>
							</DialogHeader>
							<form
								className="space-y-4"
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									createUserForm.handleSubmit();
								}}
							>
								<div>
									<createUserForm.AppField
										children={(field) => (
											<div className="grid gap-2">
												<field.TextField
													autoComplete="email"
													label="Email"
													required
													type="email"
												/>
											</div>
										)}
										name="email"
									/>
								</div>
								<createUserForm.AppField
									children={(field) => (
										<field.PasswordField
											autoComplete="current-password"
											forgotPassword
											label="Password"
											placeholder="Password"
											required
										/>
									)}
									name="password"
								/>
								<div>
									<createUserForm.AppField
										children={(field) => (
											<div className="grid gap-2">
												<field.TextField
													autoComplete="name"
													label="Name"
													required
												/>
											</div>
										)}
										name="name"
									/>
								</div>
								<div>
									<createUserForm.AppField name="role">
										{(field) => (
											<field.SelectField
												label="Role"
												placeholder="Select a role"
												values={[
													{ label: 'Admin', value: 'admin' },
													{ label: 'User', value: 'user' },
												]}
											/>
										)}
									</createUserForm.AppField>
								</div>

								<createUserForm.AppForm>
									<createUserForm.SubscribeButton
										className="w-full"
										disabled={
											isLoading === 'create' || !createUserForm.state.canSubmit
										}
										label="Create User"
									/>
								</createUserForm.AppForm>
							</form>
						</DialogContent>
					</Dialog>
					<Dialog onOpenChange={setIsBanDialogOpen} open={isBanDialogOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Ban User</DialogTitle>
							</DialogHeader>
							<form
								className="space-y-4"
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									banUserForm.handleSubmit();
								}}
							>
								<div>
									<banUserForm.AppField
										children={(field) => (
											<div className="grid gap-2">
												<field.TextField label="Reason" required />
											</div>
										)}
										name="reason"
									/>
								</div>
								<div className="flex flex-col space-y-1.5">
									<banUserForm.AppField
										children={(field) => (
											<div className="grid gap-2">
												<Label htmlFor={field.name}>Expiration Date</Label>
												<field.DateField />
											</div>
										)}
										name="expirationDate"
									/>
								</div>

								<createUserForm.AppForm>
									<createUserForm.SubscribeButton
										className="w-full"
										disabled={
											isLoading === `ban-${selectedUserId}` ||
											!banUserForm.state.canSubmit
										}
										label="Ban User"
									/>
								</createUserForm.AppForm>
							</form>
						</DialogContent>
					</Dialog>
				</CardHeader>
				<CardContent>
					{isUsersLoading ? (
						// <div className="flex h-64 items-center justify-center">
						// 	<Spinner />
						// </div>
						<UserTableSkeleton />
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Email</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Banned</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users?.map((user) => (
									<TableRow key={user.id}>
										<TableCell>{user.email}</TableCell>
										<TableCell>{user.name}</TableCell>
										<TableCell>
											{/* {user.role || 'user'} */}
											<Select
												disabled={isLoading === `role-${user.id}`}
												onValueChange={async (value) => {
													setIsLoading(`role-${user.id}`);
													try {
														const { data, error } =
															await authClient.admin.setRole({
																userId: user.id,
																role: value as 'admin' | 'user',
															});

														if (error) {
															throw new Error(
																error.message || 'Failed to update user role'
															);
														}

														toast.success('User role updated successfully');

														// Invalidate the users query to refresh the UI
														queryClient.invalidateQueries({
															queryKey: ['users'],
														});
													} catch (error: any) {
														toast.error(
															error.message || 'Failed to update user role'
														);
													} finally {
														setIsLoading(undefined);
													}
												}}
												value={user.role}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a role" />
													{isLoading === `role-${user.id}` && <Spinner />}
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectLabel>{'Role'}</SelectLabel>
														<SelectItem value="admin">Admin</SelectItem>
														<SelectItem value="user">User</SelectItem>
													</SelectGroup>
												</SelectContent>
											</Select>
										</TableCell>
										<TableCell>
											{user.banned ? (
												<Badge variant="destructive">Yes</Badge>
											) : (
												<Badge variant="outline">No</Badge>
											)}
										</TableCell>
										<TableCell>
											<div className="flex space-x-2">
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															className="cursor-pointer"
															disabled={isLoading?.startsWith('delete')}
															onClick={() => handleDeleteUser(user.id)}
															size="sm"
															variant="destructive"
														>
															{isLoading === `delete-${user.id}` ? (
																<Spinner />
															) : (
																<Trash className="size-4" />
															)}
														</Button>
													</TooltipTrigger>
													<TooltipContent sideOffset={8}>
														<p>Delete user</p>
													</TooltipContent>
												</Tooltip>

												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															className="cursor-pointer"
															disabled={isLoading?.startsWith('revoke')}
															onClick={() => handleRevokeSessions(user.id)}
															size="sm"
															variant="outline"
														>
															{isLoading === `revoke-${user.id}` ? (
																<Spinner />
															) : (
																<RefreshCw className="size-4" />
															)}
														</Button>
													</TooltipTrigger>
													<TooltipContent sideOffset={8}>
														<p>Revoke session</p>
													</TooltipContent>
												</Tooltip>

												<Button
													className="cursor-pointer"
													disabled={isLoading?.startsWith('impersonate')}
													onClick={() => handleImpersonateUser(user.id)}
													size="sm"
													variant="secondary"
												>
													{isLoading === `impersonate-${user.id}` ? (
														<Spinner />
													) : (
														<>
															<UserCircle className="mr-2 size-4" />
															Impersonate
														</>
													)}
												</Button>
												<Button
													className="cursor-pointer"
													disabled={isLoading?.startsWith('ban')}
													onClick={() => {
														if (user.banned) {
															handleUnbanUser(user.id);
														} else {
															handleBanClick(user.id);
														}
													}}
													size="sm"
													variant="outline"
												>
													{isLoading === `ban-${user.id}` ? (
														<Spinner />
													) : user.banned ? (
														'Unban'
													) : (
														'Ban'
													)}
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
