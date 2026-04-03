"use client";

import { useCallback, useMemo, useState } from "react";
import {
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAdminFetch } from "@/hooks/use-admin-fetch";
import { DataTableShell } from "@/components/admin/shared/DataTableShell";
import { BookingDetailSheet } from "@/components/admin/bookings/BookingDetailSheet";
import { AdminBooking, getAdminBookingColumns } from "@/components/admin/bookings/AdminBookingColumns";
import { ReceptionistBookingFilters } from "./ReceptionistBookingFilters";
import { toast } from "sonner";

export function ReceptionistBookingTable() {
  const {
    data: bookings,
    loading,
    search,
    setSearch,
    filters,
    setFilter,
    clearFilters,
    pagination,
    setPagination,
    refresh,
  } = useAdminFetch<AdminBooking>({
    endpoint: "/api/receptionist/bookings",
    dataKey: "bookings",
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    bookingId: string;
    action: string;
  }>({ open: false, bookingId: "", action: "CONFIRMED" });

  const handleViewDetails = useCallback((booking: AdminBooking) => {
    setSelectedBooking(booking);
    setSheetOpen(true);
  }, []);

  const handleUpdateStatus = useCallback((bookingId: string, action: string) => {
    setConfirmDialog({ open: true, bookingId, action });
  }, []);

  const confirmStatusUpdate = async () => {
    try {
      const res = await fetch(`/api/receptionist/bookings/${confirmDialog.bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: confirmDialog.action }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Booking updated successfully`);
        refresh();
      } else {
        toast.error(data.message || "Failed to update booking");
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
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <div className="space-y-4">
      <ReceptionistBookingFilters
        search={search}
        onSearchChange={setSearch}
        status={filters.status ?? ""}
        onStatusChange={(v) => setFilter("status", v)}
        onClearFilters={clearFilters}
      />

      <DataTableShell
        table={table}
        columns={columns}
        loading={loading}
        emptyMessage="No bookings found."
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      <BookingDetailSheet
        booking={selectedBooking}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />

      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((p) => ({ ...p, open }))}
      >
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
            <Button
              variant="outline"
              onClick={() => setConfirmDialog((p) => ({ ...p, open: false }))}
            >
              No, go back
            </Button>
            <Button
              variant={confirmDialog.action === "CANCELLED" ? "destructive" : "default"}
              onClick={confirmStatusUpdate}
            >
              Yes,{" "}
              {
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
