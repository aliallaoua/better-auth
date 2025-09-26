import { queryOptions } from '@tanstack/react-query';
import { fetchPosts } from '@/utils/posts';

export const postsQueryOptions = queryOptions({
	queryKey: ['posts'],
	queryFn: () => fetchPosts(),
});
