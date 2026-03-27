"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Copy, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InventoryStatus } from "@prisma/client";
import { format } from "date-fns";
import { toast } from "sonner";

export type AdminBranch = {
  id: string;
  name: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  hotelBranchRoomTypes: Array<{
    id: string;
    quantity: number;
    status: InventoryStatus;
    roomType: { name: string };
  }>;
};

export function getAdminBranchColumns(
  onViewDetails: (branch: AdminBranch) => void,
  onEdit: (branch: AdminBranch) => void
): ColumnDef<AdminBranch>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      id: "roomTypes",
      header: "Room Types",
      cell: ({ row }) => {
        const names = [
          ...new Set(row.original.hotelBranchRoomTypes.map((rt) => rt.roomType.name)),
        ];
        if (!names.length) return <span className="text-slate-400">None</span>;
        return names.join(", ");
      },
    },
    {
      id: "totalRooms",
      header: "Total Rooms",
      cell: ({ row }) => {
        const total = row.original.hotelBranchRoomTypes.reduce(
          (sum, rt) => sum + rt.quantity,
          0
        );
        return total;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => format(new Date(row.original.createdAt), "MMM d, yyyy"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const branch = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onViewDetails(branch)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onEdit(branch)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  navigator.clipboard.writeText(branch.id);
                  toast.success("Branch ID copied!");
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
