"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminBookingFilters } from "./AdminBookingFilters";
import { BookingDetailSheet } from "./BookingDetailSheet";
import { AdminBooking, getAdminBookingColumns } from "./AdminBookingColumns";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function AdminBookingTable() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    bookingId: string;
    action: string;
  }>({ open: false, bookingId: "", action: "CONFIRMED" });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await api.admin.bookings.getAll(params);
      if (res.success && res.data) {
        const data = res.data as any;
        setBookings(data.bookings);
        setPagination((prev) => ({ ...prev, ...data.pagination }));
      }
    } catch {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter, search]);

  useEffect(() => {
    const timeout = setTimeout(fetchBookings, 300);
    return () => clearTimeout(timeout);
  }, [fetchBookings]);

  const handleViewDetails = useCallback((booking: AdminBooking) => {
    setSelectedBooking(booking);
    setSheetOpen(true);
  }, []);

  const handleUpdateStatus = useCallback((bookingId: string, action: string) => {
    setConfirmDialog({ open: true, bookingId, action });
  }, []);

  const confirmStatusUpdate = async () => {
    try {
      const res = await api.admin.bookings.updateStatus(confirmDialog.bookingId, confirmDialog.action);
      if (res.success) {
        toast.success(`Booking ${confirmDialog.action.toLowerCase()} successfully`);
        fetchBookings();
      } else {
        toast.error(res.message || "Failed to update booking");
      }
    } catch {
      toast.error("Failed to update booking status");
    } finally {
      setConfirmDialog({ open: false, bookingId: "", action: "CONFIRMED" });
    }
  };

  const columns = useMemo(
    () => getAdminBookingColumns(handleViewDetails, handleUpdateStatus),
    [handleViewDetails, handleUpdateStatus]
  );

  const table = useReactTable({
    data: bookings,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { sorting, columnFilters },
  });

  return (
    <div className="space-y-4">
      <AdminBookingFilters
        search={search}
        onSearchChange={(v) => { setSearch(v); setPagination((p) => ({ ...p, page: 1 })); }}
        status={statusFilter}
        onStatusChange={(v) => { setStatusFilter(v); setPagination((p) => ({ ...p, page: 1 })); }}
        onClearFilters={() => { setSearch(""); setStatusFilter(""); setPagination((p) => ({ ...p, page: 1 })); }}
      />

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="p-4" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {pagination.total} total bookings — Page {pagination.page} of {pagination.totalPages || 1}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
            disabled={pagination.page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <BookingDetailSheet
        booking={selectedBooking}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />

      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog((p) => ({ ...p, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {
                {
                  CONFIRMED: "Confirm Booking",
                  CANCELLED: "Cancel Booking",
                  CHECKED_IN: "Check In Guest",
                  CHECKED_OUT: "Check Out Guest",
                }[confirmDialog.action] ?? "Update Booking"
              }
            </DialogTitle>
            <DialogDescription>
              {
                {
                  CONFIRMED: "Are you sure you want to confirm this booking?",
                  CANCELLED: "Are you sure you want to cancel this booking? Room availability will be released.",
                  CHECKED_IN: "Are you sure you want to check in this guest?",
                  CHECKED_OUT: "Are you sure you want to check out this guest?",
                }[confirmDialog.action] ?? "Are you sure you want to update this booking?"
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog((p) => ({ ...p, open: false }))}>
              No, go back
            </Button>
            <Button
              variant={confirmDialog.action === "CANCELLED" ? "destructive" : "default"}
              onClick={confirmStatusUpdate}
            >
              Yes, {
                {
                  CONFIRMED: "confirm",
                  CANCELLED: "cancel",
                  CHECKED_IN: "check in",
                  CHECKED_OUT: "check out",
                }[confirmDialog.action] ?? "update"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
