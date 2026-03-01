import { passkey } from "@better-auth/passkey";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
	admin,
	bearer,
	customSession,
	deviceAuthorization,
	jwt,
	lastLoginMethod,
	multiSession,
	oAuthProxy,
	oneTap,
	openAPI,
	organization,
	twoFactor,
} from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { eq } from "drizzle-orm";
import { serverEnv } from "@/config/server-env";
import { db } from "@/db/drizzle";
import { member, schema } from "@/db/schema";
import {
	sendChangeEmailVerification,
	sendDeleteAccountVerification,
	sendInvitationEmail,
	sendOTP,
	sendResetPasswordEmail,
	sendVerificationEmail,
} from "@/functions/send";
import { i18n } from "@better-auth/i18n"


const authOptions = {
	appName: "Better Auth Demo",
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			await sendVerificationEmail({
				data: {
					name: user.name,
					email: user.email,
					url,
				},
			});
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 3600,
	},
	account: {
		accountLinking: {
			trustedProviders: ["google", "github"],
		},
	},
	emailAndPassword: {
		enabled: true,
		// requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			await sendResetPasswordEmail({
				data: {
					name: user.name,
					email: user.email,
					url,
				},
			});
		},
	},
	socialProviders: {
		github: {
			clientId: serverEnv.GITHUB_CLIENT_ID,
			clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
		},
		google: {
			clientId: serverEnv.GOOGLE_CLIENT_ID,
			clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
		},
	},
	plugins: [
		organization({
			async sendInvitationEmail(data: any) {
				await sendInvitationEmail({
					data: {
						username: data.email,
						id: data.id,
						invitedByEmail: data.inviter.user.email,
						invitedByUsername: data.inviter.user.name,
						teamName: data.organization.name,
					},
				});
			},
		}),
		twoFactor({
			otpOptions: {
				async sendOTP({ user, otp }) {
					await sendOTP({
						data: {
							email: user.email,
							otp,
						},
					});
				},
			},
		}),
		passkey(),
		openAPI(),
		bearer(),
		admin({
			adminUserIds: ["acUVCvzRkNMdIPn7p6DgZ6Vz3TlrTiHi"],
		}),
		multiSession(),
		oAuthProxy(),
		oneTap(),
		deviceAuthorization({
			expiresIn: "3min",
			interval: "5s",
			verificationUri: "/(auth)/device/",
		}),
		lastLoginMethod(),
		jwt({
			jwt: {
				issuer: process.env.VITE_BETTER_AUTH_URL,
			},
		}),
		i18n({
            translations: {
                // fr: {
                //     USER_NOT_FOUND: "Utilisateur non trouvé",
                //     INVALID_EMAIL_OR_PASSWORD: "Email ou mot de passe invalide",
                //     INVALID_PASSWORD: "Mot de passe invalide",
                // },
                // de: {
                //     USER_NOT_FOUND: "Benutzer nicht gefunden",
                //     INVALID_EMAIL_OR_PASSWORD: "Ungültige E-Mail oder Passwort",
                //     INVALID_PASSWORD: "Ungültiges Passwort",
                // },
            },
        }),

		tanstackStartCookies(),
	],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
	...authOptions,
	plugins: [
		...(authOptions.plugins ?? []),
		customSession(
			async ({ user, session }) => {
				return {
					user: {
						...user,
						customField: "customField",
					},
					session,
				};
			},
			authOptions,
			{ shouldMutateListDeviceSessionsEndpoint: true }
		),
	],
	user: {
		changeEmail: {
			enabled: true,
			sendChangeEmailVerification: async ({ user, newEmail, url, token }) => {
				await sendChangeEmailVerification({
					data: {
						username: user.name,
						oldEmail: user.email,
						newEmail,
						url,
						token,
					},
				});
			},
		},
		deleteUser: {
			enabled: true,
			sendDeleteAccountVerification: async ({ user, url, token }) => {
				await sendDeleteAccountVerification({
					data: {
						user: user.name,
						email: user.email,
						url,
						token,
					},
				});
			},
			// beforeDelete: async (user) => {
			// 	// Perform actions before user deletion
			// },
			// afterDelete: async (user) => {
			// 	// Perform cleanup after user deletion
			// },
		},
	},

	// To set active organization when a session is created you can use database hooks.
	databaseHooks: {
		user: {
			// create: {
			// 	before: async (user, ctx) => {
			// 		// Modify the user object before it is created
			// 		return {
			// 			data: {
			// 				...user,
			// 				firstName: user.name.split(' ')[0],
			// 				lastName: user.name.split(' ')[1],
			// 			},
			// 		};
			// 	},
			// 	after: async (user) => {
			// 		//perform additional actions, like creating a stripe customer
			// 	},
			// },
			// delete: {
			// 	before: async (user, ctx) => {
			// 		console.log(`User ${user.email} is being deleted`);
			// 		if (user.email.includes('admin')) {
			// 			return false; // Abort deletion
			// 		}
			// 		return true; // Allow deletion
			// 	},
			// 	after: async (user) => {
			// 		console.log(`User ${user.email} has been deleted`);
			// 	},
			// },
		},
		session: {
			create: {
				before: async (session) => {
					const m = await db.query.member.findFirst({
						where: eq(member.userId, session.userId ?? ""),
					});

					return {
						data: {
							...session,
							...(m?.organizationId && {
								activeOrganizationId: m?.organizationId,
							}),
						},
					};
				},
			},
		},
	},
});

export type Session = typeof auth.$Infer.Session;
export type ActiveOrganization = typeof auth.$Infer.ActiveOrganization;
export type OrganizationRole = ActiveOrganization["members"][number]["role"];
export type Invitation = typeof auth.$Infer.Invitation;
export type DeviceSession = Awaited<
	ReturnType<typeof auth.api.listDeviceSessions>
>[number];