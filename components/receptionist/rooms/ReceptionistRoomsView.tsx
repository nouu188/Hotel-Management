"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { InventoryStatusBadge } from "@/components/admin/rooms/InventoryStatusBadge";
import { formatVND } from "@/components/admin/overview/KpiCardGrid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type RoomEntry = {
  id: string;
  roomType: { name: string; capacity: number; price: number };
  quantity: number;
  availableRooms: number;
  status: string;
};

type RoomGroup = {
  branch: { id: string; name: string; location: string };
  rooms: RoomEntry[];
};

export function ReceptionistRoomsView() {
  const [groups, setGroups] = useState<RoomGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");

  useEffect(() => {
    setLoading(true);
    fetch("/api/receptionist/rooms")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setGroups(json.data);
        } else {
          toast.error("Failed to load room availability");
        }
      })
      .catch(() => toast.error("Failed to load room availability"))
      .finally(() => setLoading(false));
  }, []);

  const branches = groups.map((g) => g.branch);

  const visibleGroups =
    selectedBranchId === "all"
      ? groups
      : groups.filter((g) => g.branch.id === selectedBranchId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="All Branches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      ) : visibleGroups.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-6 text-center text-sm text-slate-500">
          No room data available.
        </div>
      ) : (
        visibleGroups.map((group) => (
          <div key={group.branch.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-base font-semibold">{group.branch.name}</h2>
              <p className="text-sm text-muted-foreground">{group.branch.location}</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80">
                    <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Room Type
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Capacity
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Total Rooms
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Available
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Price / Night
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.rooms.map((room) => (
                    <TableRow key={room.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-medium">{room.roomType.name}</TableCell>
                      <TableCell>{room.roomType.capacity}</TableCell>
                      <TableCell>{room.quantity}</TableCell>
                      <TableCell>
                        <span
                          className={
                            room.availableRooms === 0
                              ? "text-red-600 font-medium"
                              : "text-emerald-600 font-medium"
                          }
                        >
                          {room.availableRooms}
                        </span>
                      </TableCell>
                      <TableCell>{formatVND(room.roomType.price)}</TableCell>
                      <TableCell>
                        <InventoryStatusBadge status={room.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
