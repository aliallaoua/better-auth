import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { User } from "better-auth/types";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface BanUserParams {
	userId: string;
	reason: string;
	expiresIn: number;
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

	// Delete user mutation - extract mutate directly
	const { mutate: deleteUser } = useMutation({
		mutationFn: (userId: string) => authClient.admin.removeUser({ userId }),
		onMutate: async (userId, context) => {
			await context.client.cancelQueries({ queryKey: ["users"] });

			const previousUsers = context.client.getQueryData<User[]>(["users"]);

			context.client.setQueryData<User[]>(["users"], (old) =>
				old ? old.filter((u) => u.id !== userId) : []
			);

			return { previousUsers };
		},
		onSuccess: () => toast.success("User deleted"),

		onError: (error, _variables, onMutateResult, context) => {
			if (onMutateResult?.previousUsers) {
				context.client.setQueryData<User[]>(
					["users"],
					onMutateResult.previousUsers
				);
			}
			toast.error(error.message || "Failed to delete user");
		},
		onSettled: (_data, _error, _variables, _onMutateResult, context) =>
			context.client.invalidateQueries({ queryKey: ["users"] }),
	});

	// Ban user mutation - extract mutate directly
	const { mutate: banUser, isPending: isBanUserPending } = useMutation({
		mutationFn: ({ userId, reason, expiresIn }: BanUserParams) =>
			authClient.admin.banUser({
				userId,
				banReason: reason,
				banExpiresIn: expiresIn,
			}),
		onMutate: async ({ userId }, context) => {
			await context.client.cancelQueries({ queryKey: ["users"] });

			const previousUsers = context.client.getQueryData<User[]>(["users"]);

			context.client.setQueryData<User[]>(["users"], (old) => {
				return old
					? old.map((u) => (u.id === userId ? { ...u, banned: true } : u))
					: [];
			});

			return { previousUsers };
		},
		onSuccess: () => toast.success("User banned"),

		onError: (error, variables, onMutateResult, context) => {
			if (onMutateResult?.previousUsers) {
				context.client.setQueryData<User[]>(
					["users"],
					onMutateResult.previousUsers
				);
			}
			toast.error(error.message || `Failed to ban user ${variables.userId}`);
		},
		onSettled: (_data, _error, _variables, _onMutateResult, context) =>
			context.client.invalidateQueries({ queryKey: ["users"] }),
	});

	// Unban user mutation - extract mutate directly
	const { mutate: unbanUser } = useMutation({
		mutationFn: (userId: string) => authClient.admin.unbanUser({ userId }),
		onMutate: async (userId, context) => {
			await context.client.cancelQueries({ queryKey: ["users"] });

			const previousUsers = context.client.getQueryData<User[]>(["users"]);

			context.client.setQueryData<User[]>(["users"], (old) => {
				return old
					? old.map((u) => (u.id === userId ? { ...u, banned: false } : u))
					: [];
			});

			return { previousUsers };
		},
		onSuccess: () => toast.success("User unbanned"),

		onError: (error, variables, onMutateResult, context) => {
			if (onMutateResult?.previousUsers) {
				context.client.setQueryData<User[]>(
					["users"],
					onMutateResult.previousUsers
				);
			}
			toast.error(error.message || `Failed to unban user ${variables}`);
		},
		onSettled: (_data, _error, _variables, _onMutateResult, context) =>
			context.client.invalidateQueries({ queryKey: ["users"] }),
	});

	// Change role mutation with optimistic updates - extract mutate directly
	const { mutate: changeRole, isPending: isChangeRolePending } = useMutation({
		mutationFn: ({ userId, role }: RoleChangeParams) =>
			authClient.admin.setRole({ userId, role }),
		onMutate: async ({ userId, role }, context) => {
			setChangingRoleUserId(userId);

			await context.client.cancelQueries({ queryKey: ["users"] });

			const previousUsers = context.client.getQueryData<User[]>(["users"]);

			context.client.setQueryData<User[]>(["users"], (old) => {
				return old
					? old.map((u) => (u.id === userId ? { ...u, role } : u))
					: [];
			});

			return { previousUsers };
		},
		onSuccess: () => toast.success("Role updated for user"),
		onError: (error, _variables, onMutateResult, context) => {
			if (onMutateResult?.previousUsers) {
				context.client.setQueryData<User[]>(
					["users"],
					onMutateResult.previousUsers
				);
			}
			toast.error(error.message || "Failed to update role");
		},
		onSettled: (_data, _error, _variables, _onMutateResult, context) =>
			context.client.invalidateQueries({ queryKey: ["users"] }),
	});

	// Revoke sessions mutation - extract mutate directly
	const { mutate: revokeSessions } = useMutation({
		mutationFn: (userId: string) =>
			authClient.admin.revokeUserSessions({ userId }),
		onSuccess: () => {
			toast.success("Sessions revoked");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to revoke sessions");
		},
	});

	// Impersonate user mutation - extract mutate directly
	const { mutate: impersonateUser } = useMutation({
		mutationFn: (userId: string) =>
			authClient.admin.impersonateUser({ userId }),
		onSuccess: (data) => {
			toast.success(`Now impersonating user ${data.data?.user.email}`);
			router.navigate({ to: "/dashboard" });
		},
		onError: (error, userId) => {
			toast.error(error.message || `Failed to impersonate user ${userId}`);
		},
	});

	// Create user mutation - extract mutate directly
	const { mutate: createUser, isPending: isCreateUserPending } = useMutation({
		mutationFn: (params: CreateUserParams) =>
			authClient.admin.createUser(params),
		onSuccess: () => {
			toast.success("User created successfully");
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create user");
		},
	});

	return {
		deleteUser,
		revokeSessions,
		impersonateUser,
		banUser,
		unbanUser,
		changeRole,
		createUser,
		isCreateUserPending,
		isBanUserPanding: isBanUserPending,
		isChangeRolePending,
		changingRoleUserId,
	};
}
