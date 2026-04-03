"use client";

import { BookingStatusBadge } from "@/components/admin/bookings/BookingStatusBadge";
import { BookingStatus } from "@prisma/client";
import { TodayBooking } from "@/types/receptionist";

interface TodayBookingListProps {
  title: string;
  bookings: TodayBooking[];
  emptyMessage: string;
}

export function TodayBookingList({
  title,
  bookings,
  emptyMessage,
}: TodayBookingListProps) {
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
              <li
                key={booking.id}
                className="flex items-center justify-between gap-4 py-2 border-b last:border-0"
              >
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
