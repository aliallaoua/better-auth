import {
	IconFileAi,
	IconInnerShadowTop,
	IconListDetails,
	IconReport,
} from "@tabler/icons-react";
import { Link, linkOptions } from "@tanstack/react-router";
import {
	CameraIcon,
	ChartBarIcon,
	DatabaseIcon,
	FileEditIcon,
	FilesIcon,
	FolderIcon,
	HelpCircleIcon,
	LayoutDashboardIcon,
	SearchIcon,
	SettingsIcon,
	UsersIcon,
} from "lucide-react";
import { NavDocuments } from "@/components/nav-documents";
import type { NavMainProps } from "@/components/nav-main";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import type { NavUserProps } from "@/components/nav-user";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	user: NavUserProps["user"];
}

const navMain: NavMainProps["items"] = linkOptions([
	{
		title: "Dashboard",
		to: "/dashboard",
		icon: LayoutDashboardIcon,
		// activeOptions: { exact: false },
	},
	{
		title: "Lifecycle",
		to: "#",
		icon: IconListDetails,
	},
	{
		title: "Analytics",
		to: "/admin",
		icon: ChartBarIcon,
		// activeOptions: { exact: false },
	},
	{
		title: "Projects",
		to: "#",
		icon: FolderIcon,
	},
	{
		title: "Team",
		to: "#",
		icon: UsersIcon,
	},
]);

const data = {
	// navMain: [
	// 	{
	// 		title: "Dashboard",
	// 		url: "/dashboard",
	// 		icon: LayoutDashboardIcon,
	// 	},
	// 	{
	// 		title: "Lifecycle",
	// 		url: "#",
	// 		icon: IconListDetails,
	// 	},
	// 	{
	// 		title: "Analytics",
	// 		url: "/admin",
	// 		icon: ChartBarIcon,
	// 	},
	// 	{
	// 		title: "Projects",
	// 		url: "#",
	// 		icon: FolderIcon,
	// 	},
	// 	{
	// 		title: "Team",
	// 		url: "#",
	// 		icon: UsersIcon,
	// 	},
	// ],
	navMain,
	navClouds: [
		{
			title: "Capture",
			icon: CameraIcon,
			isActive: true,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
		{
			title: "Proposal",
			icon: FilesIcon,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
		{
			title: "Prompts",
			icon: IconFileAi,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Settings",
			url: "#",
			icon: SettingsIcon,
		},
		{
			title: "Get Help",
			url: "#",
			icon: HelpCircleIcon,
		},
		{
			title: "Search",
			url: "#",
			icon: SearchIcon,
		},
	],
	documents: [
		{
			name: "Data Library",
			url: "#",
			icon: DatabaseIcon,
		},
		{
			name: "Reports",
			url: "#",
			icon: IconReport,
		},
		{
			name: "Word Assistant",
			url: "#",
			icon: FileEditIcon,
		},
	],
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							render={<Link to="#" />}
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<IconInnerShadowTop className="!size-5" />
							<span className="font-semibold text-base">Acme Inc.</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavDocuments items={data.documents} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
