import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

export type PostType = {
	id: string;
	title: string;
	body: string;
};

export class PostNotFoundError extends Error {}

export const fetchPost = createServerFn({ method: 'GET' })
	.inputValidator(
		z.object({
			postId: z.string(),
		})
	)
	.handler(async ({ data }) => {
		console.info(`Fetching post with id ${data.postId}...`);
		await new Promise((r) => setTimeout(r, 500));

		const response = await fetch(
			`https://jsonplaceholder.typicode.com/posts/${data.postId}`
		);

		if (!response.ok) {
			throw new PostNotFoundError(`Post: ${data.postId} not found`);
		}

		return response.json();
	});

export const fetchPosts = createServerFn({ method: 'GET' }).handler(
	async () => {
		console.info('Fetching posts...');
		await new Promise((r) => setTimeout(r, 500));

		const response = await fetch('https://jsonplaceholder.typicode.com/posts');

		if (!response.ok) {
			throw new Error('Posts not found');
		}

		return response.json();
	}
);
