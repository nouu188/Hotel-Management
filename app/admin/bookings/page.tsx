"use client";

import { useState } from "react";
import { AdminBookingTable } from "@/components/admin/bookings/AdminBookingTable";
import { BookingCalendarView } from "@/components/admin/bookings/BookingCalendarView";
import { BookingViewToggle } from "@/components/admin/bookings/BookingViewToggle";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";

export default function AdminBookingsPage() {
  const [view, setView] = useState<"table" | "calendar">("table");

  return (
    <div className="space-y-6 container">
      <AdminPageHeader title="Booking Management">
        <BookingViewToggle view={view} onViewChange={setView} />
      </AdminPageHeader>
      {view === "table" ? <AdminBookingTable /> : <BookingCalendarView />}
    </div>
  );
}
