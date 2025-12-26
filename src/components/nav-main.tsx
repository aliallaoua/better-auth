import type { Icon } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { MailIcon, PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { routerConfig } from "@/utils/viewTransitionOptions";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: Icon;
	}[];
}) {
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-2">
						<Link
							to="/resend"
							className="w-full"
							viewTransition={{
								types: routerConfig.viewTransitionOptions,
							}}
						>
							<SidebarMenuButton
								tooltip="Quick Create"
								className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
							>
								<PlusCircleIcon />
								<span>Quick Create</span>
							</SidebarMenuButton>
						</Link>
						<Button
							size="icon"
							className="size-8 group-data-[collapsible=icon]:opacity-0"
							variant="outline"
						>
							<MailIcon />
							<span className="sr-only">Inbox</span>
						</Button>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							{/* <Link
								to={item.url}
								viewTransition={{
									types: routerConfig.viewTransitionOptions,
								}}
							>
								<SidebarMenuButton tooltip={item.title}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</SidebarMenuButton>
							</Link> */}
							<SidebarMenuButton
								render={
									<Link
										to={item.url}
										viewTransition={{
											types: routerConfig.viewTransitionOptions,
										}}
									/>
								}
							>
								{item.icon && <item.icon />}
								<span>{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
