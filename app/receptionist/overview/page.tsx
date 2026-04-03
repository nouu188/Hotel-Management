"use client";

import { LogIn, LogOut, Users, Receipt } from "lucide-react";
import { StatCard } from "@/components/admin/shared/StatCard";
import { BookingStatusBadge } from "@/components/admin/bookings/BookingStatusBadge";
import { BookingStatus } from "@prisma/client";

type TodayBooking = {
  id: string;
  status: string;
  bookingGuest: { firstName: string; lastName: string } | null;
  user: { name: string };
  bookingRoomItems: Array<{
    hotelBranchRoomType: {
      roomType: { name: string };
      hotelBranch: { name: string };
    };
  }>;
};

type ReceptionistStats = {
  pendingCheckIns: number;
  activeGuests: number;
  pendingCheckOuts: number;
  unpaidBills: number;
  todayCheckInList: TodayBooking[];
  todayCheckOutList: TodayBooking[];
};

function TodayBookingList({
  title,
  bookings,
  emptyMessage,
}: {
  title: string;
  bookings: TodayBooking[];
  emptyMessage: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-base font-semibold mb-4">{title}</h2>
      {bookings.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">{emptyMessage}</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((booking) => {
            const guestName = booking.bookingGuest
              ? `${booking.bookingGuest.firstName} ${booking.bookingGuest.lastName}`
              : booking.user.name;
            const firstItem = booking.bookingRoomItems[0];
            return (
              <li key={booking.id} className="flex items-center justify-between gap-4 py-2 border-b last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{guestName}</p>
                  {firstItem && (
                    <p className="text-xs text-muted-foreground truncate">
                      {firstItem.hotelBranchRoomType.roomType.name} &mdash;{" "}
                      {firstItem.hotelBranchRoomType.hotelBranch.name}
                    </p>
                  )}
                </div>
                <BookingStatusBadge status={booking.status as BookingStatus} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const defaultStats: ReceptionistStats = {
  pendingCheckIns: 0,
  activeGuests: 0,
  pendingCheckOuts: 0,
  unpaidBills: 0,
  todayCheckInList: [],
  todayCheckOutList: [],
};

export default async function ReceptionistOverviewPage() {
  let stats: ReceptionistStats = defaultStats;

  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/receptionist/stats`,
      { cache: "no-store" }
    );
    const json = await res.json();
    if (json.success && json.data) {
      stats = { ...defaultStats, ...json.data };
    }
  } catch {
    // fall through to defaults
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Check-ins"
          value={stats.pendingCheckIns}
          icon={LogIn}
          description="Confirmed, arriving today"
        />
        <StatCard
          title="Active Guests"
          value={stats.activeGuests}
          icon={Users}
          description="Currently checked in"
        />
        <StatCard
          title="Pending Check-outs"
          value={stats.pendingCheckOuts}
          icon={LogOut}
          description="Due to check out today"
        />
        <StatCard
          title="Unpaid Bills"
          value={stats.unpaidBills}
          icon={Receipt}
          description="Awaiting payment"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayBookingList
          title="Today's Check-ins"
          bookings={stats.todayCheckInList}
          emptyMessage="No check-ins scheduled for today"
        />
        <TodayBookingList
          title="Today's Check-outs"
          bookings={stats.todayCheckOutList}
          emptyMessage="No check-outs scheduled for today"
        />
      </div>
    </div>
  );
}
