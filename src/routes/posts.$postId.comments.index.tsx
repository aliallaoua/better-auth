import { useSuspenseQuery } from '@tanstack/react-query';
import {
	createFileRoute,
	ErrorComponent,
	type ErrorComponentProps,
	Link,
} from '@tanstack/react-router';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import type { CommentType } from '@/utils/comments';
import { commentsQueryOptions } from '@/utils/commentsQueryOptions';

export const Route = createFileRoute('/posts/$postId/comments/')({
	loader: ({ context: { queryClient }, params: { postId } }) => {
		return queryClient.ensureQueryData(commentsQueryOptions(postId));
	},
	errorComponent: CommentsErrorComponent,
	component: CommentsComponent,
});

function CommentsErrorComponent({ error }: ErrorComponentProps) {
	return <ErrorComponent error={error} />;
}

function CommentsComponent() {
	const { postId } = Route.useParams();
	const { data: comments } = useSuspenseQuery(commentsQueryOptions(postId));

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold">Comments for Post {postId}</h2>
			{comments?.map((comment: CommentType) => (
				<Link
					className="p-0.5"
					key={comment.id}
					params={{
						postId,
						commentId: comment.id,
					}}
					to="/posts/$postId/comments/$commentId"
				>
					<Card className="hover:shadow-primary/25 transition-all hover:shadow-lg">
						<CardHeader>
							<CardTitle>{comment.name}</CardTitle>
							<CardDescription>{comment.email}</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">{comment.body}</p>
						</CardContent>
					</Card>
				</Link>
			))}
		</div>
	);
}
