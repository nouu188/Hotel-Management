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
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminBranch, getAdminBranchColumns } from "./BranchColumns";
import { BranchFormDialog } from "./BranchFormDialog";
import { BranchDetailSheet } from "./BranchDetailSheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

export function BranchTable() {
  const {
    data: branches,
    loading,
    search,
    setSearch,
    pagination,
    setPagination,
    refresh,
  } = useAdminFetch<AdminBranch>({ endpoint: "/api/admin/branches", dataKey: "branches" });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedBranch, setSelectedBranch] = useState<AdminBranch | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<AdminBranch | null>(null);

  const handleViewDetails = useCallback((branch: AdminBranch) => {
    setSelectedBranch(branch);
    setSheetOpen(true);
  }, []);

  const handleEdit = useCallback((branch: AdminBranch) => {
    setEditingBranch(branch);
    setFormDialogOpen(true);
  }, []);

  const columns = useMemo(
    () => getAdminBranchColumns(handleViewDetails, handleEdit),
    [handleViewDetails, handleEdit]
  );

  const table = useReactTable({
    data: branches,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Branches" description="Manage hotel branches and locations">
        <Button onClick={() => { setEditingBranch(null); setFormDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Branch
        </Button>
      </AdminPageHeader>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-50 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTableShell
        table={table}
        columns={columns}
        loading={loading}
        emptyMessage="No branches found."
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      <BranchDetailSheet
        branch={selectedBranch}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />

      <BranchFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        branch={editingBranch}
        onSuccess={refresh}
      />
    </div>
  );
}
