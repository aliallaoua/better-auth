import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Badge, Ban, Download, Plus, Shield, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';
import {
	createColumns,
	type UserActionHandlers,
} from '@/components/admin/columns';
import { DataTable, DataTableSkeleton } from '@/components/admin/data-table';
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
import { useAppForm } from '@/hooks/form';
import { authClient } from '@/lib/auth-client';
import { BanUserSchema, CreateUserSchema } from '@/schema';

// const fetchlistUsers = createServerFn({ method: 'GET' })
// .middleware([userMiddleware])
// .handler(async () => {
// 	const users = await auth.api.listUsers({
// 		query: {
// 			limit: 50,
// 			sortBy: 'createdAt',
// 			sortDirection: 'desc',
// 		},
// 		headers: await getWebRequest().headers,
// 	});

// 	return users?.users;
// });

// const listUsersQueryOptions = () =>
// 	queryOptions({
// 		queryKey: ['users'],
// 		queryFn: () => fetchlistUsers(),
// 	});

export const Route = createFileRoute('/_auth/_pathlessLayout/admin')({
	// loader: async ({ context }) => {
	// 	await context.queryClient.ensureQueryData(listUsersQueryOptions());
	// },
	component: AdminDashboard,
});

function AdminDashboard() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState<string | undefined>();
	const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState<string>('');

	// const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const { data: users = [], isLoading: isUsersLoading } = useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const data = await authClient.admin.listUsers(
				{
					query: {
						limit: 50, // Increased for better pagination
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

	// const { data: users = [] } = useSuspenseQuery(listUsersQueryOptions());

	// Statistics derived from users data
	const userStats = useMemo(() => {
		if (!users) return { total: 0, admins: 0, banned: 0, active: 0 };

		return {
			total: users.length,
			admins: users.filter((u) => u.role === 'admin').length,
			banned: users.filter((u) => u.banned).length,
			active: users.filter((u) => !u.banned).length,
		};
	}, [users]);

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

	const handleRoleChange = async (id: string, role: 'admin' | 'user') => {
		setIsLoading(`role-${id}`);
		try {
			const { data, error } = await authClient.admin.setRole({
				userId: id,
				role,
			});

			if (error) {
				throw new Error(error.message || 'Failed to update user role');
			}

			toast.success('User role updated successfully');
			queryClient.invalidateQueries({
				queryKey: ['users'],
			});
		} catch (error: any) {
			toast.error(error.message || 'Failed to update user role');
		} finally {
			setIsLoading(undefined);
		}
	};

	const handleExportData = () => {
		if (!users || users.length === 0) {
			toast.error('No data to export');
			return;
		}

		const csvContent = [
			['ID', 'Email', 'Name', 'Role', 'Status', 'Created'].join(','),
			...users.map((user) =>
				[
					user.id,
					user.email,
					user.name || '',
					user.role || 'user',
					user.banned ? 'Banned' : 'Active',
					user.createdAt ? new Date(user.createdAt).toISOString() : '',
				].join(',')
			),
		].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
		toast.success('User data exported successfully');
	};

	// Create action handlers object
	const actionHandlers: UserActionHandlers = useMemo(
		() => ({
			onDeleteUser: handleDeleteUser,
			onRevokeSessions: handleRevokeSessions,
			onImpersonateUser: handleImpersonateUser,
			onBanClick: handleBanClick,
			onUnbanUser: handleUnbanUser,
			onRoleChange: handleRoleChange,
			isLoading,
		}),
		[isLoading]
	);

	// Create columns with handlers
	const columns = useMemo(
		() => createColumns(actionHandlers),
		[actionHandlers]
	);

	return (
		<div className="container mx-auto space-y-6 p-4">
			<Toaster position="top-right" richColors />

			{/* Header with Stats */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
					<p className="text-muted-foreground">
						Manage users, roles, and permissions
					</p>
				</div>
				<div className="flex items-center space-x-2">
					<Button
						disabled={!users || users.length === 0}
						onClick={handleExportData}
						variant="outline"
					>
						<Download className="mr-2 size-4" />
						Export
					</Button>
					<Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
						<DialogTrigger asChild>
							<Button>
								<Plus className="mr-2 size-4" />
								Create User
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
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
								<div>
									<createUserForm.AppField
										children={(field) => (
											<div className="grid gap-2">
												<field.TextField
													autoComplete="new-password"
													label="Password"
													required
													type="password"
													withPasswordToggle
												/>
											</div>
										)}
										name="password"
									/>
								</div>
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
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card className="hover:shadow-stat-card/25 h-full w-full transition-all hover:shadow-lg">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Users className="size-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{userStats.total}</div>
					</CardContent>
				</Card>
				<Card className="hover:shadow-stat-card/25 h-full w-full transition-all hover:shadow-lg">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Admins</CardTitle>
						{/* <Badge className="text-xs" variant="default"> */}
						<Shield className="text-xs">Admin</Shield>
						{/* </Badge> */}
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{userStats.admins}</div>
					</CardContent>
				</Card>
				<Card className="hover:shadow-stat-card/25 h-full w-full transition-all hover:shadow-lg">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active</CardTitle>
						<Badge className="text-xs text-green-600 border-green-200">
							Active
						</Badge>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{userStats.active}</div>
					</CardContent>
				</Card>
				<Card className="hover:shadow-stat-card/25 h-full w-full transition-all hover:shadow-lg">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Banned</CardTitle>
						{/* <Badge className="text-xs" variant="destructive"> */}
						<Ban className="text-xs text-red-600">
							Banned
							{/* </Badge> */}
						</Ban>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{userStats.banned}</div>
					</CardContent>
				</Card>
			</div>

			{/* Data Table */}
			<Card className="hover:shadow-stat-card/25 w-full transition-all hover:shadow-lg">
				<CardHeader>
					<CardTitle>User Management</CardTitle>
				</CardHeader>
				<CardContent>
					{/* <Suspense fallback={<DataTableSkeleton />}>
						<DataTable
							columns={columns}
							data={users}
							onExportData={handleExportData}
						/>
					</Suspense> */}
					{isUsersLoading ? (
						<DataTableSkeleton />
					) : (
						<DataTable
							columns={columns}
							data={users}
							onExportData={handleExportData}
						/>
					)}
				</CardContent>
			</Card>

			{/* Ban User Dialog */}
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

						<banUserForm.AppForm>
							<banUserForm.SubscribeButton
								className="w-full"
								disabled={
									isLoading === `ban-${selectedUserId}` ||
									!banUserForm.state.canSubmit
								}
								label="Ban User"
							/>
						</banUserForm.AppForm>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
