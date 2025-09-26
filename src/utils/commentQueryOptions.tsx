import { queryOptions } from '@tanstack/react-query';
import { fetchComment } from '@/utils/comments';

export const commentQueryOptions = (postId: string, commentId: string) =>
	queryOptions({
		queryKey: ['comments', { postId, commentId }],
		queryFn: () => fetchComment({ data: { postId, commentId } }),
	});
