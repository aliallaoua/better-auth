// import { IconDotsVertical } from "@tabler/icons-react";
// import { createColumnHelper, type Row } from "@tanstack/react-table";
// import type { UserWithRole } from "better-auth/plugins/admin";
// import {
// 	ArrowDown,
// 	ArrowUp,
// 	Ban,
// 	Copy,
// 	Mail,
// 	RefreshCw,
// 	ShieldCheck,
// 	Trash,
// 	UserCircle,
// 	User as UserIcon,
// } from "lucide-react";
// import {
// 	AlertDialog,
// 	AlertDialogAction,
// 	AlertDialogCancel,
// 	AlertDialogContent,
// 	AlertDialogDescription,
// 	AlertDialogFooter,
// 	AlertDialogHeader,
// 	AlertDialogTitle,
// 	AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
// 	DropdownMenu,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuLabel,
// 	DropdownMenuSeparator,
// 	DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
// 	Select,
// 	SelectContent,
// 	SelectGroup,
// 	SelectItem,
// 	SelectLabel,
// 	SelectTrigger,
// 	SelectValue,
// } from "@/components/ui/select";
// import { Spinner } from "@/components/ui/spinner";
// import {
// 	Tooltip,
// 	TooltipContent,
// 	TooltipTrigger,
// } from "@/components/ui/tooltip";

// // Define action handlers type
// export type UserActionHandlers = {
// 	onDeleteUser: (id: string) => void;
// 	onRevokeSessions: (id: string) => void;
// 	onImpersonateUser: (id: string) => void;
// 	onBanClick: (id: string) => void;
// 	onUnbanUser: (id: string) => void;
// 	onRoleChange: (id: string, role: "admin" | "user") => void;
// 	isLoading?: string;
// };

// // Create the column helper with the User type
// const columnHelper = createColumnHelper<UserWithRole>();

// // Custom filter function for multi-select role filtering
// const roleFilter = (
// 	row: Row<UserWithRole>,
// 	columnId: string,
// 	filterValue: string[]
// ) => {
// 	if (!filterValue || filterValue.length === 0) return true;
// 	const value = row.getValue(columnId);
// 	return filterValue.includes(String(value));
// };

// // Custom filter function for banned status
// const bannedFilter = (
// 	row: Row<UserWithRole>,
// 	columnId: string,
// 	filterValue: string
// ) => {
// 	if (!filterValue) return true;
// 	const value = row.getValue(columnId);
// 	if (filterValue === "banned") return value === true;
// 	if (filterValue === "active") return value === false;
// 	return true;
// };

// // Column header component with sorting
// const SortableHeader = ({ column, title }: { column: any; title: string }) => {
// 	return (
// 		<Button
// 			// className="h-8 px-2 -ml-2"
// 			className={`-ml-2 h-8 px-2 ${
// 				column.getCanSort()
// 					? "cursor-pointer select-none transition-colors hover:text-blue-400"
// 					: ""
// 			}`}
// 			onClick={() => column.toggleSorting()}
// 			variant="ghost"
// 		>
// 			{title}
// 			{{
// 				asc: <ArrowUp />,
// 				desc: <ArrowDown />,
// 			}[column.getIsSorted() as string] ?? null}
// 		</Button>
// 	);
// };

// export const createColumns = (handlers: UserActionHandlers) => [
// 	columnHelper.display({
// 		id: "select",
// 		header: ({ table }) => (
// 			<Checkbox
// 				aria-label="Select all"
// 				checked={
// 					table.getIsAllPageRowsSelected() ||
// 					(table.getIsSomePageRowsSelected() && "indeterminate")
// 				}
// 				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
// 			/>
// 		),
// 		cell: ({ row }) => (
// 			<Checkbox
// 				aria-label="Select row"
// 				checked={row.getIsSelected()}
// 				onCheckedChange={(value) => row.toggleSelected(!!value)}
// 			/>
// 		),
// 		enableSorting: false,
// 		enableHiding: false,
// 	}),

// 	columnHelper.accessor("email", {
// 		header: ({ column }) => <SortableHeader column={column} title="Email" />,
// 		cell: ({ getValue }) => {
// 			const email = getValue();
// 			return (
// 				<span className="block max-w-[200px] truncate font-medium">
// 					{email}
// 				</span>
// 			);
// 		},
// 		enableColumnFilter: true,
// 		filterFn: "includesString",
// 	}),

