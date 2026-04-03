"use client";

import { useCallback, useMemo, useState } from "react";
import {
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAdminFetch } from "@/hooks/use-admin-fetch";
import { DataTableShell } from "@/components/admin/shared/DataTableShell";
import { AdminStaff, getStaffColumns } from "./StaffColumns";
import { StaffFilters } from "./StaffFilters";
import { StaffDetailSheet } from "./StaffDetailSheet";
import { CreateStaffDialog } from "./CreateStaffDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function StaffTable() {
  const {
    data: staff,
    loading,
    search,
    setSearch,
    filters,
    setFilter,
    clearFilters,
    pagination,
    setPagination,
    refresh,
  } = useAdminFetch<AdminStaff>({
    endpoint: "/api/admin/staff",
    dataKey: "staff",
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedStaff, setSelectedStaff] = useState<AdminStaff | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleViewDetails = useCallback((s: AdminStaff) => {
    setSelectedStaff(s);
    setSheetOpen(true);
  }, []);

  const columns = useMemo(
    () => getStaffColumns(handleViewDetails),
    [handleViewDetails]
  );

  const table = useReactTable({
    data: staff,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <StaffFilters
          search={search}
          onSearchChange={setSearch}
          role={filters.role ?? ""}
          onRoleChange={(v) => setFilter("role", v)}
          status={filters.status ?? ""}
          onStatusChange={(v) => setFilter("status", v)}
          onClearFilters={clearFilters}
        />
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <DataTableShell
        table={table}
        columns={columns}
        loading={loading}
        emptyMessage="No staff found."
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      <StaffDetailSheet
        staff={selectedStaff}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onUpdate={refresh}
      />

      <CreateStaffDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={refresh}
      />
    </div>
  );
}
