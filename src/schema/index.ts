import { z } from "zod";

export const UserMetaSchema = z.object({
	username: z.string().min(3).max(20),
});

export type UserMeta = z.infer<typeof UserMetaSchema>;

export const SignUpSchema = z
	.object({
		name: UserMetaSchema.shape.username,
		email: z.email("Please enter a valid email address.").max(255),
		password: z
			.string()
			.min(8, { error: "Password must be at least 8 characters" })
			.max(100, { error: "Password must be at most 100 characters" }),
		confirmPassword: z
			.string()
			.min(1, { error: "Please confirm your password." }),
		image: z
			.file()
			.max(5 * 1024 * 1024, { error: "Image must be less than 5MB" })
			.mime(["image/jpeg", "image/png", "image/webp", "image/gif"], {
				error: "Image must be JPEG, PNG, WebP, or GIF format",
			})
			.nullable(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type SignUpSchema = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
	email: z.email("Please enter a valid email address.").max(255),
	password: z
		.string()
		.min(8, { error: "Password must be at least 8 characters" })
		.max(100, { error: "Password must be at most 100 characters" }),
	rememberMe: z.boolean(),
});
export type SignInSchema = z.infer<typeof SignInSchema>;

export const ForgotPasswordSchema = z.object({
	email: z.email("Please enter a valid email address.").max(255),
});
export type ForgotPasswordSchema = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, { error: "Password must be at least 8 characters" })
			.max(100, { error: "Password must be at most 100 characters" }),
		confirmPassword: z
			.string()
			.min(1, { error: "Please confirm your password." }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: "Passwords do not match",
		path: ["confirmPassword"],
	});
export type ResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;

export const ChangePasswordSchema = z
	.object({
		currentPassword: z
			.string()
			.min(1, { error: "Current password is required" }),
		newPassword: z
			.string()
			.min(8, { error: "Password must be at least 8 characters" })
			.max(128, { error: "Password must be at most 128 characters" }),
		confirmPassword: z
			.string()
			.min(1, { error: "Please confirm your password" }),
		revokeOtherSessions: z.boolean(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		error: "Passwords do not match",
		path: ["confirmPassword"],
	});
export type ChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;

export const CreateOrganizationSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must be at most 50 characters"),
	slug: z
		.string()
		.min(2, "Slug must be at least 2 characters")
		.max(50, "Slug must be at most 50 characters")
		.regex(
			/^[a-z0-9-]+$/,
			"Slug can only contain lowercase letters, numbers, and hyphens"
		),
	logo: z.url().optional(),
	isSlugEdited: z.boolean(),
});
export type CreateOrganizationSchema = z.infer<typeof CreateOrganizationSchema>;

export const EditUserSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must be at most 50 characters")
		.optional()
		.or(z.literal("")),
	image: z
		.file()
		.max(5 * 1024 * 1024, { error: "Image must be less than 5MB" })
		.mime(["image/jpeg", "image/png", "image/webp", "image/gif"], {
			error: "Image must be JPEG, PNG, WebP, or GIF format",
		})
		.nullable(),
});
export type EditUserSchema = z.infer<typeof EditUserSchema>;

export const AddPasskeySchema = z.object({
	passkeyName: z.string().min(1, { error: "Passkey name is required" }),
});
export type AddPasskeySchema = z.infer<typeof AddPasskeySchema>;

export const CreateUserSchema = z.object({
	email: z.email().max(255),
	password: z
		.string()
		.min(8, { error: "Password must be at least 8 characters" })
		.max(100, { error: "Password must be at most 100 characters" }),
	name: z.string().min(3, { error: "Name must be at least 3 characters" }),
	role: z.enum(["admin", "user"]),
});
export type CreateUserSchema = z.infer<typeof CreateUserSchema>;

export const BanUserSchema = z.object({
	reason: z.string().min(1, { error: "Reason is required" }),
	expirationDate: z.date({
		error: (issue) =>
			issue.input === undefined
				? "Expiration date is required"
				: "Invalid date",
	}),
});
export type BanUserSchema = z.infer<typeof BanUserSchema>;

export const InviteMemberSchema = z.object({
	email: z.email("Please enter a valid email address"),
	role: z.enum(["admin", "member"], {
		error: "Please select a role",
	}),
});
export type InviteMemberSchema = z.infer<typeof InviteMemberSchema>;

export const PasswordSchema = z.object({
	password: z
		.string()
		.min(8, { error: "Password must be at least 8 characters" })
		.max(100, { error: "Password must be at most 100 characters" }),
});
export const TwoFactorOTPSchema = z.object({
	code: z.string().min(6, { error: "OTP must be at least 6 characters" }),
});
export const ChangeEmailSchema = z.object({
	email: z.email().max(255),
});
export const DeleteAccountSchema = z.object({
	password: z
		.string()
		.min(8, { error: "Password must be at least 8 characters" })
		.max(100, { error: "Password must be at most 100 characters" }),
});

export const DeviceSchema = z.object({
	userCode: z.string().min(1),
});
export type DeviceSchema = z.infer<typeof DeviceSchema>;
