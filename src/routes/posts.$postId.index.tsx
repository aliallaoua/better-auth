import { useSuspenseQuery } from "@tanstack/react-query";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { createFileRoute, ErrorComponent, Link } from "@tanstack/react-router";
import { NotFound } from "@/components/NotFound";
import { postQueryOptions } from "@/utils/postQueryOptions";

export const Route = createFileRoute("/posts/$postId/")({
	loader: async ({ params: { postId }, context }) => {
		const data = await context.queryClient.ensureQueryData(
			postQueryOptions(postId)
		);

		return {
			title: data.title,
		};
	},
	head: ({ loaderData }) => ({
		meta: loaderData ? [{ title: loaderData.title }] : undefined,
	}),
	errorComponent: PostErrorComponent,
	notFoundComponent: () => {
		return <NotFound>Post not found</NotFound>;
	},
	component: PostComponent,
});

function PostErrorComponent({ error }: ErrorComponentProps) {
	return <ErrorComponent error={error} />;
}

function PostComponent() {
	const { postId } = Route.useParams();
	const postQuery = useSuspenseQuery(postQueryOptions(postId));

	return (
		<div className="space-y-2">
			<h4 className="font-bold text-xl underline">{postQuery.data.title}</h4>
			<div className="text-sm">{postQuery.data.body}</div>
			<Link
				activeProps={{ className: "text-black font-bold" }}
				className="inline-block py-1 text-blue-800 hover:text-blue-600"
				params={{
					postId: postQuery.data.id,
				}}
				to={"/posts/$postId/comments"}
				viewTransition={{ types: ["warp"] }}
			>
				Show comments for post: {postId}
			</Link>
		</div>
	);
}
