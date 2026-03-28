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
import { Badge } from "@/components/ui/badge";
import { BillStatus, PaymentMethod } from "@prisma/client";
import { format } from "date-fns";
import { toast } from "sonner";
import { BillStatusBadge } from "./BillStatusBadge";
import { formatVND } from "@/components/admin/overview/KpiCardGrid";

export type AdminBill = {
  id: string;
  bookingId: string;
  staffId: string;
  checkIn: string;
  checkOut: string;
  earlyCheckInFee: number;
  paymentMethod: PaymentMethod;
  status: BillStatus;
  voucher: number;
  finalAmount: number;
  createdAt: string;
  updatedAt: string;
  booking: {
    id: string;
    bookingGuest: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string | null;
    } | null;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  staff: {
    id: string;
    name: string;
    role: string;
  };
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: "Cash",
  E_WALLET: "E-Wallet",
  CREDITCARD: "Credit Card",
  DEBITCARD: "Debit Card",
  PREPAIDCARD: "Prepaid Card",
  STRIPE: "Stripe",
  PENDING: "Pending",
};

export function getAdminBillColumns(
  onViewDetails: (bill: AdminBill) => void
): ColumnDef<AdminBill>[] {
  return [
    {
      accessorKey: "id",
      header: "Bill ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          #{row.original.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      id: "guestName",
      header: "Guest Name",
      cell: ({ row }) => {
        const guest = row.original.booking.bookingGuest;
        if (!guest) return <span className="text-slate-400">N/A</span>;
        return <span className="font-medium">{guest.firstName} {guest.lastName}</span>;
      },
    },
    {
      accessorKey: "checkIn",
      header: "Check-in",
      cell: ({ row }) => format(new Date(row.original.checkIn), "MMM d, yyyy"),
    },
    {
      accessorKey: "checkOut",
      header: "Check-out",
      cell: ({ row }) => format(new Date(row.original.checkOut), "MMM d, yyyy"),
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
      cell: ({ row }) => (
        <Badge variant="outline">
          {paymentMethodLabels[row.original.paymentMethod] ?? row.original.paymentMethod}
        </Badge>
      ),
    },
    {
      accessorKey: "finalAmount",
      header: "Final Amount",
      cell: ({ row }) => (
        <span className="font-medium">{formatVND(row.original.finalAmount)}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <BillStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const bill = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onViewDetails(bill)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  navigator.clipboard.writeText(bill.id);
                  toast.success("Bill ID copied!");
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
