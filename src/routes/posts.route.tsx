import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import type { PostType } from "@/utils/posts";
import { postsQueryOptions } from "@/utils/postsQueryOptions";

export const Route = createFileRoute("/posts")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(postsQueryOptions),
	component: PostsLayoutComponent,
});

function PostsLayoutComponent() {
	const postsQuery = useSuspenseQuery(postsQueryOptions);

	return (
		<div className="p-2 flex gap-2 pt-20">
			<ul className="list-disc pl-4">
				{[
					...postsQuery.data,
					{ id: "i-do-not-exist", title: "Non-existent Post" },
				].map((post: PostType) => {
					return (
						<li className="whitespace-nowrap" key={post.id}>
							<Link
								activeProps={{ className: "text-black font-bold" }}
								className="block py-1 text-blue-800 hover:text-blue-600"
								params={{
									postId: post.id,
								}}
								to="/posts/$postId"
							>
								{post.title.substring(0, 20)}
							</Link>
						</li>
					);
				})}
			</ul>
			<hr />
			<Outlet />
		</div>
	);
}
