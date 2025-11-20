"use no memo";

import {
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
	IconDotsVertical,
} from "@tabler/icons-react";
import type {
	ColumnFiltersState,
	Row,
	SortingState,
	VisibilityState,
} from "@tanstack/react-table";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { UserWithRole } from "better-auth/plugins/admin";
import {
	ArrowDown,
	ArrowUp,
	Ban,
	ChevronDownIcon,
	Copy,
	Download,
	Filter,
	Layers,
	Mail,
	RefreshCw,
	SearchIcon,
	ShieldCheck,
	Trash,
	UserCircle,
	User as UserIcon,
	UserX,
	X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserMutations {
	deleteUser: (userId: string) => void;
	revokeSessions: (userId: string) => void;
	impersonateUser: (userId: string) => void;
	unbanUser: (userId: string) => void;
	changeRole: (params: { userId: string; role: "admin" | "user" }) => void;
}

interface DataTableProps {
	data: UserWithRole[];
	mutations: UserMutations;
	selfId: string | undefined;
	onExportData?: () => void;
	onBanClick: (userId: string) => void;
}

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

// Create the column helper with the User type
const columnHelper = createColumnHelper<UserWithRole>();

// Custom filter function for multi-select role filtering
const roleFilter = (
	row: Row<UserWithRole>,
	columnId: string,
	filterValue: string[]
) => {
	if (!filterValue || filterValue.length === 0) return true;
	const value = row.getValue(columnId);
	return filterValue.includes(String(value));
};

// Custom filter function for banned status
const bannedFilter = (
	row: Row<UserWithRole>,
	columnId: string,
	filterValue: string
) => {
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
			// className="h-8 px-2 -ml-2"
			className={`-ml-2 h-8 px-2 ${
				column.getCanSort()
					? "cursor-pointer select-none transition-colors hover:text-blue-400"
					: ""
			}`}
			onClick={() => column.toggleSorting()}
			variant="ghost"
		>
			{title}
			{{
				asc: <ArrowUp />,
				desc: <ArrowDown />,
			}[column.getIsSorted() as string] ?? null}
		</Button>
	);
};

// Filter functions that can be used globally
const userTableFilterFns = {
	roleFilter,
	bannedFilter,
};

