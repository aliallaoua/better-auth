import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import z from "zod";
import DeleteAccountConfirmation from "@/components/emails/delete-account-confirmation";
import EmailChangeApproval from "@/components/emails/email-change-approval";
import { InvitationEmail } from "@/components/emails/invitation-email";
import ResetPasswordEmail from "@/components/emails/reset-password";
import VerifyEmail from "@/components/emails/verify-email";
import WelcomeEmail from "@/components/emails/welcome.email";
// import { serverEnv } from "@/config/env";
import { serverEnv } from "@/config/server-env";

// const resend = new Resend(process.env.RESEND_API_KEY);
const resend = new Resend(serverEnv.RESEND_API_KEY);

export const sendTestEmail = createServerFn({ method: "POST" })
	.inputValidator(
		z.object({
			name: z.string(),
			email: z.email(),
			url: z.url(),
			emailType: z.string(),
		})
	)
	.handler(async ({ data: handlerData }) => {
		try {
			const { data, error } =
				handlerData.emailType === "react"
					? await resend.emails.send({
							from: "onboarding@resend.dev",
							to: [handlerData.email],
							subject: `Hello from ${handlerData.emailType} + Server Function`,
							react: WelcomeEmail({
								username: handlerData.name,
							}),
						})
					: await resend.emails.send({
							from: "onboarding@resend.dev",
							to: [handlerData.email],
							subject: `Hello from ${handlerData.emailType} + Server Function`,
							html: `<p>Welcome ${handlerData.name}, please click on this link to verify your email: ${handlerData.url}`,
						});

			if (error) {
				console.log(error);
			}

			console.log(data, handlerData.email);

			return data;
		} catch (error) {
			console.log(error);
		}
	});

export const sendVerificationEmail = createServerFn({ method: "POST" })
	.inputValidator(
		z.object({
			name: z.string(),
			email: z.email(),
			url: z.url(),
		})
	)
	.handler(async ({ data: handlerData }) => {
		try {
			const { data, error } = await resend.emails.send({
				from: "onboarding@resend.dev",
				to: [handlerData.email],
				subject: "Verify your email address",
				react: VerifyEmail({
					username: handlerData.name,
					verifyUrl: handlerData.url,
				}),
			});

			if (error) {
				console.log(error);
			}

			console.log(data, handlerData.email);

			return data;
		} catch (error) {
			console.log(error);
		}
	});

export const sendResetPasswordEmail = createServerFn({ method: "POST" })
	.inputValidator(
		z.object({
			name: z.string(),
			email: z.email(),
			url: z.url(),
		})
	)
	.handler(async ({ data: handlerData }) => {
		try {
			const { data, error } = await resend.emails.send({
				from: "onboarding@resend.dev",
				to: [handlerData.email],
				subject: "Reset your password",
				react: ResetPasswordEmail({
					username: handlerData.name,
					userEmail: handlerData.email,
					resetLink: handlerData.url,
				}),
			});

			if (error) {
				console.log(error);
			}

			console.log(data);

			return data;
		} catch (error) {
			console.log(error);
		}
	});

export const sendInvitationEmail = createServerFn({ method: "POST" })
	.inputValidator(
		z.object({
			id: z.string(),
			username: z.email(),
			invitedByUsername: z.string(),
			invitedByEmail: z.email(),
			teamName: z.string(),
		})
	)
	.handler(async ({ data: handlerData }) => {
		try {
			const { data, error } = await resend.emails.send({
				from: "onboarding@resend.dev",
				to: handlerData.username,
				subject: "You've been invited to join an organization",
				react: InvitationEmail({
					username: handlerData.username,
					invitedByUsername: handlerData.invitedByUsername,
					invitedByEmail: handlerData.invitedByEmail,
					teamName: handlerData.teamName,
					inviteLink: `http://localhost:3000/accept-invitation/${handlerData.id}`,
				}),
			});

			if (error) {
				console.log(error);
			}

			console.log(data);

			return data;
		} catch (error) {
			console.log(error);
		}
	});

export const sendOTP = createServerFn({ method: "POST" })
	.inputValidator(
		z.object({
			email: z.email(),
			otp: z.string(),
		})
	)
	.handler(async ({ data: handlerData }) => {
		try {
			const { data, error } = await resend.emails.send({
				from: "onboarding@resend.dev",
				to: handlerData.email,
				subject: "Your OTP",
				html: `Your OTP is ${handlerData.otp}`,
			});
			if (error) {
				console.log(error);
			}

			console.log(data);

			return data;
		} catch (error) {
			console.log(error);
		}
	});

export const sendChangeEmailVerification = createServerFn({ method: "POST" })
	.inputValidator(
		z.object({
			username: z.string(),
			oldEmail: z.email(),
			newEmail: z.email(),
			url: z.url(),
			token: z.string(),
		})
	)
	.handler(async ({ data: handlerData }) => {
		try {
			const { data, error } = await resend.emails.send({
				from: "onboarding@resend.dev",
				to: handlerData.newEmail,
				subject: "Approve email change",
				react: EmailChangeApproval({
					username: handlerData.username,
					oldEmail: handlerData.oldEmail,
					newEmail: handlerData.newEmail,
					url: handlerData.url,
					token: handlerData.token,
				}),
			});

			if (error) {
				console.log(error);
			}

			console.log(data);

			return data;
		} catch (error) {
			console.log(error);
		}
	});

export const sendDeleteAccountVerification = createServerFn({ method: "POST" })
	.inputValidator(
		z.object({
			user: z.string(),
			email: z.string(),
			url: z.url(),
			token: z.string(),
		})
	)
	.handler(async ({ data: handlerData }) => {
		try {
			const { data, error } = await resend.emails.send({
				from: "onboarding@resend.dev",
				to: handlerData.email,
				subject: "Approve email change",
				react: DeleteAccountConfirmation({
					username: handlerData.user,
					userEmail: handlerData.email,
					url: handlerData.url,
					token: handlerData.token,
				}),
			});

			if (error) {
				console.log(error);
			}

			console.log(data);

			return data;
		} catch (error) {
			console.log(error);
		}
	});
