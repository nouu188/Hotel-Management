"use client";

import {
  flexRender,
  ColumnDef,
  Table as ReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 20, 50, 100];

interface DataTableShellProps<TData> {
  table: ReactTable<TData>;
  columns: ColumnDef<TData, any>[];
  loading: boolean;
  emptyMessage?: string;
  pageSizeOptions?: number[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPaginationChange: React.Dispatch<
    React.SetStateAction<{
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>
  >;
}

export function DataTableShell<TData>({
  table,
  columns,
  loading,
  emptyMessage = "No results found.",
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  pagination,
  onPaginationChange,
}: DataTableShellProps<TData>) {
  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="w-full rounded-md border bg-white overflow-hidden">
        <div className="max-h-[70vh] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b bg-slate-50/80">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap"
                      key={header.id}
                    >
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
              {loading ? (
                Array.from({ length: Math.min(pagination.limit, 10) }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((_, j) => (
                      <TableCell key={j} className="p-4">
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b hover:bg-slate-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-4">
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
                    className="h-24 text-center text-slate-500"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Rows per page</span>
          <Select
            value={String(pagination.limit)}
            onValueChange={(value) =>
              onPaginationChange((p) => ({
                ...p,
                limit: Number(value),
                page: 1,
              }))
            }
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-slate-500">
          {pagination.total > 0
            ? `Showing ${start}–${end} of ${pagination.total} records`
            : "No records"}
        </p>

        <div className="flex items-center gap-1">
          <span className="text-sm text-slate-500 mr-2">
            Page {pagination.page} of {pagination.totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              onPaginationChange((p) => ({ ...p, page: p.page - 1 }))
            }
            disabled={pagination.page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              onPaginationChange((p) => ({ ...p, page: p.page + 1 }))
            }
            disabled={pagination.page >= pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