// Custom filter component for select-type filters
function TableFilter({ column }: { column: any }) {
	const filterValue = column.getFilterValue();
	const filterOptions = column.columnDef.meta?.filterOptions;
	const filterVariant = column.columnDef.meta?.filterVariant;

	if (filterVariant === "select" && filterOptions) {
		return (
			<Select
				onValueChange={(value) =>
					column.setFilterValue(value === "all" ? undefined : value)
				}
				value={filterValue || ""}
			>
				<SelectTrigger className="w-[150px]">
					<SelectValue placeholder={`Filter ${column.id}...`} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All {column.id}</SelectItem>
					{filterOptions.map((option: any) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		);
	}

	return (
		<InputGroup>
			<InputGroupInput
				className="max-w-[200px]"
				onChange={(event) => column.setFilterValue(event.target.value)}
				placeholder={`Filter ${column.id}...`}
				value={filterValue || ""}
			/>
			{column.getIsFiltered() && (
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						className="size-8 p-0"
						onClick={() => column.setFilterValue(undefined)}
						size="sm"
						variant="ghost"
					>
						<X className="size-3.5" />
					</InputGroupButton>
				</InputGroupAddon>
			)}
		</InputGroup>
	);
}

export function DataTableSkeleton() {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<Skeleton className="h-10 w-[250px]" />
					<Skeleton className="h-10 w-[120px]" />
				</div>
				<Skeleton className="h-10 w-[120px]" />
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>
								<Skeleton className="h-4 w-[50px]" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-[200px]" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-[150px]" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-[100px]" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-20" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-[120px]" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-[100px]" />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 5 }).map((_, i) => (
							<TableRow key={i}>
								<TableCell>
									<Skeleton className="size-4" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-[200px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-[150px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-6 w-[120px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-6 w-20" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-[100px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="size-8" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

// User actions dropdown menu
function UserActionsMenu({
	user,
	mutations,
	onBanClick,
}: {
	user: UserWithRole;
	mutations: UserMutations;
	onBanClick: (userId: string) => void;
}) {
	const handleImpersonate = useCallback(() => {
		mutations.impersonateUser(user.id);
	}, [mutations.impersonateUser, user.id]);

	const handleRevokeSessions = useCallback(() => {
		mutations.revokeSessions(user.id);
	}, [mutations.revokeSessions, user.id]);

	const handleBanToggle = useCallback(() => {
		if (user.banned) {
			mutations.unbanUser(user.id);
		} else {
			onBanClick(user.id);
		}
	}, [user.banned, user.id, mutations.unbanUser, onBanClick]);

	const handleDelete = useCallback(() => {
		mutations.deleteUser(user.id);
	}, [mutations.deleteUser, user.id]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className="size-8 text-muted-foreground transition-colors hover:bg-muted/80 data-[state=open]:bg-muted"
					size="icon"
					variant="ghost"
				>
					<IconDotsVertical className="size-4" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[200px]">
				<DropdownMenuLabel className="font-semibold">Actions</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="gap-2"
					onClick={() => navigator.clipboard.writeText(user.id)}
				>
					<Copy className="size-4" />
					Copy user ID
				</DropdownMenuItem>
				<DropdownMenuItem
					className="gap-2"
					onClick={() => navigator.clipboard.writeText(user.email)}
				>
					<Mail className="size-4" />
					Copy email
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="gap-2" onClick={handleImpersonate}>
					<UserCircle className="size-4" />
					Impersonate
				</DropdownMenuItem>
				<DropdownMenuItem className="gap-2" onClick={handleRevokeSessions}>
					<RefreshCw className="size-4" />
					Revoke sessions
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="gap-2" onClick={handleBanToggle}>
					<Ban className="size-4" />
					{user.banned ? "Unban user" : "Ban user"}
				</DropdownMenuItem>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<DropdownMenuItem
							className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/20"
							onSelect={(e) => e.preventDefault()}
						>
							<Trash className="size-4" />
							Delete user
						</DropdownMenuItem>
					</AlertDialogTrigger>
					<AlertDialogContent className="max-w-md">
						<AlertDialogHeader>
							<AlertDialogTitle className="text-xl">
								Are you absolutely sure?
							</AlertDialogTitle>
							<AlertDialogDescription className="text-base">
								This action cannot be undone. This will permanently delete{" "}
								<span className="font-semibold text-foreground">
									{user.email}
								</span>{" "}
								and remove all their data from the servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
								onClick={handleDelete}
							>
								<Trash className="mr-2 size-4" />
								Delete User
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function DataTable({
	data,
	mutations,
	selfId,
	onExportData,
	onBanClick,
}: DataTableProps) {
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const [globalFilter, setGlobalFilter] = useState("");

	const columns = useMemo(
		() => [
			columnHelper.display({
				id: "select",
				header: ({ table }) => (
					<Checkbox
						aria-label="Select all"
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && "indeterminate")
						}
						onCheckedChange={(value) =>
							table.toggleAllPageRowsSelected(!!value)
						}
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
			}),

			columnHelper.accessor("email", {
				header: ({ column }) => (
					<SortableHeader column={column} title="Email" />
				),
				cell: ({ getValue, row }) => {
					const email = getValue();
					const user = row.original;
					const isSelf = user.id === selfId;
					return (
						<div className="flex items-center gap-2">
							<span className="block max-w-[200px] truncate font-medium">
								{email}
							</span>
							{!user.emailVerified && (
								<Badge variant="outline">Unverified</Badge>
							)}
							{isSelf && <Badge>You</Badge>}
						</div>
					);
				},
				enableColumnFilter: true,
				filterFn: "includesString",
			}),

			columnHelper.accessor("name", {
				header: ({ column }) => <SortableHeader column={column} title="Name" />,
				cell: ({ getValue }) => {
					const name = getValue();
					return (
						<div className="font-medium">
							{name || (
								<span className="text-muted-foreground text-sm italic">
									No name
								</span>
							)}
						</div>
					);
				},
				enableColumnFilter: true,
				filterFn: "includesString",
			}),

			columnHelper.accessor("role", {
				header: ({ column }) => <SortableHeader column={column} title="Role" />,
				cell: ({ row }) => {
					const user = row.original;

					return (
						<Select
							onValueChange={(value) => {
								mutations.changeRole({
									userId: user.id,
									role: value as "admin" | "user",
								});
							}}
							value={user.role ?? undefined}
						>
							<SelectTrigger className="h-9 w-[140px]">
								<SelectValue placeholder="Select role" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Select Role</SelectLabel>
									<SelectItem value="admin">
										<div className="flex items-center gap-2">
											<ShieldCheck className="size-4 text-purple-600" />
											<Badge
												className="font-semibold text-xs"
												variant="default"
											>
												Admin
											</Badge>
										</div>
									</SelectItem>
									<SelectItem value="user">
										<div className="flex items-center gap-2">
											<UserIcon className="size-4 text-blue-600" />
											<Badge
												className="font-semibold text-xs"
												variant="secondary"
											>
												User
											</Badge>
										</div>
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
			}),

			columnHelper.accessor("banned", {
				header: ({ column }) => (
					<SortableHeader column={column} title="Status" />
				),
				cell: ({ getValue }) => {
					const banned = getValue();
					return banned ? (
						<Badge className="font-semibold shadow-sm" variant="destructive">
							<Ban className="mr-1 size-3" />
							Banned
						</Badge>
					) : (
						<Badge
							className="border-green-200 bg-green-50 font-semibold text-green-700 shadow-sm hover:bg-green-100 dark:border-green-900 dark:bg-green-950 dark:text-green-400"
							variant="outline"
						>
							<div className="mr-1 size-2 rounded-full bg-green-500" />
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
			}),

			columnHelper.accessor("createdAt", {
				header: ({ column }) => (
					<SortableHeader column={column} title="Created" />
				),
				cell: ({ getValue }) => {
					const date = getValue();
					if (!date)
						return <span className="text-muted-foreground text-sm">-</span>;

					return (
						<Tooltip>
							<TooltipTrigger asChild>
								<span className="cursor-default font-medium text-sm">
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
			}),

			columnHelper.display({
				id: "actions",
				header: "Actions",
				cell: ({ row }) => (
					<UserActionsMenu
						user={row.original}
						mutations={mutations}
						onBanClick={onBanClick}
					/>
				),
				enableSorting: false,
				enableHiding: false,
			}),
		],
		[mutations, selfId, onBanClick]
	);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
			globalFilter,
		},
		getRowId: (row) => row.id.toString(),
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: "includesString",
		enableColumnFilters: true,
		filterFns: {
			...userTableFilterFns,
			fuzzy: (row, columnId, value) => {
				const searchValue = String(value).toLowerCase();
				const cellValue = String(row.getValue(columnId)).toLowerCase();
				return cellValue.includes(searchValue);
			},
		},
	});

	const isFiltered = columnFilters.length > 0 || globalFilter.length > 0;

	const clearAllFilters = () => {
		table.resetColumnFilters();
		setGlobalFilter("");
	};

	return (
		<div className="w-full space-y-4">
			{/* Global Search and Actions */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
					<InputGroup>
						<InputGroupInput
							className="w-full sm:w-[300px]"
							onChange={(e) => table.setGlobalFilter(String(e.target.value))}
							placeholder="Search users..."
							value={globalFilter}
						/>
						<InputGroupAddon>
							<SearchIcon />
						</InputGroupAddon>
						{globalFilter.length > 0 && (
							<InputGroupAddon align="inline-end">
								<InputGroupButton
									className="size-8 p-0"
									onClick={clearAllFilters}
									size="sm"
									variant="ghost"
								>
									<X className="size-3.5" />
								</InputGroupButton>
							</InputGroupAddon>
						)}
					</InputGroup>
				</div>
				<ButtonGroup>
					<ButtonGroup className="hidden sm:flex">
						{onExportData && (
							<Button
								className="gap-2"
								onClick={onExportData}
								size="default"
								variant="outline"
							>
								<Download className="size-4" />
								Export
							</Button>
						)}
					</ButtonGroup>
					<ButtonGroup>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className="pl-2!" variant="outline">
									<Layers className="size-4" />
									Columns
									<ChevronDownIcon />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="[--radius:1rem]">
								{table
									.getAllColumns()
									.filter(
										(column) =>
											typeof column.accessorFn !== "undefined" &&
											column.getCanHide()
									)
									.map((column) => (
										<DropdownMenuCheckboxItem
											checked={column.getIsVisible()}
											className="capitalize"
											key={column.id}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									))}
							</DropdownMenuContent>
						</DropdownMenu>
					</ButtonGroup>
				</ButtonGroup>
			</div>

			{/* Column Filters */}
			{table
				.getAllColumns()
				.filter((column) => column.getCanFilter() && column.getIsVisible())
				.length > 0 && (
				<Card className="border-2 bg-linear-to-br from-background to-muted/10 p-4">
					<div className="mb-3 flex items-center gap-2">
						<Filter className="size-4 text-muted-foreground" />
						<h3 className="font-semibold text-sm">Advanced Filters</h3>
					</div>
					<div className="flex flex-wrap gap-4">
						{table
							.getAllColumns()
							.filter(
								(column) => column.getCanFilter() && column.getIsVisible()
							)
							.map((column) => (
								<div className="flex flex-col space-y-1.5" key={column.id}>
									<Label className="font-medium text-muted-foreground text-xs capitalize">
										{column.id}
									</Label>
									<div className="flex items-center gap-2">
										<TableFilter column={column} />
									</div>
								</div>
							))}
					</div>
				</Card>
			)}

			{/* Table */}
			<div className="overflow-hidden rounded-xl border-2 bg-background shadow-sm">
				<Table>
					<TableHeader className="bg-muted/50">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} colSpan={header.colSpan}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									<Empty>
										<EmptyHeader>
											<EmptyMedia variant="icon">
												<UserX />
											</EmptyMedia>
											<EmptyTitle>
												{isFiltered
													? "No users match your filters"
													: "No users found"}
											</EmptyTitle>
											<EmptyDescription>
												{isFiltered
													? "Try adjusting your search or filter criteria"
													: "Get started by creating your first user"}
											</EmptyDescription>
										</EmptyHeader>
										{isFiltered && (
											<EmptyContent>
												<Button
													className="gap-2"
													onClick={clearAllFilters}
													size="sm"
													variant="outline"
												>
													<X className="size-4" />
													Clear all filters
												</Button>
											</EmptyContent>
										)}
									</Empty>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Footer with Stats and Pagination */}
			<div className="flex items-center justify-between px-4">
				<div className="hidden flex-1 text-muted-foreground text-sm lg:flex">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="flex w-full items-center gap-8 lg:w-fit">
					<div className="hidden items-center gap-2 lg:flex">
						<Label className="font-medium text-sm" htmlFor="rows-per-page">
							Rows per page
						</Label>
						<Select
							onValueChange={(value) => {
								table.setPageSize(Number(value));
							}}
							value={`${table.getState().pagination.pageSize}`}
						>
							<SelectTrigger className="w-20" id="rows-per-page" size="sm">
								<SelectValue
									placeholder={table.getState().pagination.pageSize}
								/>
							</SelectTrigger>
							<SelectContent side="top">
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex w-fit items-center justify-center font-medium text-sm">
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</div>
					<div className="ml-auto flex items-center gap-2 lg:ml-0">
						<Button
							className="hidden size-8 p-0 lg:flex"
							disabled={!table.getCanPreviousPage()}
							onClick={() => table.setPageIndex(0)}
							variant="outline"
						>
							<span className="sr-only">Go to first page</span>
							<IconChevronsLeft />
						</Button>
						<Button
							className="size-8"
							disabled={!table.getCanPreviousPage()}
							onClick={() => table.previousPage()}
							size="icon"
							variant="outline"
						>
							<span className="sr-only">Go to previous page</span>
							<IconChevronLeft />
						</Button>
						<Button
							className="size-8"
							disabled={!table.getCanNextPage()}
							onClick={() => table.nextPage()}
							size="icon"
							variant="outline"
						>
							<span className="sr-only">Go to next page</span>
							<IconChevronRight />
						</Button>
						<Button
							className="hidden size-8 lg:flex"
							disabled={!table.getCanNextPage()}
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							size="icon"
							variant="outline"
						>
							<span className="sr-only">Go to last page</span>
							<IconChevronsRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
