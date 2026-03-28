"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { GuestStatusBadge } from "./GuestStatusBadge";
import { BookingStatusBadge } from "@/components/admin/bookings/BookingStatusBadge";
import { PaymentStatusBadge } from "@/components/admin/payments/PaymentStatusBadge";
import { formatVND } from "@/components/admin/overview/KpiCardGrid";
import { format } from "date-fns";
import { BookingStatus, PaymentStatus, UserStatus } from "@prisma/client";
import { toast } from "sonner";

interface GuestProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  image: string | null;
  gender: string | null;
  location: string | null;
  birthDay: string | null;
  status: UserStatus;
  createdAt: string;
  totalSpent: number;
  totalBookings: number;
  booking: Array<{
    id: string;
    fromDate: string;
    toDate: string;
    status: BookingStatus;
    createdAt: string;
    bookingGuest: { firstName: string; lastName: string } | null;
    payment: {
      id: string;
      amount: number;
      status: PaymentStatus;
      paidAt: string | null;
      createdAt: string;
    } | null;
    bookingRoomItems: Array<{
      quantityBooked: number;
      hotelBranchRoomType: {
        roomType: { name: string };
        hotelBranch: { name: string };
      };
    }>;
  }>;
}

interface GuestProfileSheetProps {
  guestId: string | null;
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function GuestProfileSheet({ guestId, open, onOpenChange }: GuestProfileSheetProps) {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/guests/${id}`);
      const json = await res.json();
      if (json.success) {
        setProfile(json.data);
      } else {
        toast.error(json.message || "Failed to load guest profile");
      }
    } catch {
      toast.error("Failed to load guest profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && guestId) {
      fetchProfile(guestId);
    }
    if (!open) {
      setProfile(null);
    }
  }, [open, guestId, fetchProfile]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Guest Profile</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        ) : profile ? (
          <div className="mt-6">
            <Tabs defaultValue="overview">
              <TabsList className="w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.image ?? undefined} alt={profile.name} />
                    <AvatarFallback className="text-lg">{getInitials(profile.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{profile.name}</h3>
                    <p className="text-sm text-slate-500">{profile.email}</p>
                  </div>
                </div>

                <Separator />

                <div className="divide-y divide-slate-100">
                  <DetailRow label="Status" value={<GuestStatusBadge status={profile.status} />} />
                  <DetailRow
                    label="Phone"
                    value={profile.phoneNumber || <span className="text-slate-400">N/A</span>}
                  />
                  <DetailRow
                    label="Gender"
                    value={profile.gender || <span className="text-slate-400">N/A</span>}
                  />
                  <DetailRow
                    label="Location"
                    value={profile.location || <span className="text-slate-400">N/A</span>}
                  />
                  <DetailRow
                    label="Birthday"
                    value={
                      profile.birthDay
                        ? format(new Date(profile.birthDay), "MMM d, yyyy")
                        : <span className="text-slate-400">N/A</span>
                    }
                  />
                  <DetailRow
                    label="Joined"
                    value={format(new Date(profile.createdAt), "MMM d, yyyy")}
                  />
                  <DetailRow label="Total Bookings" value={profile.totalBookings} />
                  <DetailRow label="Total Spent" value={formatVND(profile.totalSpent)} />
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="mt-4 space-y-3">
                {profile.booking.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No bookings yet</p>
                ) : (
                  profile.booking.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-lg border p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {format(new Date(booking.fromDate), "MMM d")} -{" "}
                          {format(new Date(booking.toDate), "MMM d, yyyy")}
                        </span>
                        <BookingStatusBadge status={booking.status} />
                      </div>
                      <div className="text-xs text-slate-500 space-y-1">
                        {booking.bookingRoomItems.map((item, idx) => (
                          <p key={idx}>
                            {item.quantityBooked}x {item.hotelBranchRoomType.roomType.name}{" "}
                            <span className="text-slate-400">
                              @ {item.hotelBranchRoomType.hotelBranch.name}
                            </span>
                          </p>
                        ))}
                      </div>
                      {booking.payment && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Amount</span>
                          <span className="font-medium">{formatVND(booking.payment.amount)}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="payments" className="mt-4 space-y-3">
                {(() => {
                  const payments = profile.booking
                    .filter((b) => b.payment)
                    .map((b) => ({ ...b.payment!, bookingId: b.id }));
                  if (payments.length === 0) {
                    return (
                      <p className="text-sm text-slate-400 text-center py-8">No payments yet</p>
                    );
                  }
                  return payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="text-sm font-medium">{formatVND(payment.amount)}</p>
                        <p className="text-xs text-slate-500">
                          {format(new Date(payment.paidAt || payment.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                      <PaymentStatusBadge status={payment.status} />
                    </div>
                  ));
                })()}
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
