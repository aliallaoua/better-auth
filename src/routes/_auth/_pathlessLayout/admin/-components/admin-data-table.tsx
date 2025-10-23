import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type RowSelectionState,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import {
	ChevronDown,
	Download,
	Filter,
	Search,
	UserCheck,
	Users,
	UserX,
	X,
} from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
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
import { Label } from "../../../../../components/ui/label";
import { userTableFilterFns } from "./columns";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	isLoading?: boolean;
	columnFilters: ColumnFiltersState;
	onColumnFiltersChange: Dispatch<SetStateAction<ColumnFiltersState>>;
	onExportData?: () => void;
}

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
		<Input
			className="max-w-[200px]"
			onChange={(event) => column.setFilterValue(event.target.value)}
			placeholder={`Filter ${column.id}...`}
			value={filterValue || ""}
		/>
	);
}

function DataTableSkeleton() {
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
								<Skeleton className="h-4 w-[80px]" />
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
									<Skeleton className="h-6 w-[80px]" />
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

function TableStats({
	filteredCount,
	totalCount,
	selectedCount,
}: {
	filteredCount: number;
	totalCount: number;
	selectedCount: number;
}) {
	return (
		<div className="flex items-center space-x-6 text-muted-foreground text-sm">
			<div className="flex items-center space-x-2">
				<Users className="size-4" />
				<span>
					{filteredCount} of {totalCount} users
				</span>
			</div>
			{selectedCount > 0 && (
				<div className="flex items-center space-x-2">
					<UserCheck className="size-4" />
					<span>{selectedCount} selected</span>
				</div>
			)}
		</div>
	);
}

export function DataTable<TData, TValue>({
	columns,
	data,
	isLoading = false,
	columnFilters,
	onColumnFiltersChange,
	onExportData,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "createdAt", desc: true },
	]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [globalFilter, setGlobalFilter] = useState("");

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: "includesString",
		enableRowSelection: true,
		enableColumnFilters: true,
		filterFns: {
			...userTableFilterFns,
			fuzzy: (row, columnId, value) => {
				const searchValue = String(value).toLowerCase();
				const cellValue = String(row.getValue(columnId)).toLowerCase();
				return cellValue.includes(searchValue);
			},
		},
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			globalFilter,
		},
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
	});

	const selectedRowCount = Object.keys(rowSelection).length;
	const filteredData = table.getFilteredRowModel().rows;
	const isFiltered = columnFilters.length > 0 || globalFilter.length > 0;

	const clearAllFilters = () => {
		table.resetColumnFilters();
		setGlobalFilter("");
	};

	if (isLoading) {
		return <DataTableSkeleton />;
	}

	return (
		<div className="w-full space-y-4">
			{/* Global Search and Actions */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<div className="relative">
						<Search className="absolute top-2.5 left-2 size-4 text-muted-foreground" />
						<Input
							className="w-[300px] pl-8"
							onChange={(event) => setGlobalFilter(event.target.value)}
							placeholder="Search users..."
							value={globalFilter}
						/>
					</div>
					{isFiltered && (
						<Button
							className="h-8 px-2 lg:px-3"
							onClick={clearAllFilters}
							variant="ghost"
						>
							Reset
							<X className="ml-2 size-4" />
						</Button>
					)}
				</div>
				<div className="flex items-center space-x-2">
					{onExportData && (
						<Button onClick={onExportData} size="sm" variant="outline">
							<Download className="mr-2 size-4" />
							Export
						</Button>
					)}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="sm" variant="outline">
								<Filter className="mr-2 size-4" />
								View
								<ChevronDown className="ml-2 size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-[150px]">
							<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{table
								.getAllColumns()
								.filter(
									(column) =>
										typeof column.accessorFn !== "undefined" &&
										column.getCanHide()
								)
								.map((column) => {
									return (
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
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Column Filters */}
			<Card className="p-4">
				<div className="flex flex-wrap gap-4">
					{table
						.getAllColumns()
						.filter((column) => column.getCanFilter() && column.getIsVisible())
						.map((column) => (
							<div className="flex flex-col space-y-1" key={column.id}>
								<Label className="font-medium text-sm capitalize">
									{column.id}
								</Label>
								<div className="flex items-center space-x-2">
									<TableFilter column={column} />
									{column.getIsFiltered() && (
										<Button
											className="h-8 px-2"
											onClick={() => column.setFilterValue(undefined)}
											size="sm"
											variant="ghost"
										>
											<X className="size-4" />
										</Button>
									)}
								</div>
							</div>
						))}
				</div>
			</Card>

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead className="whitespace-nowrap" key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									className="hover:bg-muted/50"
									data-state={row.getIsSelected() && "selected"}
									key={row.id}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell className="py-3" key={cell.id}>
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
									className="h-24 text-center"
									colSpan={columns.length}
								>
									<div className="flex flex-col items-center justify-center space-y-2">
										<UserX className="size-8 text-muted-foreground" />
										<p className="text-muted-foreground">
											{isFiltered
												? "No users match your filters."
												: "No users found."}
										</p>
										{isFiltered && (
											<Button
												onClick={clearAllFilters}
												size="sm"
												variant="outline"
											>
												Clear filters
											</Button>
										)}
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Footer with Stats and Pagination */}
			<div className="flex items-center justify-between">
				<TableStats
					filteredCount={filteredData.length}
					selectedCount={selectedRowCount}
					totalCount={data.length}
				/>
				<div className="flex items-center space-x-6 lg:space-x-8">
					<div className="flex items-center space-x-2">
						<p className="font-medium text-sm">Rows per page</p>
						<Select
							onValueChange={(value) => {
								table.setPageSize(Number(value));
							}}
							value={`${table.getState().pagination.pageSize}`}
						>
							<SelectTrigger className="h-8 w-[70px]">
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
					<div className="flex w-[100px] items-center justify-center font-medium text-sm">
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</div>
					<div className="flex items-center space-x-2">
						<Button
							className="size-8 p-0"
							disabled={!table.getCanPreviousPage()}
							onClick={() => table.setPageIndex(0)}
							variant="outline"
						>
							<span className="sr-only">Go to first page</span>
							{"<<"}
						</Button>
						<Button
							className="size-8 p-0"
							disabled={!table.getCanPreviousPage()}
							onClick={() => table.previousPage()}
							variant="outline"
						>
							<span className="sr-only">Go to previous page</span>
							{"<"}
						</Button>
						<Button
							className="size-8 p-0"
							disabled={!table.getCanNextPage()}
							onClick={() => table.nextPage()}
							variant="outline"
						>
							<span className="sr-only">Go to next page</span>
							{">"}
						</Button>
						<Button
							className="size-8 p-0"
							disabled={!table.getCanNextPage()}
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							variant="outline"
						>
							<span className="sr-only">Go to last page</span>
							{">>"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
