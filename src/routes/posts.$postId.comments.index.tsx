import { useSuspenseQuery } from "@tanstack/react-query";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { createFileRoute, ErrorComponent, Link } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { CommentType } from "@/utils/comments";
import { commentsQueryOptions } from "@/utils/commentsQueryOptions";

export const Route = createFileRoute("/posts/$postId/comments/")({
	loader: ({ params: { postId }, context }) => {
		return context.queryClient.ensureQueryData(commentsQueryOptions(postId));
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
			<h2 className="font-bold text-2xl">Comments for Post {postId}</h2>
			{comments?.map((comment: CommentType) => (
				<Link
					className="p-0.5"
					key={comment.id}
					params={{
						postId,
						commentId: comment.id,
					}}
					to="/posts/$postId/comments/$commentId"
					viewTransition={{ types: ["warp"] }}
				>
					<Card className="transition-all hover:shadow-lg hover:shadow-primary/25">
						<CardHeader>
							<CardTitle>{comment.name}</CardTitle>
							<CardDescription>{comment.email}</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground text-sm">{comment.body}</p>
						</CardContent>
					</Card>
				</Link>
			))}
		</div>
	);
}
