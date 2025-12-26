import { Link } from "@tanstack/react-router";
import {
	BellIcon,
	CreditCardIcon,
	LogOutIcon,
	MoreVerticalIcon,
	UserCircle2Icon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
					{/* <DropdownMenuTrigger
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
					/> */}
					<DropdownMenuTrigger
						render={
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							/>
						}
					>
						<Avatar className="h-8 w-8 rounded-lg grayscale">
							<AvatarImage src={session?.user.image} alt={session?.user.name} />
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
						<MoreVerticalIcon className="ml-auto size-4" />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={session?.user.image}
											alt={session?.user.name}
										/>
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
									<UserCircle2Icon />
									Account
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<CreditCardIcon />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<BellIcon />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={async () => {
								await signOutMutation();
							}}
						>
							<LogOutIcon />
							Sign out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
