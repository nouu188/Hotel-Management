"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { PaymentStatus } from "@prisma/client";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { formatVND } from "../overview/KpiCardGrid";

export type AdminPayment = {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripePaymentIntent: string | null;
  paidAt: string | null;
  createdAt: string;
  booking: {
    id: string;
    fromDate: string;
    toDate: string;
    status: string;
    bookingGuest: { firstName: string; lastName: string; email: string } | null;
  };
};

export function getAdminPaymentColumns(
  onViewDetails: (payment: AdminPayment) => void
): ColumnDef<AdminPayment>[] {
  return [
    {
      accessorKey: "id",
      header: "Payment ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-500">
          #{row.original.id.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: "bookingId",
      header: "Booking ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-500">
          #{row.original.bookingId.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      id: "guestName",
      header: "Guest",
      cell: ({ row }) => {
        const guest = row.original.booking?.bookingGuest;
        return guest ? `${guest.firstName} ${guest.lastName}` : "—";
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <div
          className="flex cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount <ArrowUpDown className="ml-1 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => formatVND(row.original.amount),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <PaymentStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "paidAt",
      header: ({ column }) => (
        <div
          className="flex cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Paid At <ArrowUpDown className="ml-1 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) =>
        row.original.paidAt
          ? format(parseISO(row.original.paidAt), "MMM d, yyyy HH:mm")
          : "—",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) =>
        format(parseISO(row.original.createdAt), "MMM d, yyyy"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => onViewDetails(payment)}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  navigator.clipboard.writeText(payment.id);
                  toast.success("Payment ID copied!");
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Payment ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
