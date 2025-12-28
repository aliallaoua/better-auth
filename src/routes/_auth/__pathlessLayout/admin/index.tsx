import { createFileRoute, redirect } from "@tanstack/react-router";
import { Download, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { useAppForm } from "@/hooks/form";
import { useUserManagement } from "@/hooks/mutations/useUserManagement";
import useListUsersQuery from "@/hooks/queries/useListUsersQuery";
import { useSession } from "@/lib/auth-client";
import {
	DataTable,
	DataTableSkeleton,
} from "@/routes/_auth/__pathlessLayout/admin/-components/data-table";
import { StatCard } from "@/routes/_auth/__pathlessLayout/admin/-components/stats-card";
import { UserManagementCard } from "@/routes/_auth/__pathlessLayout/admin/-components/user-management-card";
import { BanUserSchema, CreateUserSchema } from "@/schema";

export const Route = createFileRoute("/_auth/__pathlessLayout/admin/")({
	beforeLoad: async ({ context, location }) => {
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
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState("");

	const { data: session } = useSession();
	const { data: users = [], isPending } = useListUsersQuery();

	const {
		createUser,
		deleteUser,
		revokeSessions,
		impersonateUser,
		banUser,
		unbanUser,
		changeRole,
		isCreating,
		isBanning,
		isRoleChanging,
		changingRoleUserId,
	} = useUserManagement();

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
			createUser(value, {
				onSuccess: () => {
					createUserForm.reset();
					setIsCreateDialogOpen(false);
				},
			});
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
			if (!value.expirationDate) {
				toast.error("Expiration date is required");
				return;
			}

			banUser(
				{
					userId: selectedUserId,
					banReason: value.reason,
					banExpiresIn: value.expirationDate.getTime() - Date.now(),
				},
				{
					onSuccess: () => {
						setIsBanDialogOpen(false);
						banUserForm.reset();
					},
				}
			);
		},
	});

	const handleBanClick = (userId: string) => {
		setSelectedUserId(userId);
		banUserForm.reset();
		setIsBanDialogOpen(true);
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

	return (
		<div className="min-h-screen w-full bg-linear-to-b from-background to-muted/20">
			<div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
				{/* Header Section */}
				<div className="space-y-4">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="space-y-1">
							<h1 className="font-bold text-4xl tracking-tight">
								Admin Dashboard
							</h1>
							<p className="text-muted-foreground">
								Manage users, roles, and permissions across your organization
							</p>
						</div>
						<ButtonGroup>
							<Button
								disabled={!users || users.length === 0}
								onClick={handleExportData}
								size="default"
								variant="outline"
							>
								<Download className="mr-2 size-4" />
								Export
							</Button>

							{/* Create User Dialog */}
							<Dialog
								onOpenChange={setIsCreateDialogOpen}
								open={isCreateDialogOpen}
							>
								<DialogTrigger
									render={
										<Button variant="outline">
											<Plus />
											<span className="hidden lg:inline">Create User</span>
										</Button>
									}
								/>
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
											<createUserForm.AppField
												name="email"
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
											/>
											<createUserForm.AppField
												name="password"
												children={(field) => (
													<field.PasswordField
														autoComplete="new-password"
														label="Password"
														required
													/>
												)}
											/>
											<createUserForm.AppField
												name="name"
												children={(field) => (
													<div className="grid gap-2">
														<field.TextField
															autoComplete="name"
															label="Name"
															required
														/>
													</div>
												)}
											/>
											<createUserForm.AppField name="role">
												{(field) => (
													<field.SelectField
														label="Role"
														placeholder="Select a role"
														values={[
															{ label: "Admin", value: "admin" },
															{ label: "User", value: "user" },
														]}
													/>
												)}
											</createUserForm.AppField>

											<createUserForm.AppForm>
												<createUserForm.SubscribeButton
													className="w-full"
													disabled={
														isCreating || !createUserForm.state.canSubmit
													}
													isLoading={isCreating}
													label="Create User"
												/>
											</createUserForm.AppForm>
										</FieldGroup>
									</form>
								</DialogContent>
							</Dialog>
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
							data={users}
							mutations={{
								deleteUser,
								revokeSessions,
								impersonateUser,
								unbanUser,
								changeRole,
								isRoleChanging,
								changingRoleUserId,
							}}
							selfId={session?.user.id}
							onExportData={handleExportData}
							onBanClick={handleBanClick}
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
									name="reason"
									children={(field) => (
										<div className="grid gap-2">
											<field.TextField label="Reason" required />
										</div>
									)}
								/>
								<banUserForm.AppField
									name="expirationDate"
									children={(field) => (
										<div className="grid gap-2">
											<Label htmlFor={field.name}>Expiration Date</Label>
											<field.DateField />
										</div>
									)}
								/>

								<banUserForm.AppForm>
									<banUserForm.SubscribeButton
										className="w-full"
										disabled={isBanning || !banUserForm.state.canSubmit}
										isLoading={isBanning}
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
