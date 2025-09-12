import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { authClient } from '@/lib/auth-client';
import type { SignInSchema, SignUpSchema } from '@/schema';
import { auth } from './auth';

export const signIn = async (data: SignInSchema) => {
	const { error, data: response } = await authClient.signIn.email({
		email: data.email,
		password: data.password,
	});

	if (error) {
		throw new Error(error.message);
	}

	return response;
};

export const signUp = async (data: SignUpSchema) => {
	const { error } = await authClient.signUp.email({
		email: data.email,
		password: data.password,
		name: data.name,
	});

	if (error) {
		throw new Error(error.message);
	}

	return data;
};

export const signInWithGithub = async () => {
	await authClient.signIn.social({
		provider: 'github',
		callbackURL: '/dashboard',
	});
};
export const signInWithGoogle = async () => {
	await authClient.signIn.social({
		provider: 'google',
		callbackURL: '/dashboard',
	});
};

export const getUserSession = createServerFn({ method: 'GET' }).handler(
	async () => {
		const request = getWebRequest();

		if (!request.headers) {
			return null;
		}

		const userSession = await auth.api.getSession({ headers: request.headers });

		return userSession;
	}
);
