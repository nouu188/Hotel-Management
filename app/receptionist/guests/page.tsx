"use client";

import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { ReceptionistGuestTable } from "@/components/receptionist/guests/ReceptionistGuestTable";

export default function ReceptionistGuestsPage() {
  return (
    <div className="space-y-6 container">
      <AdminPageHeader title="Guests" description="Look up guest information" />
      <ReceptionistGuestTable />
    </div>
  );
}
