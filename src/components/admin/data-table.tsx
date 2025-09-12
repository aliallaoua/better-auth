import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	type UniqueIdentifier,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
} from '@tabler/icons-react';
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type Row,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from '@tanstack/react-table';
import { ChevronDown, Download, Filter, Search, UserX, X } from 'lucide-react';
import {
	type Dispatch,
	type SetStateAction,
	useId,
	useMemo,
	useState,
} from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Label } from '../ui/label';
import { type User, userTableFilterFns } from './columns';

interface DataTableProps<User> {
	columns: ColumnDef<User>[];
	data: User[];
	onExportData?: () => void;
}

// Custom filter component for select-type filters
function TableFilter({ column }: { column: any }) {
	const filterValue = column.getFilterValue();
	const filterOptions = column.columnDef.meta?.filterOptions;
	const filterVariant = column.columnDef.meta?.filterVariant;

	if (filterVariant === 'select' && filterOptions) {
		return (
			<Select
				onValueChange={(value) =>
					column.setFilterValue(value === 'all' ? undefined : value)
				}
				value={filterValue || ''}
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
			value={filterValue || ''}
		/>
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

// Row Component
function DraggableRow({ row }: { row: Row<User> }) {
	const { transform, transition, setNodeRef, isDragging } = useSortable({
		id: row.original.id,
	});

	return (
		<TableRow
			className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
			data-dragging={isDragging}
			data-state={row.getIsSelected() && 'selected'}
			ref={setNodeRef}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
			}}
		>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</TableRow>
	);
}

export function DataTable<User>({
	columns,
	data: initialData,
	onExportData,
}: DataTableProps<User>) {
	// const [sorting, setSorting] = useState<SortingState>([
	// 	{ id: 'createdAt', desc: true },
	// ]);
	const [data, setData] = useState(() => initialData);
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const sortableId = useId();
	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {})
	);

	const dataIds = useMemo<UniqueIdentifier[]>(
		() => data?.map(({ id }) => id) || [],
		[data]
	);

	const [globalFilter, setGlobalFilter] = useState('');

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
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
		globalFilterFn: 'includesString',
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

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			setData((data) => {
				const oldIndex = dataIds.indexOf(active.id);
				const newIndex = dataIds.indexOf(over.id);
				return arrayMove(data, oldIndex, newIndex);
			});
		}
	}

	const isFiltered = columnFilters.length > 0 || globalFilter.length > 0;

	const clearAllFilters = () => {
		table.resetColumnFilters();
		setGlobalFilter('');
	};

	return (
		<div className="w-full space-y-4">
			{/* Global Search and Actions */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<div className="relative">
						<Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
						<Input
							className="pl-8 w-[300px]"
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
										typeof column.accessorFn !== 'undefined' &&
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
								<Label className="text-sm font-medium capitalize">
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
			<div className="overflow-hidden rounded-lg border">
				<DndContext
					collisionDetection={closestCenter}
					id={sortableId}
					modifiers={[restrictToVerticalAxis]}
					onDragEnd={handleDragEnd}
					sensors={sensors}
				>
					<Table>
						<TableHeader className="sticky top-0 z-10 bg-muted">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead colSpan={header.colSpan} key={header.id}>
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
						<TableBody className="**:data-[slot=table-cell]:first:w-8">
							{table.getRowModel().rows?.length ? (
								<SortableContext
									items={dataIds}
									strategy={verticalListSortingStrategy}
								>
									{table.getRowModel().rows.map((row) => (
										<DraggableRow key={row.id} row={row} />
									))}
								</SortableContext>
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
													? 'No users match your filters.'
													: 'No users found.'}
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
				</DndContext>
			</div>

			{/* Footer with Stats and Pagination */}
			<div className="flex items-center justify-between px-4">
				<div className="hidden flex-1 text-muted-foreground text-sm lg:flex">
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
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
						Page {table.getState().pagination.pageIndex + 1} of{' '}
						{table.getPageCount()}
					</div>
					<div className="ml-auto flex items-center gap-2 lg:ml-0">
						<Button
							className="hidden h-8 w-8 p-0 lg:flex"
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
