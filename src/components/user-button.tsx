import { createLink } from "@tanstack/react-router";
import {
	LogIn,
	LogOut,
	Shield,
	User,
	User2,
	UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import useSignOutMutation from "@/hooks/mutations/useSignOutMutation";
import { useSession } from "@/lib/auth-client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const ItemLink = createLink(DropdownMenuItem);

export default function UserButton() {
	const { data: session } = useSession();
	const [open, setOpen] = useState(false);
	const { mutateAsync: signOutMutation } = useSignOutMutation();

	return (
		<DropdownMenu onOpenChange={setOpen} open={open}>
			<DropdownMenuTrigger
				render={
					<Button
						className="size-8 cursor-pointer rounded-full"
						size="icon"
						variant="outline"
					>
						<Avatar className="size-8">
							<AvatarImage alt="User avatar" src={session?.user.image ?? ""} />
							<AvatarFallback>
								{session?.user ? (
									session?.user.name.charAt(0)
								) : (
									<User className="size-4" />
								)}
							</AvatarFallback>
						</Avatar>
					</Button>
				}
			/>
			<DropdownMenuContent align="end" className="w-72 [--radius:0.65rem]">
				<DropdownMenuGroup>
					<DropdownMenuLabel className="p-0">
						{session?.user ? (
							<Item className="w-full p-2" size="sm">
								<ItemMedia>
									<Avatar className="size-8">
										<AvatarImage
											alt="User avatar"
											className="grayscale"
											src={session?.user.image ?? ""}
										/>
										<AvatarFallback>
											{session?.user.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
								</ItemMedia>
								<ItemContent className="gap-0.5">
									<ItemTitle>{session?.user.name}</ItemTitle>
									<ItemDescription>{session?.user.email}</ItemDescription>
								</ItemContent>
							</Item>
						) : (
							<Item className="w-full p-2" size="sm">
								<ItemContent>
									<ItemDescription>Account</ItemDescription>
								</ItemContent>
							</Item>
						)}
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				{session?.user ? (
					<>
						<ItemLink
							className="cursor-pointer"
							onClick={() => setOpen(false)}
							to="/profile"
							viewTransition={{ types: ["slide-down"] }}
						>
							<User2 className="mr-2 size-4" />
							<span>Profile</span>
						</ItemLink>
						{session?.user.role === "admin" && (
							<ItemLink
								className="cursor-pointer"
								onClick={() => setOpen(false)}
								to="/admin"
								viewTransition={{ types: ["slide-down"] }}
							>
								<Shield className="mr-2 size-4" />
								<span>Admin Panel</span>
							</ItemLink>
						)}

						<DropdownMenuItem
							className="cursor-pointer text-red-600"
							onClick={async () => {
								await signOutMutation();
							}}
						>
							<LogOut className="mr-2 size-4" />
							<span>Sign out</span>
						</DropdownMenuItem>
					</>
				) : (
					<>
						<ItemLink
							className="cursor-pointer"
							onClick={() => setOpen(false)}
							to="/login"
						>
							<LogIn className="mr-2 size-4" />
							<span>Log In</span>
						</ItemLink>
						<ItemLink
							className="cursor-pointer"
							onClick={() => setOpen(false)}
							to="/signup"
						>
							<UserRoundPlus className="mr-2 size-4" />
							<span>Sign Up</span>
						</ItemLink>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
