"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { BillStatusBadge } from "./BillStatusBadge";
import { formatVND } from "@/components/admin/overview/KpiCardGrid";
import { format } from "date-fns";
import { BillStatus, PaymentMethod } from "@prisma/client";
import { toast } from "sonner";

interface BillDetail {
  id: string;
  bookingId: string;
  checkIn: string;
  checkOut: string;
  earlyCheckInFee: number;
  paymentMethod: PaymentMethod;
  status: BillStatus;
  voucher: number;
  finalAmount: number;
  createdAt: string;
  booking: {
    id: string;
    bookingGuest: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string | null;
    } | null;
    bookingRoomItems: Array<{
      id: string;
      quantityBooked: number;
      hotelBranchRoomType: {
        roomType: { name: string; price: number };
        hotelBranch: { name: string };
      };
    }>;
    user: { id: string; name: string; email: string };
    payment: {
      id: string;
      amount: number;
      status: string;
      paidAt: string | null;
    } | null;
  };
  staff: { id: string; name: string; role: string };
}

interface BillDetailSheetProps {
  billId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: "Cash",
  E_WALLET: "E-Wallet",
  CREDITCARD: "Credit Card",
  DEBITCARD: "Debit Card",
  PREPAIDCARD: "Prepaid Card",
  STRIPE: "Stripe",
  PENDING: "Pending",
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2.5">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="col-span-2 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

export function BillDetailSheet({ billId, open, onOpenChange }: BillDetailSheetProps) {
  const [bill, setBill] = useState<BillDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!billId || !open) return;

    setLoading(true);
    fetch(`/api/admin/bills/${billId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setBill(json.data);
        else toast.error("Failed to load bill details");
      })
      .catch(() => toast.error("Failed to load bill details"))
      .finally(() => setLoading(false));
  }, [billId, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            Bill #{billId?.slice(0, 8).toUpperCase()}
          </SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="mt-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : bill ? (
          <div className="mt-6 space-y-6">
            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Bill Info</h3>
              <div className="divide-y divide-slate-100">
                <DetailRow label="Bill ID" value={<span className="font-mono text-xs">{bill.id}</span>} />
                <DetailRow label="Status" value={<BillStatusBadge status={bill.status} />} />
                <DetailRow label="Check-in" value={format(new Date(bill.checkIn), "MMM d, yyyy")} />
                <DetailRow label="Check-out" value={format(new Date(bill.checkOut), "MMM d, yyyy")} />
                <DetailRow label="Payment Method" value={paymentMethodLabels[bill.paymentMethod] ?? bill.paymentMethod} />
                <DetailRow label="Early Check-in Fee" value={formatVND(bill.earlyCheckInFee)} />
                <DetailRow label="Voucher" value={formatVND(bill.voucher)} />
                <DetailRow label="Final Amount" value={<span className="font-semibold">{formatVND(bill.finalAmount)}</span>} />
                <DetailRow label="Created" value={format(new Date(bill.createdAt), "MMM d, yyyy HH:mm")} />
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Guest Info</h3>
              {bill.booking.bookingGuest ? (
                <div className="divide-y divide-slate-100">
                  <DetailRow
                    label="Name"
                    value={`${bill.booking.bookingGuest.firstName} ${bill.booking.bookingGuest.lastName}`}
                  />
                  <DetailRow label="Email" value={bill.booking.bookingGuest.email} />
                  <DetailRow
                    label="Phone"
                    value={bill.booking.bookingGuest.phoneNumber || "N/A"}
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-400">No guest information</p>
              )}
            </section>

            <Separator />

            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Staff</h3>
              <div className="divide-y divide-slate-100">
                <DetailRow label="Name" value={bill.staff.name} />
                <DetailRow label="Role" value={bill.staff.role} />
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Booking Rooms</h3>
              {bill.booking.bookingRoomItems.length === 0 ? (
                <p className="text-sm text-slate-400">No rooms</p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Room Type</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bill.booking.bookingRoomItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.hotelBranchRoomType.roomType.name}
                          </TableCell>
                          <TableCell>{item.hotelBranchRoomType.hotelBranch.name}</TableCell>
                          <TableCell>{item.quantityBooked}</TableCell>
                          <TableCell>{formatVND(item.hotelBranchRoomType.roomType.price)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </section>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
