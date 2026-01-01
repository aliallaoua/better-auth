import { useQuery } from "@tanstack/react-query";
import type { UserWithRole } from "better-auth/plugins/admin";
import { userKeys } from "@/data/user/keys";
import { authClient } from "@/lib/auth-client";

const fetchListUsers = async (): Promise<UserWithRole[]> => {
	const data = await authClient.admin.listUsers(
		{
			query: {
				limit: 50,
				sortBy: "createdAt",
				sortDirection: "desc",
			},
		},
		{
			throw: true,
		}
	);
	return data?.users || [];
};

const useListUsersQuery = () =>
	useQuery({
		// queryKey: ["users"],
		queryKey: userKeys.all(),
		queryFn: () => fetchListUsers(),
	});

export default useListUsersQuery;
