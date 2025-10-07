import type { ColumnDef } from "@tanstack/react-table";
import {
	ArrowUpDown,
	Ban,
	MoreHorizontal,
	RefreshCw,
	Trash,
	UserCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the User type based on your data
export type User = {
	id: string;
	email: string;
	name: string;
	role: string;
	banned: boolean | null | undefined;
	createdAt?: Date;
	lastActive?: Date;
};

// Define action handlers type
export type UserActionHandlers = {
	onDeleteUser: (id: string) => void;
	onRevokeSessions: (id: string) => void;
	onImpersonateUser: (id: string) => void;
	onBanClick: (id: string) => void;
	onUnbanUser: (id: string) => void;
	onRoleChange: (id: string, role: "admin" | "user") => void;
	isLoading?: string;
};

// Custom filter function for multi-select role filtering
const roleFilter = (row: any, columnId: string, filterValue: string[]) => {
	if (!filterValue || filterValue.length === 0) return true;
	const value = row.getValue(columnId);
	return filterValue.includes(value);
};

// Custom filter function for banned status
const bannedFilter = (row: any, columnId: string, filterValue: string) => {
	if (!filterValue) return true;
	const value = row.getValue(columnId);
	if (filterValue === "banned") return value === true;
	if (filterValue === "active") return value === false;
	return true;
};

// Column header component with sorting
const SortableHeader = ({ column, title }: { column: any; title: string }) => {
	return (
		<Button
			className="h-8 px-2 -ml-2"
			onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			variant="ghost"
		>
			{title}
			<ArrowUpDown className="ml-2 size-4" />
		</Button>
	);
};

export const createColumns = (
	handlers: UserActionHandlers
): ColumnDef<User>[] => [
	// Row selection column
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				aria-label="Select all"
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				aria-label="Select row"
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "email",
		header: ({ column }) => <SortableHeader column={column} title="Email" />,
		cell: ({ row }) => {
			const email = row.getValue("email") as string;
			return (
				<div className="font-medium">
					<Tooltip>
						<TooltipTrigger asChild>
							<span className="truncate max-w-[200px] block">{email}</span>
						</TooltipTrigger>
						<TooltipContent>
							<p>{email}</p>
						</TooltipContent>
					</Tooltip>
				</div>
			);
		},
		enableColumnFilter: true,
		filterFn: "includesString",
	},
	{
		accessorKey: "name",
		header: ({ column }) => <SortableHeader column={column} title="Name" />,
		cell: ({ row }) => {
			const name = row.getValue("name") as string;
			return (
				<div className="font-medium">
					{name || (
						<span className="text-muted-foreground italic">No name</span>
					)}
				</div>
			);
		},
		enableColumnFilter: true,
		filterFn: "includesString",
	},
	{
		accessorKey: "role",
		header: ({ column }) => <SortableHeader column={column} title="Role" />,
		cell: ({ row }) => {
			const user = row.original;
			return (
				<Select
					disabled={handlers.isLoading === `role-${user.id}`}
					onValueChange={(value) =>
						handlers.onRoleChange(user.id, value as "admin" | "user")
					}
					value={user.role}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select a role" />
						{handlers.isLoading === `role-${user.id}` && <Spinner />}
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Role</SelectLabel>
							<SelectItem value="admin">
								<Badge className="text-xs" variant="default">
									Admin
								</Badge>
							</SelectItem>
							<SelectItem value="user">
								<Badge className="text-xs" variant="secondary">
									User
								</Badge>
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			);
		},
		enableColumnFilter: true,
		filterFn: roleFilter,
		meta: {
			filterVariant: "select",
			filterOptions: [
				{ label: "Admin", value: "admin" },
				{ label: "User", value: "user" },
			],
		},
	},
	{
		accessorKey: "banned",
		header: ({ column }) => <SortableHeader column={column} title="Status" />,
		cell: ({ row }) => {
			const banned = row.getValue("banned") as boolean;
			return banned ? (
				<Badge variant="destructive">Banned</Badge>
			) : (
				<Badge className="text-green-600 border-green-200" variant="outline">
					Active
				</Badge>
			);
		},
		enableColumnFilter: true,
		filterFn: bannedFilter,
		meta: {
			filterVariant: "select",
			filterOptions: [
				{ label: "Active", value: "active" },
				{ label: "Banned", value: "banned" },
			],
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => <SortableHeader column={column} title="Created" />,
		cell: ({ row }) => {
			const date = row.getValue("createdAt") as Date;
			if (!date) return <span className="text-muted-foreground">-</span>;

			return (
				<Tooltip>
					<TooltipTrigger asChild>
						<span className="text-sm">
							{new Intl.DateTimeFormat("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							}).format(date)}
						</span>
					</TooltipTrigger>
					<TooltipContent>
						<p>
							{new Intl.DateTimeFormat("en-US", {
								dateStyle: "full",
								timeStyle: "short",
							}).format(date)}
						</p>
					</TooltipContent>
				</Tooltip>
			);
		},
		enableColumnFilter: false,
		enableSorting: true,
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="size-8 p-0" variant="ghost">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[180px]">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(user.id)}
						>
							Copy user ID
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(user.email)}
						>
							Copy email
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							disabled={handlers.isLoading?.startsWith("impersonate")}
							onClick={() => handlers.onImpersonateUser(user.id)}
						>
							{handlers.isLoading === `impersonate-${user.id}` ? (
								<Spinner />
							) : (
								<UserCircle className="mr-2 size-4" />
							)}
							Impersonate
						</DropdownMenuItem>
						<DropdownMenuItem
							disabled={handlers.isLoading?.startsWith("revoke")}
							onClick={() => handlers.onRevokeSessions(user.id)}
						>
							{handlers.isLoading === `revoke-${user.id}` ? (
								<Spinner />
							) : (
								<RefreshCw className="mr-2 size-4" />
							)}
							Revoke sessions
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							disabled={handlers.isLoading?.startsWith("ban")}
							onClick={() => {
								if (user.banned) {
									handlers.onUnbanUser(user.id);
								} else {
									handlers.onBanClick(user.id);
								}
							}}
						>
							{handlers.isLoading === `ban-${user.id}` ? (
								<Spinner />
							) : (
								<Ban className="mr-2 size-4" />
							)}
							{user.banned ? "Unban user" : "Ban user"}
						</DropdownMenuItem>
						<DropdownMenuItem
							className="text-red-600 focus:text-red-600"
							disabled={handlers.isLoading?.startsWith("delete")}
							onClick={() => handlers.onDeleteUser(user.id)}
						>
							{handlers.isLoading === `delete-${user.id}` ? (
								<Spinner />
							) : (
								<Trash className="mr-2 size-4" />
							)}
							Delete user
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
];

// Filter functions that can be used globally
export const userTableFilterFns = {
	roleFilter,
	bannedFilter,
};