// 	columnHelper.accessor("name", {
// 		header: ({ column }) => <SortableHeader column={column} title="Name" />,
// 		cell: ({ getValue }) => {
// 			const name = getValue();
// 			return (
// 				<div className="font-medium">
// 					{name || (
// 						<span className="text-muted-foreground text-sm italic">
// 							No name
// 						</span>
// 					)}
// 				</div>
// 			);
// 		},
// 		enableColumnFilter: true,
// 		filterFn: "includesString",
// 	}),

// 	columnHelper.accessor("role", {
// 		header: ({ column }) => <SortableHeader column={column} title="Role" />,
// 		cell: ({ row }) => {
// 			const user = row.original;
// 			return (
// 				<Select
// 					disabled={handlers.isLoading === `role-${user.id}`}
// 					onValueChange={(value) =>
// 						handlers.onRoleChange(user.id, value as "admin" | "user")
// 					}
// 					value={user.role ?? undefined}
// 				>
// 					<SelectTrigger className="h-9 w-[140px]">
// 						<SelectValue placeholder="Select role" />
// 						{handlers.isLoading === `role-${user.id}` && <Spinner />}
// 					</SelectTrigger>
// 					<SelectContent>
// 						<SelectGroup>
// 							<SelectLabel>Select Role</SelectLabel>
// 							<SelectItem value="admin">
// 								<div className="flex items-center gap-2">
// 									<ShieldCheck className="size-4 text-purple-600" />
// 									<Badge className="font-semibold text-xs" variant="default">
// 										Admin
// 									</Badge>
// 								</div>
// 							</SelectItem>
// 							<SelectItem value="user">
// 								<div className="flex items-center gap-2">
// 									<UserIcon className="size-4 text-blue-600" />
// 									<Badge className="font-semibold text-xs" variant="secondary">
// 										User
// 									</Badge>
// 								</div>
// 							</SelectItem>
// 						</SelectGroup>
// 					</SelectContent>
// 				</Select>
// 			);
// 		},
// 		enableColumnFilter: true,
// 		filterFn: roleFilter,
// 		meta: {
// 			filterVariant: "select",
// 			filterOptions: [
// 				{ label: "Admin", value: "admin" },
// 				{ label: "User", value: "user" },
// 			],
// 		},
// 	}),

// 	columnHelper.accessor("banned", {
// 		header: ({ column }) => <SortableHeader column={column} title="Status" />,
// 		cell: ({ getValue }) => {
// 			const banned = getValue();
// 			return banned ? (
// 				<Badge className="font-semibold shadow-sm" variant="destructive">
// 					<Ban className="mr-1 size-3" />
// 					Banned
// 				</Badge>
// 			) : (
// 				<Badge
// 					className="border-green-200 bg-green-50 font-semibold text-green-700 shadow-sm hover:bg-green-100 dark:border-green-900 dark:bg-green-950 dark:text-green-400"
// 					variant="outline"
// 				>
// 					<div className="mr-1 size-2 rounded-full bg-green-500" />
// 					Active
// 				</Badge>
// 			);
// 		},
// 		enableColumnFilter: true,
// 		filterFn: bannedFilter,
// 		meta: {
// 			filterVariant: "select",
// 			filterOptions: [
// 				{ label: "Active", value: "active" },
// 				{ label: "Banned", value: "banned" },
// 			],
// 		},
// 	}),

// 	columnHelper.accessor("createdAt", {
// 		header: ({ column }) => <SortableHeader column={column} title="Created" />,
// 		cell: ({ getValue }) => {
// 			const date = getValue();
// 			if (!date)
// 				return <span className="text-muted-foreground text-sm">-</span>;

// 			return (
// 				<Tooltip>
// 					<TooltipTrigger asChild>
// 						<span className="cursor-default font-medium text-sm">
// 							{new Intl.DateTimeFormat("en-US", {
// 								month: "short",
// 								day: "numeric",
// 								year: "numeric",
// 							}).format(date)}
// 						</span>
// 					</TooltipTrigger>
// 					<TooltipContent>
// 						<p>
// 							{new Intl.DateTimeFormat("en-US", {
// 								dateStyle: "full",
// 								timeStyle: "short",
// 							}).format(date)}
// 						</p>
// 					</TooltipContent>
// 				</Tooltip>
// 			);
// 		},
// 		enableColumnFilter: false,
// 		enableSorting: true,
// 	}),

