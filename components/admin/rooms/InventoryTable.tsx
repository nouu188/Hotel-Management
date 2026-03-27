"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAdminFetch } from "@/hooks/use-admin-fetch";
import { DataTableShell } from "@/components/admin/shared/DataTableShell";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { BranchSelector } from "@/components/admin/shared/BranchSelector";
import { InventoryStatusBadge } from "./InventoryStatusBadge";
import { InventoryFormDialog } from "./InventoryFormDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { formatVND } from "@/components/admin/overview/KpiCardGrid";
import { InventoryStatus } from "@prisma/client";

export interface InventoryItem {
  id: string;
  hotelBranchId: string;
  roomTypeId: string;
  quantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  roomType: {
    id: string;
    name: string;
    capacity: number;
    price: number;
  };
  hotelBranch: {
    id: string;
    name: string;
  };
}

const inventoryStatuses = Object.values(InventoryStatus);

export function InventoryTable() {
  const {
    data: inventory,
    loading,
    filters,
    setFilter,
    clearFilters,
    pagination,
    setPagination,
    refresh,
  } = useAdminFetch<InventoryItem>({
    endpoint: "/api/admin/inventory",
    dataKey: "inventory",
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [branches, setBranches] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    fetch("/api/admin/branches?limit=100")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setBranches(json.data.branches.map((b: any) => ({ id: b.id, name: b.name })));
      })
      .catch(() => {});
  }, []);

  const handleEdit = useCallback((item: InventoryItem) => {
    setEditingItem(item);
    setFormOpen(true);
  }, []);

  const columns = useMemo<ColumnDef<InventoryItem, any>[]>(
    () => [
      {
        accessorKey: "hotelBranch.name",
        header: "Branch",
        cell: ({ row }) => row.original.hotelBranch.name,
      },
      {
        accessorKey: "roomType.name",
        header: "Room Type",
        cell: ({ row }) => row.original.roomType.name,
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
      },
      {
        accessorKey: "roomType.price",
        header: "Price/Night",
        cell: ({ row }) => formatVND(row.original.roomType.price),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <InventoryStatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)}>
            Edit
          </Button>
        ),
      },
    ],
    [handleEdit]
  );

  const table = useReactTable({
    data: inventory,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  const hasFilters = filters.branchId || filters.status;

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Room Inventory" description="Manage room allocations across branches">
        <Button onClick={() => { setEditingItem(null); setFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Assign Room Type
        </Button>
      </AdminPageHeader>

      <div className="flex flex-wrap items-center gap-3">
        <BranchSelector
          value={filters.branchId ?? "all"}
          onValueChange={(v) => setFilter("branchId", v === "all" ? "" : v)}
          branches={branches}
        />
        <Select
          value={filters.status ?? ""}
          onValueChange={(v) => setFilter("status", v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            {inventoryStatuses.map((s) => (
              <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" /> Clear
          </Button>
        )}
      </div>

      <DataTableShell
        table={table}
        columns={columns}
        loading={loading}
        emptyMessage="No inventory records found."
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      <InventoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        inventory={editingItem}
        branches={branches}
        onSuccess={refresh}
      />
    </div>
  );
}
