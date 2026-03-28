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
import { AdminBill, getAdminBillColumns } from "./BillColumns";
import { BillDetailSheet } from "./BillDetailSheet";
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

const BILL_STATUS_OPTIONS = [
  { value: "UNPAID", label: "Unpaid" },
  { value: "PAID", label: "Paid" },
  { value: "PENDING", label: "Pending" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function BillTable() {
  const {
    data: bills,
    loading,
    search,
    setSearch,
    filters,
    setFilter,
    clearFilters,
    pagination,
    setPagination,
  } = useAdminFetch<AdminBill>({ endpoint: "/api/admin/bills", dataKey: "bills" });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleViewDetails = useCallback((bill: AdminBill) => {
    setSelectedBillId(bill.id);
    setSheetOpen(true);
  }, []);

  const columns = useMemo(
    () => getAdminBillColumns(handleViewDetails),
    [handleViewDetails]
  );

  const table = useReactTable({
    data: bills,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  const hasFilters = search || filters.status;

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Bills" description="View and manage hotel bills" />

      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-50 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by bill ID or guest name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.status || ""}
          onValueChange={(value) => setFilter("status", value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {BILL_STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
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
        emptyMessage="No bills found."
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      <BillDetailSheet
        billId={selectedBillId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
