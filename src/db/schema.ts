import { defineRelations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	twoFactorEnabled: boolean("two_factor_enabled").default(false),
	role: text("role"),
	banned: boolean("banned").default(false),
	banReason: text("ban_reason"),
	banExpires: timestamp("ban_expires"),
});

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		activeOrganizationId: text("active_organization_id"),
		impersonatedBy: text("impersonated_by"),
	},
	(table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const organization = pgTable(
	"organization",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		slug: text("slug").notNull().unique(),
		logo: text("logo"),
		createdAt: timestamp("created_at").notNull(),
		metadata: text("metadata"),
	},
	(table) => [uniqueIndex("organization_slug_uidx").on(table.slug)]
);

export const member = pgTable(
	"member",
	{
		id: text("id").primaryKey(),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		role: text("role").default("member").notNull(),
		createdAt: timestamp("created_at").notNull(),
	},
	(table) => [
		index("member_organizationId_idx").on(table.organizationId),
		index("member_userId_idx").on(table.userId),
	]
);

export const invitation = pgTable(
	"invitation",
	{
		id: text("id").primaryKey(),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		email: text("email").notNull(),
		role: text("role"),
		status: text("status").default("pending").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		inviterId: text("inviter_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [
		index("invitation_organizationId_idx").on(table.organizationId),
		index("invitation_email_idx").on(table.email),
	]
);

export const twoFactor = pgTable(
	"two_factor",
	{
		id: text("id").primaryKey(),
		secret: text("secret").notNull(),
		backupCodes: text("backup_codes").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [
		index("twoFactor_secret_idx").on(table.secret),
		index("twoFactor_userId_idx").on(table.userId),
	]
);

export const passkey = pgTable(
	"passkey",
	{
		id: text("id").primaryKey(),
		name: text("name"),
		publicKey: text("public_key").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		credentialID: text("credential_id").notNull(),
		counter: integer("counter").notNull(),
		deviceType: text("device_type").notNull(),
		backedUp: boolean("backed_up").notNull(),
		transports: text("transports"),
		createdAt: timestamp("created_at"),
		aaguid: text("aaguid"),
	},
	(table) => [
		index("passkey_userId_idx").on(table.userId),
		index("passkey_credentialID_idx").on(table.credentialID),
	]
);

export const deviceCode = pgTable("device_code", {
	id: text("id").primaryKey(),
	deviceCode: text("device_code").notNull(),
	userCode: text("user_code").notNull(),
	userId: text("user_id"),
	expiresAt: timestamp("expires_at").notNull(),
	status: text("status").notNull(),
	lastPolledAt: timestamp("last_polled_at"),
	pollingInterval: integer("polling_interval"),
	clientId: text("client_id"),
	scope: text("scope"),
});

export const jwks = pgTable("jwks", {
	id: text("id").primaryKey(),
	publicKey: text("public_key").notNull(),
	privateKey: text("private_key").notNull(),
	createdAt: timestamp("created_at").notNull(),
	expiresAt: timestamp("expires_at"),
});

export const oauthClient = pgTable("oauth_client", {
	id: text("id").primaryKey(),
	clientId: text("client_id").notNull().unique(),
	clientSecret: text("client_secret"),
	disabled: boolean("disabled").default(false),
	skipConsent: boolean("skip_consent"),
	enableEndSession: boolean("enable_end_session"),
	scopes: text("scopes").array(),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
	name: text("name"),
	uri: text("uri"),
	icon: text("icon"),
	contacts: text("contacts").array(),
	tos: text("tos"),
	policy: text("policy"),
	softwareId: text("software_id"),
	softwareVersion: text("software_version"),
	softwareStatement: text("software_statement"),
	redirectUris: text("redirect_uris").array().notNull(),
	postLogoutRedirectUris: text("post_logout_redirect_uris").array(),
	tokenEndpointAuthMethod: text("token_endpoint_auth_method"),
	grantTypes: text("grant_types").array(),
	responseTypes: text("response_types").array(),
	public: boolean("public"),
	type: text("type"),
	referenceId: text("reference_id"),
	metadata: jsonb("metadata"),
});

export const oauthRefreshToken = pgTable("oauth_refresh_token", {
	id: text("id").primaryKey(),
	token: text("token").notNull(),
	clientId: text("client_id")
		.notNull()
		.references(() => oauthClient.clientId, { onDelete: "cascade" }),
	sessionId: text("session_id").references(() => session.id, {
		onDelete: "set null",
	}),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	referenceId: text("reference_id"),
	expiresAt: timestamp("expires_at"),
	createdAt: timestamp("created_at"),
	revoked: timestamp("revoked"),
	scopes: text("scopes").array().notNull(),
});

export const oauthAccessToken = pgTable("oauth_access_token", {
	id: text("id").primaryKey(),
	token: text("token").unique(),
	clientId: text("client_id")
		.notNull()
		.references(() => oauthClient.clientId, { onDelete: "cascade" }),
	sessionId: text("session_id").references(() => session.id, {
		onDelete: "set null",
	}),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	referenceId: text("reference_id"),
	refreshId: text("refresh_id").references(() => oauthRefreshToken.id, {
		onDelete: "cascade",
	}),
	expiresAt: timestamp("expires_at"),
	createdAt: timestamp("created_at"),
	scopes: text("scopes").array().notNull(),
});

export const oauthConsent = pgTable("oauth_consent", {
	id: text("id").primaryKey(),
	clientId: text("client_id")
		.notNull()
		.references(() => oauthClient.clientId, { onDelete: "cascade" }),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	referenceId: text("reference_id"),
	scopes: text("scopes").array().notNull(),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
});

const tables = {
	user,
	session,
	account,
	verification,
	organization,
	member,
	invitation,
	twoFactor,
	passkey,
	deviceCode,
	jwks,
	oauthClient,
	oauthRefreshToken,
	oauthAccessToken,
	oauthConsent,
};

export const relations = defineRelations(tables, (r) => ({
	user: {
		sessions: r.many.session(),
		accounts: r.many.account(),
		members: r.many.member(),
		invitations: r.many.invitation(),
		twoFactors: r.many.twoFactor(),
		passkeys: r.many.passkey(),
		oauthClients: r.many.oauthClient(),
		oauthRefreshTokens: r.many.oauthRefreshToken(),
		oauthAccessTokens: r.many.oauthAccessToken(),
		oauthConsents: r.many.oauthConsent(),
	},
	session: {
		user: r.one.user({
			from: r.session.userId,
			to: r.user.id,
		}),
		oauthRefreshTokens: r.many.oauthRefreshToken(),
		oauthAccessTokens: r.many.oauthAccessToken(),
	},
	account: {
		user: r.one.user({
			from: r.account.userId,
			to: r.user.id,
		}),
	},
	organization: {
		members: r.many.member(),
		invitations: r.many.invitation(),
	},
	member: {
		organization: r.one.organization({
			from: r.member.organizationId,
			to: r.organization.id,
		}),
		user: r.one.user({
			from: r.member.userId,
			to: r.user.id,
		}),
	},
	invitation: {
		organization: r.one.organization({
			from: r.invitation.organizationId,
			to: r.organization.id,
		}),
		user: r.one.user({
			from: r.invitation.inviterId,
			to: r.user.id,
		}),
	},
	twoFactor: {
		user: r.one.user({
			from: r.twoFactor.userId,
			to: r.user.id,
		}),
	},
	passkey: {
		user: r.one.user({
			from: r.passkey.userId,
			to: r.user.id,
		}),
	},
	oauthClient: {
		user: r.one.user({
			from: r.oauthClient.userId,
			to: r.user.id,
		}),
		oauthRefreshTokens: r.many.oauthRefreshToken(),
		oauthAccessTokens: r.many.oauthAccessToken(),
		oauthConsents: r.many.oauthConsent(),
	},
	oauthRefreshToken: {
		oauthClient: r.one.oauthClient({
			from: r.oauthRefreshToken.clientId,
			to: r.oauthClient.clientId,
		}),
		session: r.one.session({
			from: r.oauthRefreshToken.sessionId,
			to: r.session.id,
		}),
		user: r.one.user({
			from: r.oauthRefreshToken.userId,
			to: r.user.id,
		}),
		oauthAccessTokens: r.many.oauthAccessToken(),
	},
	oauthAccessToken: {
		oauthClient: r.one.oauthClient({
			from: r.oauthAccessToken.clientId,
			to: r.oauthClient.clientId,
		}),
		session: r.one.session({
			from: r.oauthAccessToken.sessionId,
			to: r.session.id,
		}),
		user: r.one.user({
			from: r.oauthAccessToken.userId,
			to: r.user.id,
		}),
		oauthRefreshToken: r.one.oauthRefreshToken({
			from: r.oauthAccessToken.refreshId,
			to: r.oauthRefreshToken.id,
		}),
	},
	oauthConsent: {
		oauthClient: r.one.oauthClient({
			from: r.oauthConsent.clientId,
			to: r.oauthClient.clientId,
		}),
		user: r.one.user({
			from: r.oauthConsent.userId,
			to: r.user.id,
		}),
	},
}));

export const schema = {
	user,
	session,
	account,
	verification,
	organization,
	member,
	invitation,
	twoFactor,
	passkey,
	deviceCode,
	jwks,
	oauthClient,
	oauthRefreshToken,
	oauthAccessToken,
	oauthConsent,
};
