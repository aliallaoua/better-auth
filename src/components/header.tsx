import { Link } from '@tanstack/react-router';
import DevbarMenu from './devbar-menu';
import { ModeToggle } from './mode-toggle';
import { ThemeSwitcher } from './theme-switcher';
import UserButton from './user-button';

export default function Header() {
	return (
		<header className="flex justify-between gap-2 bg-white p-2 text-black dark:bg-black dark:text-white">
			<nav className="flex flex-end flex-row items-center gap-8">
				<div className="px-2 font-bold">
					<Link to="/">Home</Link>
				</div>

				<div className="px-2 font-bold">
					<Link to="/demo/start/server-funcs">Start - Server Functions</Link>
				</div>

				<div className="px-2 font-bold">
					<Link to="/demo/start/api-request">Start - API Request</Link>
				</div>

				<div className="px-2 font-bold">
					<Link to="/demo/form/simple">Simple Form</Link>
				</div>

				<div className="px-2 font-bold">
					<Link to="/demo/form/address">Address Form</Link>
				</div>

				<div className="px-2 font-bold">
					<Link to="/demo/neon">Neon</Link>
				</div>

				<div className="px-2 font-bold">
					<Link to="/demo/tanstack-query">TanStack Query</Link>
				</div>

				<div className="px-2 font-bold">
					<Link to="/better-auth">Better Auth - Resend</Link>
				</div>

				{/* <DevbarMenu /> */}
				{/* <ThemeSwitcher /> */}
				<ModeToggle />
				<UserButton />
			</nav>
		</header>
	);
}
