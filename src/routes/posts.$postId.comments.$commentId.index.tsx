import { useSuspenseQuery } from "@tanstack/react-query";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { createFileRoute, ErrorComponent, Link } from "@tanstack/react-router";
import { MoveLeft } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { commentQueryOptions } from "@/utils/commentQueryOptions";

export const Route = createFileRoute("/posts/$postId/comments/$commentId/")({
	loader: ({ params: { postId, commentId }, context }) => {
		return context.queryClient.ensureQueryData(
			commentQueryOptions(postId, commentId)
		);
	},
	errorComponent: CommentsErrorComponent,
	component: CommentsComponent,
});

function CommentsErrorComponent({ error }: ErrorComponentProps) {
	return <ErrorComponent error={error} />;
}

function CommentsComponent() {
	const { postId, commentId } = Route.useParams();
	const commentQuery = useSuspenseQuery(commentQueryOptions(postId, commentId));

	return (
		<div className="space-y-2 p-2">
			<Link
				className="block py-1 text-blue-800 hover:text-blue-600"
				to="/posts"
				viewTransition={{ types: ["warp"] }}
			>
				{/* ← All Posts */}
				<div className="flex items-center gap-2">
					<MoveLeft className="size-5" />
					<span>All Posts</span>
				</div>
			</Link>
			<Card className="max-h-min transition-all hover:shadow-lg hover:shadow-primary/25">
				<CardHeader>
					<CardTitle>{commentQuery.data.name}</CardTitle>
					<CardDescription>{commentQuery.data.email}</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm">
						{commentQuery.data.body}
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
