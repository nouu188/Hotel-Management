"use client";

import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { ReceptionistBookingTable } from "@/components/receptionist/bookings/ReceptionistBookingTable";

export default function ReceptionistBookingsPage() {
  return (
    <div className="space-y-6 container">
      <AdminPageHeader
        title="Booking Management"
        description="Manage guest check-ins and check-outs"
      />
      <ReceptionistBookingTable />
    </div>
  );
}
