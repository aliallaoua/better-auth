import { queryOptions } from "@tanstack/react-query";
import { getUserSession } from "@/lib/auth-functions";

export const useAuthQuery = {
	all: ["auth"],
	user: () =>
		queryOptions({
			queryKey: [...useAuthQuery.all, "user"],
			queryFn: () => getUserSession(),
			// queryFn: () => getUserId(),
		}),
};
