"use client";

import { useState } from "react";
import { useAdminFetch } from "@/hooks/use-admin-fetch";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { RoomTypeCard, RoomTypeWithBranches } from "./RoomTypeCard";
import { RoomTypeFormDialog } from "./RoomTypeFormDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export function RoomTypeGrid() {
  const {
    data: roomTypes,
    loading,
    search,
    setSearch,
    pagination,
    setPagination,
    refresh,
  } = useAdminFetch<RoomTypeWithBranches>({
    endpoint: "/api/admin/room-types",
    dataKey: "roomTypes",
    limit: 12,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomTypeWithBranches | null>(null);

  const handleEdit = (roomType: RoomTypeWithBranches) => {
    setEditingRoom(roomType);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Room Types" description="Manage room types and configurations">
        <Button onClick={() => { setEditingRoom(null); setFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Room Type
        </Button>
      </AdminPageHeader>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search room types..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : roomTypes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No room types found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roomTypes.map((rt) => (
            <RoomTypeCard key={rt.id} roomType={rt} onEdit={handleEdit} />
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Rows per page</span>
          <Select
            value={String(pagination.limit)}
            onValueChange={(value) =>
              setPagination((p) => ({
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
              {[5, 12, 20, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-slate-500">
          {pagination.total > 0
            ? `Showing ${(pagination.page - 1) * pagination.limit + 1}\u2013${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} room types`
            : "No room types"}
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
              setPagination((p) => ({ ...p, page: p.page - 1 }))
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
              setPagination((p) => ({ ...p, page: p.page + 1 }))
            }
            disabled={pagination.page >= pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <RoomTypeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        roomType={editingRoom}
        onSuccess={refresh}
      />
    </div>
  );
}
