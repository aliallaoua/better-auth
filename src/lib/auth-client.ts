import { passkeyClient } from "@better-auth/passkey/client";
import {
	adminClient,
	deviceAuthorizationClient,
	genericOAuthClient,
	lastLoginMethodClient,
	multiSessionClient,
	oidcClient,
	oneTapClient,
	organizationClient,
	twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";
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
		oidcClient(),
		genericOAuthClient(),

		deviceAuthorizationClient(),
		lastLoginMethodClient(),
	],
	fetchOptions: {
		onError(e) {
			if (e.error.status === 429) {
				toast.error("Too many requests. Please try again later.");
			}
		},
	},
	/** The base URL of the server (optional if you're using the same domain) */
	baseURL: "http://localhost:3000",
});

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
