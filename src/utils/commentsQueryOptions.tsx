import { queryOptions } from "@tanstack/react-query";
import { fetchComments } from "./comments";

export const commentsQueryOptions = (postId: string) =>
	queryOptions({
		queryKey: ["comments", postId],
		queryFn: () => fetchComments({ data: { postId } }),
	});
