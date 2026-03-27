"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { AdminPayment } from "./PaymentColumns";
import { formatVND } from "@/components/admin/overview/KpiCardGrid";
import { format, parseISO } from "date-fns";

interface PaymentDetailSheetProps {
  payment: AdminPayment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2.5">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="col-span-2 text-sm font-medium text-slate-900">
        {value}
      </dd>
    </div>
  );
}

export function PaymentDetailSheet({
  payment,
  open,
  onOpenChange,
}: PaymentDetailSheetProps) {
  if (!payment) return null;

  const guest = payment.booking?.bookingGuest;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Payment Details</SheetTitle>
          <SheetDescription>
            ID: #{payment.id.slice(-8).toUpperCase()}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              Payment Info
            </h3>
            <div className="divide-y divide-slate-100">
              <DetailRow
                label="Amount"
                value={formatVND(payment.amount)}
              />
              <DetailRow
                label="Status"
                value={<PaymentStatusBadge status={payment.status} />}
              />
              <DetailRow label="Currency" value={payment.currency.toUpperCase()} />
              <DetailRow
                label="Paid At"
                value={
                  payment.paidAt
                    ? format(parseISO(payment.paidAt), "MMM d, yyyy HH:mm")
                    : "—"
                }
              />
              <DetailRow
                label="Created"
                value={format(parseISO(payment.createdAt), "MMM d, yyyy HH:mm")}
              />
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              Booking Info
            </h3>
            <div className="divide-y divide-slate-100">
              <DetailRow
                label="Booking ID"
                value={
                  <span className="font-mono text-xs">
                    #{payment.booking.id.slice(-8).toUpperCase()}
                  </span>
                }
              />
              <DetailRow
                label="Check-in"
                value={format(parseISO(payment.booking.fromDate), "MMM d, yyyy")}
              />
              <DetailRow
                label="Check-out"
                value={format(parseISO(payment.booking.toDate), "MMM d, yyyy")}
              />
              <DetailRow label="Booking Status" value={payment.booking.status} />
            </div>
          </section>

          {guest && (
            <>
              <Separator />
              <section>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Guest Info
                </h3>
                <div className="divide-y divide-slate-100">
                  <DetailRow
                    label="Name"
                    value={`${guest.firstName} ${guest.lastName}`}
                  />
                  <DetailRow label="Email" value={guest.email} />
                </div>
              </section>
            </>
          )}

          {payment.stripePaymentIntent && (
            <>
              <Separator />
              <section>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Stripe
                </h3>
                <div className="divide-y divide-slate-100">
                  <DetailRow
                    label="Payment Intent"
                    value={
                      <span className="font-mono text-xs break-all">
                        {payment.stripePaymentIntent}
                      </span>
                    }
                  />
                </div>
              </section>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
