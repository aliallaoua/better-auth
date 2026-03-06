"use no memo";

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
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
	Copy,
	Download,
	Layers,
	Mail,
	MoreVerticalIcon,
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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
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
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
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

const shortDateFormat = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
});

const fullDateFormat = new Intl.DateTimeFormat("en-US", {
	dateStyle: "full",
	timeStyle: "short",
});

const pageSizeItems = [
	{ label: "10", value: 10 },
	{ label: "20", value: 20 },
	{ label: "50", value: 50 },
];

interface UserMutations {
	deleteUser: (userId: string) => void;
	revokeSessions: (userId: string) => void;
	impersonateUser: (userId: string) => void;
	unbanUser: (userId: string) => void;
	changeRole: (params: { userId: string; role: "admin" | "user" }) => void;
	isRoleChanging: boolean;
	changingRoleUserId: string | null;
}

interface DataTableProps {
	data: UserWithRole[];
	mutations: UserMutations;
	selfId: string | undefined;
	onExportData?: () => void;
	onBanClick: (userId: string) => void;
}

const userRoles = [
	{
		label: (
			<div className="flex items-center gap-2">
				<ShieldCheck className="size-4 text-purple-600" />
				Admin
			</div>
		),
		value: "admin",
	},
	{
		label: (
			<div className="flex items-center gap-2">
				<UserIcon className="size-4 text-blue-600" />
				User
			</div>
		),
		value: "user",
	},
];

const columnHelper = createColumnHelper<UserWithRole>();

const roleFilter = (
	row: Row<UserWithRole>,
	columnId: string,
	filterValue: string[],
) => {
	if (!filterValue || filterValue.length === 0) return true;
	const value = row.getValue(columnId);
	return filterValue.includes(String(value));
};

const bannedFilter = (
	row: Row<UserWithRole>,
	columnId: string,
	filterValue: string,
) => {
	if (!filterValue) return true;
	const value = row.getValue(columnId);
	if (filterValue === "banned") return value === true;
	if (filterValue === "active") return value === false;
	return true;
};

