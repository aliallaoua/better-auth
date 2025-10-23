import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
	admin,
	bearer,
	customSession,
	deviceAuthorization,
	lastLoginMethod,
	multiSession,
	oAuthProxy,
	oneTap,
	openAPI,
	organization,
	twoFactor,
} from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { reactStartCookies } from "better-auth/react-start";
import { eq } from "drizzle-orm";
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

export const auth = betterAuth({
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			await sendVerificationEmail({
				data: {
					name: user.name,
					email: user.email,
					url,
					// emailType: 'react',
				},
			});
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 3600,
	},
	account: {
		accountLinking: {
			// enabled: true,
			trustedProviders: ["google", "github", "email-password"],
		},
	},
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
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
		customSession(async (session) => {
			return {
				...session,
				user: {
					...session.user,
					dd: "test",
				},
			};
		}),
		deviceAuthorization({
			expiresIn: "3min",
			interval: "5s",
		}),
		lastLoginMethod(),
		reactStartCookies(),
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
	// trustedOrigins: ['exp://'],
	// advanced: {
	// 	crossSubDomainCookies: {
	// 		enabled: process.env.NODE_ENV === 'production',
	// 		domain: cookieDomain,
	// 	},
	// },

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
