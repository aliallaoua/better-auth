import { z } from "zod";

export const reviewValidationSchema = z.object({
	title: z.string().min(1, "Title is required"),
	comment: z.string().min(1, "Review is required"),
	rating: z
		.number()
		.min(1, "Rating is required")
		.max(5, "Rating must be between 1 and 5"),
});

export const userValidationSchema = z.object({
	bio: z.string().min(1, "Please enter your bio"),
});

export const UserMetaSchema = z.object({
	username: z.string().min(3).max(20),
});

export type UserMeta = z.infer<typeof UserMetaSchema>;

// TODO: Refine password === confirm
export const SignUpSchema = z
	.object({
		name: UserMetaSchema.shape.username,
		email: z.email(),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
		image: z
			.file()
			.max(5 * 1024 * 1024, "Image must be less than 5MB")
			.mime(
				["image/jpeg", "image/png", "image/webp", "image/gif"],
				"Image must be JPEG, PNG, WebP, or GIF format"
			)
			.optional()
			.nullable(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: "Passwords don't match",
		path: ["confirmPassword"],
	});

export type SignUpSchema = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
	email: z.email(),
	password: z.string().min(8, "Password must be at least 8 characters"),
});
export type SignInSchema = z.infer<typeof SignInSchema>;
export const ForgotPasswordSchema = z.object({
	email: z.email(),
});

export type ForgotPasswordSchema = z.infer<typeof ForgotPasswordSchema>;
export const ResetPasswordSchema = z
	.object({
		password: z.string().min(8),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: "Passwords don't match",
		path: ["confirmPassword"],
	});

export type ResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;

export const ChangePasswordSchema = z
	.object({
		currentPassword: z.string(),
		newPassword: z.string().min(8),
		confirmPassword: z.string(),
		signOutDevices: z.boolean(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		error: "Passwords don't match",
		path: ["confirmPassword"],
	});

export type ChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;

export const CreateOrganizationSchema = z.object({
	name: z.string(),
	slug: z.string(),
	logo: z.url().optional(),
	isSlugEdited: z.boolean(),
});

export type CreateOrganizationSchema = z.infer<typeof CreateOrganizationSchema>;

export const EditUserSchema = z.object({
	name: z.string(),
	image: z
		.file()
		.max(5 * 1024 * 1024, "Image must be less than 5MB")
		.mime(
			["image/jpeg", "image/png", "image/webp", "image/gif"],
			"Image must be JPEG, PNG, WebP, or GIF format"
		)
		.optional()
		.nullable(),
});

export type EditUserSchema = z.infer<typeof EditUserSchema>;

export const AddPasskeySchema = z.object({
	passkeyName: z.string(),
});

export type AddPasskeySchema = z.infer<typeof AddPasskeySchema>;

export const CreateUserSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
	name: z.string().min(3),
	role: z.enum(["admin", "user"]),
});

export type CreateUserSchema = z.infer<typeof CreateUserSchema>;

export const BanUserSchema = z.object({
	reason: z.string().min(1, "Reason is required"),
	expirationDate: z.date({
		error: (issue) =>
			issue.input === undefined
				? "Expiration date is required"
				: "Invalid date",
	}),
});

export type BanUserSchema = z.infer<typeof BanUserSchema>;

export const InviteMemberSchema = z.object({
	email: z.email(),
	role: z.enum(["admin", "member"]),
});

export type InviteMemberSchema = z.infer<typeof InviteMemberSchema>;

export const TwoFactorPasswordSchema = z.object({
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export const TwoFactorOTPSchema = z.object({
	code: z.string().min(6, "OTP must be at least 6 characters"),
});

export const ChangeEmailSchema = z.object({
	newEmail: z.email(),
});

export const DeleteAccountSchema = z.object({
	password: z.string().min(8),
});
