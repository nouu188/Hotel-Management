"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { PaymentStatus } from "@prisma/client";
import dayjs from "dayjs";
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
    bookingGuest: { firstName: string; lastName: string } | null;
  };
};

export const adminPaymentColumns: ColumnDef<AdminPayment>[] = [
  {
    accessorKey: "id",
    header: "Payment ID",
    cell: ({ row }) => (
      <button
        onClick={() => {
          navigator.clipboard.writeText(row.original.id);
          toast.success("Payment ID copied!");
        }}
        className="flex items-center gap-1 font-mono text-xs text-slate-500 hover:text-slate-700"
      >
        #{row.original.id.slice(-8).toUpperCase()}
        <Copy className="h-3 w-3" />
      </button>
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
      <div className="flex cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
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
      <div className="flex cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Paid At <ArrowUpDown className="ml-1 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => row.original.paidAt ? dayjs(row.original.paidAt).format("MMM D, YYYY HH:mm") : "—",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => dayjs(row.original.createdAt).format("MMM D, YYYY"),
  },
];
