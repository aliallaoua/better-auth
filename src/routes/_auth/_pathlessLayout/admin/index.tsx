import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Download, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { useAppForm } from "@/hooks/form";
import useListUsersQuery from "@/hooks/queries/useListUsersQuery";
import { authClient } from "@/lib/auth-client";
import {
	createColumns,
	type UserActionHandlers,
} from "@/routes/_auth/_pathlessLayout/admin/-components/columns";
import {
	DataTable,
	DataTableSkeleton,
} from "@/routes/_auth/_pathlessLayout/admin/-components/data-table";
import { StatCard } from "@/routes/_auth/_pathlessLayout/admin/-components/stats-card";
import { UserManagementCard } from "@/routes/_auth/_pathlessLayout/admin/-components/user-management-card";
import { BanUserSchema, CreateUserSchema } from "@/schema";

export const Route = createFileRoute("/_auth/_pathlessLayout/admin/")({
	beforeLoad: ({ context, location }) => {
		if (context.userSession?.user.role !== "admin") {
			throw redirect({
				to: "/unauthorized",
				search: {
					redirect: location.href,
					reason: "insufficient_permissions",
				},
			});
		}
	},
	component: AdminDashboard,
});

function AdminDashboard() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState<string | undefined>();
	const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState<string>("");

	const { data: users = [], isPending } = useListUsersQuery();

	// Statistics derived from users data
	const userStats = useMemo(() => {
		if (!users) return { total: 0, admins: 0, banned: 0, active: 0 };

		return {
			total: users.length,
			admins: users.filter((u) => u.role === "admin").length,
			banned: users.filter((u) => u.banned).length,
			active: users.filter((u) => !u.banned).length,
		};
	}, [users]);

	const createUserForm = useAppForm({
		defaultValues: {
			email: "",
			password: "",
			name: "",
			role: "user" as "admin" | "user",
		},
		validators: {
			onChange: CreateUserSchema,
		},
		onSubmit: async ({ value }) => {
			setIsLoading("create");
			try {
				await authClient.admin.createUser({
					email: value.email,
					password: value.password,
					name: value.name,
					role: value.role,
				});
				toast.success("User created successfully");
				createUserForm.reset();
				setIsDialogOpen(false);
				queryClient.invalidateQueries({
					queryKey: ["users"],
				});
			} catch (error) {
				toast.error(error.message || "Failed to create user");
			} finally {
				setIsLoading(undefined);
			}
		},
	});

	const banUserForm = useAppForm({
		defaultValues: {
			reason: "",
			expirationDate: undefined as Date | undefined,
		},
		validators: {
			onChange: BanUserSchema,
		},
		onSubmit: async ({ value }) => {
			setIsLoading(`ban-${selectedUserId}`);
			try {
				if (!value.expirationDate) {
					throw new Error("Expiration date is required");
				}
				await authClient.admin.banUser({
					userId: selectedUserId,
					banReason: value.reason,
					banExpiresIn: value.expirationDate.getTime() - Date.now(),
				});
				toast.success("User banned successfully");
				setIsBanDialogOpen(false);
				queryClient.invalidateQueries({
					queryKey: ["users"],
				});
			} catch (error) {
				toast.error(error.message || "Failed to ban user");
			} finally {
				setIsLoading(undefined);
			}
		},
	});

	const handleDeleteUser = async (id: string) => {
		setIsLoading(`delete-${id}`);

		try {
			await authClient.admin.removeUser({ userId: id });
			toast.success("User deleted successfully");
			queryClient.invalidateQueries({
				queryKey: ["users"],
			});
		} catch (error) {
			toast.error(error.message || "Failed to delete user");
		} finally {
			setIsLoading(undefined);
		}
	};

	const handleRevokeSessions = async (id: string) => {
		setIsLoading(`revoke-${id}`);
		try {
			await authClient.admin.revokeUserSessions({ userId: id });
			toast.success("Sessions revoked for user");
		} catch (errors) {
			toast.error(error.message || "Failed to revoke sessions");
		} finally {
			setIsLoading(undefined);
		}
	};

	const handleImpersonateUser = async (id: string) => {
		setIsLoading(`impersonate-${id}`);
		try {
			await authClient.admin.impersonateUser({ userId: id });
			toast.success("Impersonated user");
			router.navigate({ to: "/dashboard" });
		} catch (error) {
			toast.error(error.message || "Failed to impersonate user");
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
						toast.error(context.error.message || "Failed to unban user");
						setIsLoading(undefined);
					},
					onSuccess() {
						queryClient.invalidateQueries({
							queryKey: ["users"],
						});
						toast.success("User unbanned successfully");
						setIsLoading(undefined);
					},
				}
			);
		} catch (error) {
			toast.error(error.message || "Failed to unban user");
			setIsLoading(undefined);
		}
	};

	const handleRoleChange = async (id: string, role: "admin" | "user") => {
		setIsLoading(`role-${id}`);
		try {
			const { data, error } = await authClient.admin.setRole({
				userId: id,
				role,
			});

			if (error) {
				throw new Error(error.message || "Failed to update user role");
			}

			toast.success("User role updated successfully");
			queryClient.invalidateQueries({
				queryKey: ["users"],
			});
		} catch (error) {
			toast.error(error.message || "Failed to update user role");
		} finally {
			setIsLoading(undefined);
		}
	};

	const handleExportData = () => {
		if (!users || users.length === 0) {
			toast.error("No data to export");
			return;
		}

		const csvContent = [
			["ID", "Email", "Name", "Role", "Status", "Created"].join(","),
			...users.map((user) =>
				[
					user.id,
					user.email,
					user.name || "",
					user.role || "user",
					user.banned ? "Banned" : "Active",
					user.createdAt ? new Date(user.createdAt).toISOString() : "",
				].join(",")
			),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
		toast.success("User data exported successfully");
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
		<div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/20">
			<Toaster position="top-right" richColors />

			<div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
				{/* Header Section */}
				<div className="space-y-4">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="space-y-1">
							<h1 className="text-4xl font-bold tracking-tight">
								Admin Dashboard
							</h1>
							<p className="text-muted-foreground">
								Manage users, roles, and permissions across your organization
							</p>
						</div>
						<ButtonGroup>
							<ButtonGroup className="hidden sm:flex">
								<Button
									disabled={!users || users.length === 0}
									onClick={handleExportData}
									size="default"
									variant="outline"
								>
									<Download className="mr-2 size-4" />
									Export
								</Button>
							</ButtonGroup>
							<ButtonGroup>
								<Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
									<DialogTrigger asChild>
										<Button variant="outline">
											<Plus />
											<span className="hidden lg:inline">Create User</span>
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
											<FieldGroup>
												<FieldSet>
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
													<createUserForm.AppField
														children={(field) => (
															<field.PasswordField
																autoComplete="new-password"
																label="Password"
																required
															/>
														)}
														name="password"
													/>
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
													<createUserForm.AppField name="role">
														{(field) => (
															<>
																<field.SelectField
																	label="Role"
																	placeholder="Select a role"
																	values={[
																		{ label: "Admin", value: "admin" },
																		{ label: "User", value: "user" },
																	]}
																/>
															</>
														)}
													</createUserForm.AppField>

													<createUserForm.AppForm>
														<createUserForm.SubscribeButton
															className="w-full"
															disabled={
																isLoading === "create" ||
																!createUserForm.state.canSubmit
															}
															label="Create User"
														/>
													</createUserForm.AppForm>
												</FieldSet>
											</FieldGroup>
										</form>
									</DialogContent>
								</Dialog>
							</ButtonGroup>
						</ButtonGroup>
					</div>
				</div>

				{/* Stats Cards */}
				<StatCard userStats={userStats} />

				{/* Data Table */}
				<UserManagementCard>
					{isPending ? (
						<DataTableSkeleton />
					) : (
						<DataTable
							columns={columns}
							data={users}
							onExportData={handleExportData}
						/>
					)}
				</UserManagementCard>

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
							<FieldGroup>
								<banUserForm.AppField
									children={(field) => (
										<div className="grid gap-2">
											<field.TextField label="Reason" required />
										</div>
									)}
									name="reason"
								/>
								<banUserForm.AppField
									children={(field) => (
										<div className="grid gap-2">
											<Label htmlFor={field.name}>Expiration Date</Label>
											<field.DateField />
										</div>
									)}
									name="expirationDate"
								/>

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
							</FieldGroup>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
