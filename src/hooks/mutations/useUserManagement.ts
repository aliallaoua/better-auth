import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface BanUserParams {
	userId: string;
	banReason: string;
	banExpiresIn: number;
}

interface RoleChangeParams {
	userId: string;
	role: "admin" | "user";
}

interface CreateUserParams {
	email: string;
	password: string;
	name: string;
	role: "admin" | "user";
}

export function useUserManagement() {
	const queryClient = useQueryClient();
	const router = useRouter();

	const [changingRoleUserId, setChangingRoleUserId] = useState<string | null>(
		null
	);

	const { mutate: createUser, isPending: isCreating } = useMutation({
		mutationFn: ({ email, password, name, role }: CreateUserParams) =>
			authClient.admin.createUser({ email, password, name, role }),
		onSuccess: () => {
			toast.success("User created successfully");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create user");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	const { mutate: deleteUser } = useMutation({
		mutationFn: (userId: string) => authClient.admin.removeUser({ userId }),
		onSuccess: () => {
			toast.success("User deleted successfully");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete user");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	const { mutate: revokeSessions } = useMutation({
		mutationFn: (userId: string) =>
			authClient.admin.revokeUserSessions({ userId }),
		onSuccess: () => {
			toast.success("Sessions revoked for user");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to revoke sessions");
		},
	});

	const { mutate: impersonateUser } = useMutation({
		mutationFn: (userId: string) =>
			authClient.admin.impersonateUser({ userId }),
		onSuccess: () => {
			toast.success("Impersonated user");
			router.navigate({ to: "/dashboard" });
		},
		onError: (error) => {
			toast.error(error.message || "Failed to impersonate user ");
		},
	});

	const { mutate: banUser, isPending: isBanning } = useMutation({
		mutationFn: ({ userId, banReason, banExpiresIn }: BanUserParams) =>
			authClient.admin.banUser({
				userId,
				banReason,
				banExpiresIn,
			}),
		onSuccess: () => {
			toast.success("User banned successfully");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to ban user");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	const { mutate: unbanUser } = useMutation({
		mutationFn: (userId: string) => authClient.admin.unbanUser({ userId }),
		onSuccess: () => {
			toast.success("User unbanned successfully");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to unban user");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	const { mutate: changeRole, isPending: isRoleChanging } = useMutation({
		mutationFn: ({ userId, role }: RoleChangeParams) =>
			authClient.admin.setRole({ userId, role }),
		onMutate: ({ userId }) => {
			setChangingRoleUserId(userId);
		},
		onSuccess: () => {
			toast.success("Role updated for user");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update role");
		},
		onSettled: () => {
			setChangingRoleUserId(null);
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	return {
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
	};
}
