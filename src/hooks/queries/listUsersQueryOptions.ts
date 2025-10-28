import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import { userMiddleware } from "@/lib/auth-middleware";

const fetchlistUsers = createServerFn({ method: "GET" })
	.middleware([userMiddleware])
	.handler(async () => {
		const users = await auth.api.listUsers({
			query: {
				limit: 50,
				sortBy: "createdAt",
				sortDirection: "desc",
			},
			headers: getRequestHeaders(),
		});

		return users?.users;
	});

const listUsersQueryOptions = () =>
	queryOptions({
		queryKey: ["users"],
		queryFn: () => fetchlistUsers(),
	});

export default listUsersQueryOptions;