// 	columnHelper.display({
// 		id: "actions",
// 		header: "Actions",
// 		cell: ({ row }) => {
// 			const user = row.original;
// 			return (
// 				<DropdownMenu>
// 					<DropdownMenuTrigger asChild>
// 						<Button
// 							className="size-8 text-muted-foreground transition-colors hover:bg-muted/80 data-[state=open]:bg-muted"
// 							size="icon"
// 							variant="ghost"
// 						>
// 							<IconDotsVertical className="size-4" />
// 							<span className="sr-only">Open menu</span>
// 						</Button>
// 					</DropdownMenuTrigger>
// 					<DropdownMenuContent align="end" className="w-[200px]">
// 						<DropdownMenuLabel className="font-semibold">
// 							Actions
// 						</DropdownMenuLabel>
// 						<DropdownMenuSeparator />
// 						<DropdownMenuItem
// 							className="gap-2"
// 							onClick={() => navigator.clipboard.writeText(user.id)}
// 						>
// 							<Copy className="size-4" />
// 							Copy user ID
// 						</DropdownMenuItem>
// 						<DropdownMenuItem
// 							className="gap-2"
// 							onClick={() => navigator.clipboard.writeText(user.email)}
// 						>
// 							<Mail className="size-4" />
// 							Copy email
// 						</DropdownMenuItem>
// 						<DropdownMenuSeparator />
// 						<DropdownMenuItem
// 							className="gap-2"
// 							disabled={handlers.isLoading?.startsWith("impersonate")}
// 							onClick={() => handlers.onImpersonateUser(user.id)}
// 						>
// 							{handlers.isLoading === `impersonate-${user.id}` ? (
// 								<Spinner />
// 							) : (
// 								<UserCircle className="size-4" />
// 							)}
// 							Impersonate
// 						</DropdownMenuItem>
// 						<DropdownMenuItem
// 							className="gap-2"
// 							disabled={handlers.isLoading?.startsWith("revoke")}
// 							onClick={() => handlers.onRevokeSessions(user.id)}
// 						>
// 							{handlers.isLoading === `revoke-${user.id}` ? (
// 								<Spinner />
// 							) : (
// 								<RefreshCw className="size-4" />
// 							)}
// 							Revoke sessions
// 						</DropdownMenuItem>
// 						<DropdownMenuSeparator />
// 						<DropdownMenuItem
// 							className="gap-2"
// 							disabled={handlers.isLoading?.startsWith("ban")}
// 							onClick={() => {
// 								if (user.banned) {
// 									handlers.onUnbanUser(user.id);
// 								} else {
// 									handlers.onBanClick(user.id);
// 								}
// 							}}
// 						>
// 							{handlers.isLoading === `ban-${user.id}` ? (
// 								<Spinner />
// 							) : (
// 								<Ban className="size-4" />
// 							)}
// 							{user.banned ? "Unban user" : "Ban user"}
// 						</DropdownMenuItem>
// 						<AlertDialog>
// 							<AlertDialogTrigger asChild>
// 								<DropdownMenuItem
// 									className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/20"
// 									disabled={handlers.isLoading?.startsWith("delete")}
// 									onSelect={(e) => e.preventDefault()}
// 								>
// 									{handlers.isLoading === `delete-${user.id}` ? (
// 										<Spinner />
// 									) : (
// 										<Trash className="size-4" />
// 									)}
// 									Delete user
// 								</DropdownMenuItem>
// 							</AlertDialogTrigger>
// 							<AlertDialogContent className="max-w-md">
// 								<AlertDialogHeader>
// 									<AlertDialogTitle className="text-xl">
// 										Are you absolutely sure?
// 									</AlertDialogTitle>
// 									<AlertDialogDescription className="text-base">
// 										This action cannot be undone. This will permanently delete{" "}
// 										<span className="font-semibold text-foreground">
// 											{user.email}
// 										</span>{" "}
// 										and remove all their data from the servers.
// 									</AlertDialogDescription>
// 								</AlertDialogHeader>
// 								<AlertDialogFooter>
// 									<AlertDialogCancel>Cancel</AlertDialogCancel>
// 									<AlertDialogAction
// 										className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
// 										onClick={() => handlers.onDeleteUser(user.id)}
// 									>
// 										<Trash className="mr-2 size-4" />
// 										Delete User
// 									</AlertDialogAction>
// 								</AlertDialogFooter>
// 							</AlertDialogContent>
// 						</AlertDialog>
// 					</DropdownMenuContent>
// 				</DropdownMenu>
// 			);
// 		},
// 		enableSorting: false,
// 		enableHiding: false,
// 	}),
// ];

// // Filter functions that can be used globally
// export const userTableFilterFns = {
// 	roleFilter,
// 	bannedFilter,
// };
