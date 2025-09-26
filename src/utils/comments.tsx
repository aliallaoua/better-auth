import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

export type CommentType = {
	id: string;
	name: string;
	email: string;
	body: string;
};

export class CommentNotFoundError extends Error {}

export const fetchComments = createServerFn({ method: 'GET' })
	.inputValidator(
		z.object({
			postId: z.string(),
		})
	)
	.handler(async ({ data }) => {
		console.info(`Fetching comments for post ${data.postId}...`);
		await new Promise((r) => setTimeout(r, 500));

		const response = await fetch(
			`https://jsonplaceholder.typicode.com/comments?postId=${data.postId}`
		);

		if (!response.ok) {
			throw new Error(`Comments for post ${data.postId} not found`);
		}

		return response.json();
	});

export const fetchComment = createServerFn({ method: 'GET' })
	.inputValidator(
		z.object({
			postId: z.string(),
			commentId: z.string(),
		})
	)
	.handler(async ({ data }) => {
		console.info(
			`Fetching comment ${data.commentId} for post ${data.postId}...`
		);
		await new Promise((r) => setTimeout(r, 500));

		const response = await fetch(
			`https://jsonplaceholder.typicode.com/comments/${data.commentId}`
		);

		if (!response.ok) {
			throw new CommentNotFoundError(`Comment ${data.commentId} not found`);
		}

		const comment = await response.json();

		// Verify the comment belongs to the specified post
		if (comment.postId.toString() !== data.postId) {
			throw new CommentNotFoundError(
				`Comment ${data.commentId} does not belong to post ${data.postId}`
			);
		}

		return comment;
	});
