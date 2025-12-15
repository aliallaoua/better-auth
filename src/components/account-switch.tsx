import { useRouter } from "@tanstack/react-router";
import { ChevronDown, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { authClient, useSession } from "@/lib/auth-client";
import type { Session } from "@/lib/auth-types";

export default function AccountSwitcher({ sessions }: { sessions: Session[] }) {
	const { data: currentUser } = useSession();
	const [open, setOpen] = useState(false);
	const router = useRouter();
	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger
				render={
					<Button
						aria-expanded={open}
						aria-label="Select a user"
						className="w-[250px] justify-between"
						role="combobox"
						variant="outline"
					>
						<Avatar className="mr-2 size-6">
							<AvatarImage
								alt={currentUser?.user.name}
								src={currentUser?.user.image || undefined}
							/>
							<AvatarFallback>
								{currentUser?.user.name.charAt(0)}
							</AvatarFallback>
						</Avatar>
						{currentUser?.user.name}
						<ChevronDown className="ml-auto size-4 shrink-0 opacity-50" />
					</Button>
				}
			/>
			<PopoverContent className="w-[250px] p-0">
				<Command>
					<CommandList>
						<CommandGroup heading="Current Account">
							<CommandItem
								className="w-full justify-between text-sm"
								key={currentUser?.user.id}
								onSelect={() => {}}
							>
								<div className="flex items-center">
									<Avatar className="mr-2 size-5">
										<AvatarImage
											alt={currentUser?.user.name}
											src={currentUser?.user.image || undefined}
										/>
										<AvatarFallback>
											{currentUser?.user.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									{currentUser?.user.name}
								</div>
							</CommandItem>
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="Switch Account">
							{sessions
								.filter((s) => s.user.id !== currentUser?.user.id)
								// .map((u, i) => (
								.map((u) => (
									<CommandItem
										className="text-sm"
										// key={i}
										key={u.user.id}
										onSelect={async () => {
											await authClient.multiSession.setActive({
												sessionToken: u.session.token,
											});
											setOpen(false);
										}}
									>
										<Avatar className="mr-2 size-5">
											<AvatarImage
												alt={u.user.name}
												src={u.user.image || undefined}
											/>
											<AvatarFallback>{u.user.name.charAt(0)}</AvatarFallback>
										</Avatar>
										<div className="flex w-full items-center justify-between">
											<div>
												<p>{u.user.name}</p>
												<p className="text-xs">({u.user.email})</p>
											</div>
										</div>
									</CommandItem>
								))}
						</CommandGroup>
					</CommandList>
					<CommandSeparator />
					<CommandList>
						<CommandGroup>
							<CommandItem
								className="cursor-pointer text-sm"
								onSelect={() => {
									router.navigate({
										to: "/login",
										// search: { addAccount: true },
									});
									setOpen(false);
								}}
							>
								<PlusCircle className="mr-2 size-5" />
								Add Account
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
