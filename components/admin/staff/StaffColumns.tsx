"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { StaffRole, StaffStatus } from "@prisma/client";
import { format } from "date-fns";
import { toast } from "sonner";

export type AdminStaff = {
  id: string;
  name: string;
  role: StaffRole;
  status: StaffStatus;
  enrollDate: string;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
};

const roleBadgeVariant: Record<StaffRole, string> = {
  RECEPTIONIST: "bg-blue-100 text-blue-700",
  RESERVATION: "bg-purple-100 text-purple-700",
  CASHIER: "bg-green-100 text-green-700",
};

const statusBadgeVariant: Record<StaffStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  ON_LEAVE: "bg-yellow-100 text-yellow-700",
  TERMINATED: "bg-red-100 text-red-700",
};

export function getStaffColumns(
  onViewDetails: (staff: AdminStaff) => void
): ColumnDef<AdminStaff>[] {
  return [
    {
      accessorKey: "id",
      header: "Staff ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-500">
          #{row.original.id.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      id: "nameEmail",
      header: "Name / Email",
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-slate-500">{user?.email ?? "—"}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeVariant[row.original.role]}`}
        >
          {row.original.role}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeVariant[row.original.status]}`}
        >
          {row.original.status.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      accessorKey: "enrollDate",
      header: "Enroll Date",
      cell: ({ row }) => format(new Date(row.original.enrollDate), "MMM d, yyyy"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => onViewDetails(staff)}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  navigator.clipboard.writeText(staff.id);
                  toast.success("Staff ID copied!");
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
