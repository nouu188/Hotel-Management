"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye, Copy, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { PaymentStatusBadge } from "../payments/PaymentStatusBadge";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import dayjs from "dayjs";
import { toast } from "sonner";
import { formatVND } from "../overview/KpiCardGrid";

export type AdminBooking = {
  id: string;
  fromDate: string;
  toDate: string;
  status: BookingStatus;
  createdAt: string;
  bookingGuest: { firstName: string; lastName: string; email: string } | null;
  bookingRoomItems: Array<{
    quantityBooked: number;
    hotelBranchRoomType: {
      roomType: { name: string };
      hotelBranch: { name: string };
    };
  }>;
  payment: { status: PaymentStatus; amount: number } | null;
  user: { name: string; email: string };
};

export function getAdminBookingColumns(
  onViewDetails: (booking: AdminBooking) => void,
  onUpdateStatus: (bookingId: string, status: "CONFIRMED" | "CANCELLED") => void
): ColumnDef<AdminBooking>[] {
  return [
    {
      accessorKey: "id",
      header: "Booking ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-500">
          #{row.original.id.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      id: "guestName",
      header: "Guest",
      cell: ({ row }) => {
        const guest = row.original.bookingGuest;
        return (
          <div>
            <p className="font-medium">
              {guest ? `${guest.firstName} ${guest.lastName}` : row.original.user.name}
            </p>
            <p className="text-xs text-slate-500">
              {guest?.email ?? row.original.user.email}
            </p>
          </div>
        );
      },
    },
    {
      id: "branch",
      header: "Branch",
      cell: ({ row }) => {
        const item = row.original.bookingRoomItems[0];
        return item?.hotelBranchRoomType.hotelBranch.name ?? "—";
      },
    },
    {
      id: "roomType",
      header: "Room Type",
      cell: ({ row }) => {
        const items = row.original.bookingRoomItems;
        if (!items.length) return "—";
        return items.map((i) => `${i.hotelBranchRoomType.roomType.name} (x${i.quantityBooked})`).join(", ");
      },
    },
    {
      accessorKey: "fromDate",
      header: ({ column }) => (
        <div className="flex cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Check-in <ArrowUpDown className="ml-1 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => dayjs(row.original.fromDate).format("MMM D, YYYY"),
    },
    {
      accessorKey: "toDate",
      header: "Check-out",
      cell: ({ row }) => dayjs(row.original.toDate).format("MMM D, YYYY"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <BookingStatusBadge status={row.original.status} />,
    },
    {
      id: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => {
        const payment = row.original.payment;
        if (!payment) return <span className="text-xs text-slate-400">No payment</span>;
        return <PaymentStatusBadge status={payment.status} />;
      },
    },
    {
      id: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const payment = row.original.payment;
        return payment ? formatVND(payment.amount) : "—";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => onViewDetails(booking)}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {
                navigator.clipboard.writeText(booking.id);
                toast.success("Booking ID copied!");
              }}>
                <Copy className="mr-2 h-4 w-4" />
                Copy ID
              </DropdownMenuItem>
              {booking.status === "PENDING" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => onUpdateStatus(booking.id, "CONFIRMED")}>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                    Confirm
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onUpdateStatus(booking.id, "CANCELLED")} className="text-red-600">
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
