import { useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import type { UserWithRole } from "better-auth/plugins";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import type { SignInSchema, SignUpSchema } from "@/schema";
import { auth } from "./auth";
import { convertImageToBase64 } from "./utils/convert-image";

export const signIn = async (data: SignInSchema) => {
	const { error, data: response } = await authClient.signIn.email({
		email: data.email,
		password: data.password,
		rememberMe: data.rememberMe,
		// callbackURL: "/dashboard",
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
		image: data.image ? await convertImageToBase64(data.image) : "",
		// callbackURL: "/dashboard",
	});

	if (error) {
		throw new Error(error.message);
	}

	return data;
};

export const signInWithGithub = async () => {
	await authClient.signIn.social({
		provider: "github",
		callbackURL: "/dashboard",
	});
};

export const signInWithGoogle = async () => {
	await authClient.signIn.social({
		provider: "google",
		callbackURL: "/dashboard",
	});
};

export const signInWithPasskey = async () => {
	await authClient.signIn.passkey({
		fetchOptions: {
			onSuccess() {
				const router = useRouter();
				toast.success("Successfully signed in");
				router.navigate({
					to: "/dashboard",
				});
			},
			onError(context) {
				toast.error(`Authentication failed: ${context.error.message}`);
			},
		},
	});
};

export const getUserSession = createServerFn({
	method: "GET",
}).handler(async () => {
	const userSession = await auth.api.getSession({
		headers: getRequestHeaders(),
	});

	if (!userSession) {
		return null;
	}

	// return userSession;
	return {
		user: userSession.user as UserWithRole,
		session: userSession.session,
	};
});
