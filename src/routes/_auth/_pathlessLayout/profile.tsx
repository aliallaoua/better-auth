import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import AccountSwitcher from '@/components/account-switch';
import { OrganizationCard } from '@/components/dashboard/organization-card';
import UserCard from '@/components/dashboard/user-card';
import { auth } from '@/lib/auth';

const getProfileData = createServerFn({ method: 'GET' }).handler(async () => {
	const request = getWebRequest();

	try {
		const [session, activeSessions, deviceSessions, organization] =
			await Promise.all([
				auth.api.getSession({ headers: request.headers }),
				auth.api.listSessions({ headers: request.headers }),
				auth.api.listDeviceSessions({ headers: request.headers }),
				auth.api.getFullOrganization({ headers: request.headers }),
			]);

		return {
			session,
			activeSessions,
			deviceSessions,
			organization,
		};
	} catch (e) {
		console.log(e);
		throw redirect({ to: '/signin' });
	}
});

export const Route = createFileRoute('/_auth/_pathlessLayout/profile')({
	loader: async () => {
		const data = await getProfileData();

		return {
			data,
		};
	},
	component: ProfilePage,
});

function ProfilePage() {
	const { data } = Route.useLoaderData();

	return (
		// <div className="absolute inset-0 hidden items-start justify-center bg-white pt-16 md:flex dark:bg-black">
		<div className="w-full pt-2 lg:w-7/12">
			<div className="w-full">
				<div className="flex flex-col gap-4">
					<AccountSwitcher
						sessions={JSON.parse(JSON.stringify(data.deviceSessions))}
					/>
					<UserCard
						activeSessions={JSON.parse(JSON.stringify(data.activeSessions))}
						session={JSON.parse(JSON.stringify(data.session))}
					/>
					<OrganizationCard
						activeOrganization={JSON.parse(JSON.stringify(data.organization))}
						session={JSON.parse(JSON.stringify(data.session))}
					/>
				</div>
			</div>
		</div>
		// </div>
	);
}
