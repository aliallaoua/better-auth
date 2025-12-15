import {
	IconCreditCard,
	IconDotsVertical,
	IconLogout,
	IconNotification,
	IconUserCircle,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import useSignOutMutation from "@/hooks/mutations/useSignOutMutation";
import { useSession } from "@/lib/auth-client";
import { routerConfig } from "@/utils/viewTransitionOptions";

export function NavUser() {
	const { isMobile } = useSidebar();
	const { mutateAsync: signOutMutation } = useSignOutMutation();
	const { data: session, isPending } = useSession();

	if (isPending) {
		return null;
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<SidebarMenuButton
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								size="lg"
							>
								<Avatar className="h-8 w-8 rounded-lg grayscale">
									<AvatarFallback className="rounded-lg">
										{session?.user.name && session.user.name.length > 0
											? session.user.name.charAt(0).toUpperCase()
											: session?.user.email.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{session?.user.name && session.user.name.length > 0
											? session.user.name
											: session?.user.email.split("@")[0]}
									</span>
									<span className="truncate text-muted-foreground text-xs">
										{session?.user.email}
									</span>
								</div>
								<IconDotsVertical className="ml-auto size-4" />
							</SidebarMenuButton>
						}
					/>
					<DropdownMenuContent
						align="end"
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarFallback className="rounded-lg">
											{session?.user.name && session.user.name.length > 0
												? session.user.name.charAt(0).toUpperCase()
												: session?.user.email.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">
											{session?.user.name && session.user.name.length > 0
												? session.user.name
												: session?.user.email.split("@")[0]}
										</span>
										<span className="truncate text-muted-foreground text-xs">
											{session?.user.email}
										</span>
									</div>
								</div>
							</DropdownMenuLabel>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<Link
									className="flex items-center gap-2 text-left text-sm transition-colors hover:bg-accent"
									to="/profile"
									viewTransition={{
										types: routerConfig.viewTransitionOptions,
									}}
								>
									<IconUserCircle />
									Account
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<IconCreditCard />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<IconNotification />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={async () => {
								await signOutMutation();
							}}
						>
							<IconLogout />
							Sign out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
