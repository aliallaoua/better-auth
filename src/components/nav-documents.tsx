import type { Icon } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import {
	FolderIcon,
	MoreHorizontalIcon,
	ShareIcon,
	TrashIcon,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

export function NavDocuments({
	items,
}: {
	items: {
		name: string;
		url: string;
		icon: Icon;
	}[];
}) {
	const { isMobile } = useSidebar();

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Documents</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton render={<Link to={item.url} />}>
							<item.icon />
							<span>{item.name}</span>
						</SidebarMenuButton>
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<SidebarMenuAction
										showOnHover
										className="rounded-sm data-[state=open]:bg-accent"
									/>
								}
							>
								<MoreHorizontalIcon />
								<span className="sr-only">More</span>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align={isMobile ? "end" : "start"}
								className="w-24 rounded-lg"
								side={isMobile ? "bottom" : "right"}
							>
								<DropdownMenuItem>
									<FolderIcon />
									<span>Open</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<ShareIcon />
									<span>Share</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem variant="destructive">
									<TrashIcon />
									<span>Delete</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				))}
				<SidebarMenuItem>
					<SidebarMenuButton className="text-sidebar-foreground/70">
						<MoreHorizontalIcon className="text-sidebar-foreground/70" />
						<span>More</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}
