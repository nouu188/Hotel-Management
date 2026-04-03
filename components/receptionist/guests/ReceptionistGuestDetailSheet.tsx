"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { GuestStatusBadge } from "@/components/admin/guests/GuestStatusBadge";
import { format } from "date-fns";
import { ReceptionistGuest } from "./ReceptionistGuestColumns";

interface ReceptionistGuestDetailSheetProps {
  guest: ReceptionistGuest | null;
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

export function ReceptionistGuestDetailSheet({
  guest,
  open,
  onOpenChange,
}: ReceptionistGuestDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Guest Details</SheetTitle>
        </SheetHeader>

        {guest && (
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold">{guest.name}</h3>
              <p className="text-sm text-slate-500">{guest.email}</p>
            </div>

            <Separator />

            <dl className="divide-y divide-slate-100">
              <DetailRow
                label="Status"
                value={<GuestStatusBadge status={guest.status} />}
              />
              <DetailRow
                label="Phone"
                value={guest.phoneNumber || <span className="text-slate-400">N/A</span>}
              />
              <DetailRow
                label="Joined"
                value={format(new Date(guest.createdAt), "MMM d, yyyy")}
              />
              <DetailRow label="Total Bookings" value={guest._count.booking} />
            </dl>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
