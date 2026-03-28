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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserStatus } from "@prisma/client";
import { format } from "date-fns";
import { toast } from "sonner";
import { GuestStatusBadge } from "./GuestStatusBadge";
import { formatVND } from "@/components/admin/overview/KpiCardGrid";

export type AdminGuest = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  image: string | null;
  status: UserStatus;
  createdAt: string;
  _count: { booking: number };
  totalSpent: number;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getGuestColumns(
  onViewProfile: (guest: AdminGuest) => void
): ColumnDef<AdminGuest>[] {
  return [
    {
      id: "guest",
      header: "Guest",
      cell: ({ row }) => {
        const { name, email, image } = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={image ?? undefined} alt={name} />
              <AvatarFallback className="text-xs">{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{name}</p>
              <p className="text-xs text-slate-500 truncate">{email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => row.original.phoneNumber || <span className="text-slate-400">N/A</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <GuestStatusBadge status={row.original.status} />,
    },
    {
      id: "totalBookings",
      header: "Total Bookings",
      cell: ({ row }) => row.original._count.booking,
    },
    {
      id: "totalSpent",
      header: "Total Spent",
      cell: ({ row }) => formatVND(row.original.totalSpent),
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
              <DropdownMenuItem onSelect={() => onViewProfile(guest)}>
                <Eye className="mr-2 h-4 w-4" />
                View Profile
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
