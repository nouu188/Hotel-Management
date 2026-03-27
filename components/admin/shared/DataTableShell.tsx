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

interface DataTableShellProps<TData> {
  table: ReactTable<TData>;
  columns: ColumnDef<TData, any>[];
  loading: boolean;
  emptyMessage?: string;
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
  pagination,
  onPaginationChange,
}: DataTableShellProps<TData>) {
  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="p-4" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </tr>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
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
                <tr
                  key={row.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </tr>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {pagination.total} total items — Page {pagination.page} of{" "}
          {pagination.totalPages || 1}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onPaginationChange((p) => ({ ...p, page: p.page - 1 }))
            }
            disabled={pagination.page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onPaginationChange((p) => ({ ...p, page: p.page + 1 }))
            }
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
