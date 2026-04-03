"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Copy, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserStatus } from "@prisma/client";
import { format } from "date-fns";
import { toast } from "sonner";
import { GuestStatusBadge } from "@/components/admin/guests/GuestStatusBadge";

export type ReceptionistGuest = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  status: UserStatus;
  createdAt: string;
  _count: { booking: number };
};

export function getReceptionistGuestColumns(
  onViewDetails: (guest: ReceptionistGuest) => void
): ColumnDef<ReceptionistGuest>[] {
  return [
    {
      id: "guest",
      header: "Guest",
      cell: ({ row }) => {
        const { name, email } = row.original;
        return (
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{name}</p>
            <p className="text-xs text-slate-500 truncate">{email}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) =>
        row.original.phoneNumber || <span className="text-slate-400">N/A</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <GuestStatusBadge status={row.original.status} />,
    },
    {
      id: "totalBookings",
      header: "Bookings",
      cell: ({ row }) => row.original._count.booking,
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => format(new Date(row.original.createdAt), "MMM d, yyyy"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const guest = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onViewDetails(guest)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  navigator.clipboard.writeText(guest.email);
                  toast.success("Email copied!");
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
