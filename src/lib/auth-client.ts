import { passkeyClient } from "@better-auth/passkey/client";
import {
	adminClient,
	customSessionClient,
	deviceAuthorizationClient,
	jwtClient,
	lastLoginMethodClient,
	multiSessionClient,
	oneTapClient,
	organizationClient,
	twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";
import type { auth } from "./auth";

export const authClient = createAuthClient({
	plugins: [
		organizationClient(),
		twoFactorClient({
			onTwoFactorRedirect() {
				window.location.href = "/two-factor";
			},
		}),
		passkeyClient(),
		adminClient(),
		multiSessionClient(),
		oneTapClient({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			promptOptions: {
				maxAttempts: 1,
			},
		}),
		customSessionClient<typeof auth>(),
		deviceAuthorizationClient(),
		lastLoginMethodClient(),
		jwtClient(),
	],
	fetchOptions: {
		onError(e) {
			if (e.error.status === 429) {
				toast.error("Too many requests. Please try again later.");
			}
		},
	},
});

export const USER_ROLES = {
	ADMIN: "admin",
	USER: "user",
} as const;

export const {
	signUp,
	signIn,
	signOut,
	useSession,
	organization,
	useListOrganizations,
	useActiveOrganization,
	useActiveMember,
	useActiveMemberRole,
} = authClient;
