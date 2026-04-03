"use client";

import { useMemo, useState, useCallback } from "react";
import {
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAdminFetch } from "@/hooks/use-admin-fetch";
import { DataTableShell } from "@/components/admin/shared/DataTableShell";
import { ReceptionistGuest, getReceptionistGuestColumns } from "./ReceptionistGuestColumns";
import { ReceptionistGuestDetailSheet } from "./ReceptionistGuestDetailSheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

export function ReceptionistGuestTable() {
  const {
    data: guests,
    loading,
    search,
    setSearch,
    filters,
    setFilter,
    clearFilters,
    pagination,
    setPagination,
  } = useAdminFetch<ReceptionistGuest>({
    endpoint: "/api/receptionist/guests",
    dataKey: "users",
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedGuest, setSelectedGuest] = useState<ReceptionistGuest | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleViewDetails = useCallback((guest: ReceptionistGuest) => {
    setSelectedGuest(guest);
    setSheetOpen(true);
  }, []);

  const columns = useMemo(
    () => getReceptionistGuestColumns(handleViewDetails),
    [handleViewDetails]
  );

  const table = useReactTable({
    data: guests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  const hasFilters = !!search || !!filters.status;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-50 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.status || "all"}
          onValueChange={(value) => setFilter("status", value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="DELETED">Deleted</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <DataTableShell
        table={table}
        columns={columns}
        loading={loading}
        emptyMessage="No guests found."
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      <ReceptionistGuestDetailSheet
        guest={selectedGuest}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
