import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import AccountSwitcher from "@/components/account-switch";
import { auth } from "@/lib/auth";
import { userMiddleware } from "@/lib/auth-middleware";
import { OrganizationCard } from "./-components/organization-card";
import UserCard from "./-components/user-card";

const getProfileData = createServerFn()
	.middleware([userMiddleware])
	.handler(async () => {
		const headers = getRequestHeaders();
		try {
			const [session, activeSessions, deviceSessions] = await Promise.all([
				auth.api.getSession({ headers }),
				auth.api.listSessions({ headers }),
				auth.api.listDeviceSessions({ headers }),
			])

			return {
				session: session
					? {
							user: session?.user,
							session: session?.session,
						}
					: null,
				activeSessions: activeSessions || [],
				deviceSessions: deviceSessions || [],
			}
		} catch (e) {
			console.log(e);
			throw redirect({ to: "/login" });
		}
	});

export const Route = createFileRoute("/_auth/__pathlessLayout/profile/")({
	loader: async () => {
		const { session, activeSessions, deviceSessions } = await getProfileData();

		return {
			session,
			activeSessions,
			deviceSessions,
		}
	},
	component: ProfileComponent,
});

function ProfileComponent() {
	const { session, activeSessions, deviceSessions } = Route.useLoaderData();

	return (
		<div className="min-h-screen w-full bg-white px-4 py-4 sm:px-6 dark:bg-black">
			<div className="mx-auto w-full max-w-4xl">
				<div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
					<AccountSwitcher
						deviceSessions={deviceSessions}
						initialSession={session}
					/>
					<UserCard session={session} activeSessions={activeSessions} />
					<OrganizationCard session={session} />
				</div>
			</div>
		</div>
	)
}
