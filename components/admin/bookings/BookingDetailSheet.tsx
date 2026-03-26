"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { PaymentStatusBadge } from "../payments/PaymentStatusBadge";
import { AdminBooking } from "./AdminBookingColumns";
import { formatVND } from "../overview/KpiCardGrid";
import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";

interface BookingDetailSheetProps {
  booking: AdminBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2.5">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="col-span-2 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

export function BookingDetailSheet({ booking, open, onOpenChange }: BookingDetailSheetProps) {
  if (!booking) return null;

  const guest = booking.bookingGuest;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Booking Details</SheetTitle>
          <SheetDescription>
            ID: #{booking.id.slice(-8).toUpperCase()}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Booking Info</h3>
            <div className="divide-y divide-slate-100">
              <DetailRow label="Status" value={<BookingStatusBadge status={booking.status} />} />
              <DetailRow label="Check-in" value={dayjs(booking.fromDate).format("MMM D, YYYY")} />
              <DetailRow label="Check-out" value={dayjs(booking.toDate).format("MMM D, YYYY")} />
              <DetailRow label="Created" value={dayjs(booking.createdAt).format("MMM D, YYYY HH:mm")} />
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Guest Info</h3>
            <div className="divide-y divide-slate-100">
              <DetailRow
                label="Name"
                value={guest ? `${guest.firstName} ${guest.lastName}` : booking.user.name}
              />
              <DetailRow label="Email" value={guest?.email ?? booking.user.email} />
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Rooms</h3>
            <div className="space-y-2">
              {booking.bookingRoomItems.map((item, i) => (
                <div key={i} className="rounded-lg bg-slate-50 p-3">
                  <p className="font-medium">{item.hotelBranchRoomType.roomType.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.hotelBranchRoomType.hotelBranch.name} — {item.quantityBooked} room(s)
                  </p>
                </div>
              ))}
            </div>
          </section>

          {booking.payment && (
            <>
              <Separator />
              <section>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Payment</h3>
                <div className="divide-y divide-slate-100">
                  <DetailRow label="Status" value={<PaymentStatusBadge status={booking.payment.status} />} />
                  <DetailRow label="Amount" value={formatVND(booking.payment.amount)} />
                </div>
              </section>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