const SortableHeader = ({ column, title }: { column: any; title: string }) => (
	<Button
		className={`-ml-2 h-8 px-2 ${column.getCanSort() ? "cursor-pointer select-none" : ""}`}
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

const userTableFilterFns = { roleFilter, bannedFilter };

function TableFilter({ column }: { column: any }) {
	const filterValue = column.getFilterValue();
	const filterOptions = column.columnDef.meta?.filterOptions;
	const filterVariant = column.columnDef.meta?.filterVariant;

	if (filterVariant === "select" && filterOptions) {
		return (
			<Select
				items={[...filterOptions]}
				onValueChange={(value) =>
					column.setFilterValue(value === null ? undefined : value)
				}
				value={filterValue || null}
			>
				<SelectTrigger className="h-8 w-[130px] text-xs">
					<SelectValue placeholder={`${column.id}...`} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{filterOptions.map(
							(option: { value: string; label: string }) => (
								<SelectItem
									key={option.value || "all"}
									value={option.value}
								>
									{option.label}
								</SelectItem>
							),
						)}
					</SelectGroup>
				</SelectContent>
			</Select>
		);
	}

	return (
		<InputGroup>
			<InputGroupInput
				className="h-8 max-w-[180px] text-xs"
				onChange={(event) => column.setFilterValue(event.target.value)}
				placeholder={`${column.id}...`}
				value={filterValue || ""}
			/>
			{column.getIsFiltered() && (
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						className="size-7 p-0"
						onClick={() => column.setFilterValue(undefined)}
						size="sm"
						variant="ghost"
					>
						<X className="size-3" />
					</InputGroupButton>
				</InputGroupAddon>
			)}
		</InputGroup>
	);
}

export function DataTableSkeleton() {
	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<Skeleton className="h-8 w-[250px]" />
				<Skeleton className="h-8 w-[100px]" />
			</div>
			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							{Array.from({ length: 7 }).map((_, i) => (
								<TableHead key={i}>
									<Skeleton className="h-4 w-20" />
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 5 }).map((_, i) => (
							<TableRow key={i}>
								{Array.from({ length: 7 }).map((_, j) => (
									<TableCell key={j}>
										<Skeleton className="h-4 w-full max-w-[120px]" />
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

function UserActionsMenu({
	user,
	mutations,
	onBanClick,
}: {
	user: UserWithRole;
	mutations: UserMutations;
	onBanClick: (userId: string) => void;
}) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
		setDeleteDialogOpen(false);
	}, [mutations.deleteUser, user.id]);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							className="size-7 text-muted-foreground data-[state=open]:bg-muted"
							size="icon"
							variant="ghost"
						>
							<MoreVerticalIcon className="size-4" />
							<span className="sr-only">Open menu</span>
						</Button>
					}
				/>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuGroup>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="gap-2"
						onClick={() => navigator.clipboard.writeText(user.id)}
					>
						<Copy className="size-3.5" />
						Copy user ID
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2"
						onClick={() =>
							navigator.clipboard.writeText(user.email)
						}
					>
						<Mail className="size-3.5" />
						Copy email
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="gap-2"
						onClick={handleImpersonate}
					>
						<UserCircle className="size-3.5" />
						Impersonate
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2"
						onClick={handleRevokeSessions}
					>
						<RefreshCw className="size-3.5" />
						Revoke sessions
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="gap-2"
						onClick={handleBanToggle}
					>
						<Ban className="size-3.5" />
						{user.banned ? "Unban user" : "Ban user"}
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/20"
						onClick={(e) => {
							e.preventDefault();
							setDeleteDialogOpen(true);
						}}
					>
						<Trash className="size-3.5" />
						Delete user
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			>
				<AlertDialogContent className="max-w-md">
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you absolutely sure?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete{" "}
							<span className="font-semibold text-foreground">
								{user.email}
							</span>{" "}
							and remove all their data.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-red-600 hover:bg-red-700"
							onClick={handleDelete}
						>
							<Trash className="mr-2 size-4" />
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
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
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{},
	);
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
							(table.getIsSomePageRowsSelected() &&
								"indeterminate")
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
						onCheckedChange={(value) =>
							row.toggleSelected(!!value)
						}
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
						<div className="flex items-center gap-1.5">
							<span className="max-w-[200px] truncate font-medium text-sm">
								{email}
							</span>
							{!user.emailVerified && (
								<Badge variant="outline" className="text-[10px]">
									Unverified
								</Badge>
							)}
							{isSelf && (
								<Badge className="text-[10px]">You</Badge>
							)}
						</div>
					);
				},
				enableColumnFilter: true,
				filterFn: "includesString",
			}),

			columnHelper.accessor("name", {
				header: ({ column }) => (
					<SortableHeader column={column} title="Name" />
				),
				cell: ({ getValue }) => {
					const name = getValue();
					return name ? (
						<span className="font-medium text-sm">{name}</span>
					) : (
						<span className="text-muted-foreground text-xs italic">
							No name
						</span>
					);
				},
				enableColumnFilter: true,
				filterFn: "includesString",
			}),

			columnHelper.accessor("role", {
				header: ({ column }) => (
					<SortableHeader column={column} title="Role" />
				),
				cell: ({ row }) => {
					const user = row.original;
					return (
						<Select
							items={userRoles}
							onValueChange={(value) => {
								mutations.changeRole({
									userId: user.id,
									role: value as "admin" | "user",
								});
							}}
							value={user.role ?? undefined}
						>
							<SelectTrigger className="h-8 w-[120px] text-xs">
								<SelectValue />
								{mutations.isRoleChanging &&
									mutations.changingRoleUserId ===
										user.id && <Spinner />}
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{userRoles.map((role) => (
										<SelectItem
											key={role.value}
											value={role.value}
										>
											<Badge
												variant={
													role.value === "admin"
														? "default"
														: "secondary"
												}
											>
												{role.value === "admin" ? (
													<ShieldCheck className="text-purple-600" />
												) : (
													<UserIcon className="text-blue-600" />
												)}
												{role.value === "admin"
													? "Admin"
													: "User"}
											</Badge>
										</SelectItem>
									))}
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
						<Badge variant="destructive" className="text-xs">
							<Ban className="mr-1 size-3" />
							Banned
						</Badge>
					) : (
						<Badge
							variant="outline"
							className="border-emerald-200 bg-emerald-50 text-emerald-700 text-xs dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400"
						>
							<div className="mr-1 size-1.5 rounded-full bg-emerald-500" />
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
						return (
							<span className="text-muted-foreground text-xs">
								-
							</span>
						);
					return (
						<Tooltip>
							<TooltipTrigger
								render={
									<span className="cursor-default text-muted-foreground text-xs">
										{shortDateFormat.format(date)}
									</span>
								}
							/>
							<TooltipContent>
								<p>{fullDateFormat.format(date)}</p>
							</TooltipContent>
						</Tooltip>
					);
				},
				enableColumnFilter: false,
				enableSorting: true,
			}),

			columnHelper.display({
				id: "actions",
				header: "",
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
		[mutations, selfId, onBanClick],
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

	const filterableVisibleColumns = table
		.getAllColumns()
		.filter((column) => column.getCanFilter() && column.getIsVisible());

	return (
		<div className="w-full space-y-3">
			{/* Toolbar */}
			<div className="flex items-center gap-2">
				<InputGroup className="flex-1 sm:flex-initial">
					<InputGroupInput
						className="h-8 w-full text-sm sm:w-[260px]"
						onChange={(e) =>
							table.setGlobalFilter(String(e.target.value))
						}
						placeholder="Search users..."
						value={globalFilter}
					/>
					<InputGroupAddon>
						<SearchIcon />
					</InputGroupAddon>
					{globalFilter.length > 0 && (
						<InputGroupAddon align="inline-end">
							<InputGroupButton
								className="size-7 p-0"
								onClick={clearAllFilters}
								size="sm"
								variant="ghost"
							>
								<X className="size-3" />
							</InputGroupButton>
						</InputGroupAddon>
					)}
				</InputGroup>

				<div className="ml-auto flex items-center gap-2">
					{onExportData && (
						<Button
							className="hidden gap-1.5 sm:flex"
							onClick={onExportData}
							size="sm"
							variant="outline"
						>
							<Download className="size-3.5" />
							Export
						</Button>
					)}
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									className="pl-2!"
									size="sm"
									variant="outline"
								>
									<Layers className="size-3.5" />
									Columns
									<ChevronDownIcon />
								</Button>
							}
						/>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter(
									(column) =>
										typeof column.accessorFn !==
											"undefined" &&
										column.getCanHide(),
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
				</div>
			</div>

			{/* Inline filters */}
			{filterableVisibleColumns.length > 0 && (
				<div className="flex flex-wrap items-end gap-3">
					{filterableVisibleColumns.map((column) => (
						<div className="space-y-1" key={column.id}>
							<Label className="text-muted-foreground text-[10px] uppercase tracking-wider">
								{column.id}
							</Label>
							<TableFilter column={column} />
						</div>
					))}
					{isFiltered && (
						<Button
							className="mb-px gap-1 text-xs"
							onClick={clearAllFilters}
							size="sm"
							variant="ghost"
						>
							<X className="size-3" />
							Clear
						</Button>
					)}
				</div>
			)}

			{/* Table */}
			<div className="overflow-hidden rounded-lg border">
				<Table>
					<TableHeader className="bg-muted/40">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										colSpan={header.colSpan}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef
														.header,
													header.getContext(),
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
									data-state={
										row.getIsSelected() && "selected"
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
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
													className="gap-1.5"
													onClick={clearAllFilters}
													size="sm"
													variant="outline"
												>
													<X className="size-3.5" />
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

			{/* Pagination */}
			<div className="flex items-center justify-between text-sm">
				<span className="hidden text-muted-foreground text-xs lg:block">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} selected
				</span>
				<div className="flex w-full items-center gap-6 lg:w-fit">
					<div className="hidden items-center gap-2 lg:flex">
						<Label
							className="text-muted-foreground text-xs"
							htmlFor="rows-per-page"
						>
							Rows
						</Label>
						<Select
							items={pageSizeItems}
							onValueChange={(value) =>
								table.setPageSize(Number(value))
							}
							value={table.getState().pagination.pageSize}
						>
							<SelectTrigger
								className="h-7 w-16 text-xs"
								id="rows-per-page"
								size="sm"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent side="top">
								<SelectGroup>
									{pageSizeItems.map((item) => (
										<SelectItem
											key={item.value}
											value={item.value}
										>
											{item.label}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<span className="tabular-nums text-muted-foreground text-xs">
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</span>
					<ButtonGroup className="ml-auto lg:ml-0">
						<Button
							className="hidden size-7 lg:flex"
							disabled={!table.getCanPreviousPage()}
							onClick={() => table.setPageIndex(0)}
							size="icon"
							variant="outline"
						>
							<span className="sr-only">Go to first page</span>
							<ChevronsLeftIcon />
						</Button>
						<Button
							className="size-7"
							disabled={!table.getCanPreviousPage()}
							onClick={() => table.previousPage()}
							size="icon"
							variant="outline"
						>
							<span className="sr-only">Previous page</span>
							<ChevronLeftIcon />
						</Button>
						<Button
							className="size-7"
							disabled={!table.getCanNextPage()}
							onClick={() => table.nextPage()}
							size="icon"
							variant="outline"
						>
							<span className="sr-only">Next page</span>
							<ChevronRightIcon />
						</Button>
						<Button
							className="hidden size-7 lg:flex"
							disabled={!table.getCanNextPage()}
							onClick={() =>
								table.setPageIndex(table.getPageCount() - 1)
							}
							size="icon"
							variant="outline"
						>
							<span className="sr-only">Go to last page</span>
							<ChevronsRightIcon />
						</Button>
					</ButtonGroup>
				</div>
			</div>
		</div>
	);
}
