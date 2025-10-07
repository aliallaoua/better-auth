import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import AccountSwitcher from "@/components/account-switch";
import { OrganizationCard } from "@/components/dashboard/organization-card";
import UserCard from "@/components/dashboard/user-card";
import { auth } from "@/lib/auth";
import { userMiddleware } from "@/lib/auth-middleware";

const getProfileData = createServerFn()
	.middleware([userMiddleware])
	.handler(async () => {
		const headers = getRequestHeaders();
		try {
			const [session, activeSessions, deviceSessions, organization] =
				await Promise.all([
					auth.api.getSession({ headers }),
					auth.api.listSessions({ headers }),
					auth.api.listDeviceSessions({ headers }),
					auth.api.getFullOrganization({ headers }),
				]);

			return {
				session: session
					? {
							user: session?.user,
							session: session?.session,
						}
					: null,
				activeSessions: activeSessions || [],
				deviceSessions: deviceSessions || [],
				organization: organization || null,
			};
		} catch (e) {
			console.log(e);
			throw redirect({ to: "/signin" });
		}
	});

export const Route = createFileRoute("/_auth/_pathlessLayout/profile")({
	loader: async () => {
		const { session, activeSessions, deviceSessions, organization } =
			await getProfileData();

		return {
			session,
			activeSessions,
			deviceSessions,
			organization,
		};
	},
	component: ProfilePage,
});

function ProfilePage() {
	const { session, activeSessions, deviceSessions, organization } =
		Route.useLoaderData();

	return (
		<div className="min-h-screen w-full bg-white px-4 py-4 sm:px-6 dark:bg-black">
			<div className="mx-auto w-full max-w-4xl">
				<div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
					<AccountSwitcher
						sessions={JSON.parse(JSON.stringify(deviceSessions))}
					/>
					<UserCard
						activeSessions={JSON.parse(JSON.stringify(activeSessions))}
						session={JSON.parse(JSON.stringify(session))}
					/>
					<OrganizationCard
						activeOrganization={JSON.parse(JSON.stringify(organization))}
						session={JSON.parse(JSON.stringify(session))}
					/>
				</div>
			</div>
		</div>
	);
}
