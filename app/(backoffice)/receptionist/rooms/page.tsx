"use client";

import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { ReceptionistRoomsView } from "@/components/receptionist/rooms/ReceptionistRoomsView";

export default function ReceptionistRoomsPage() {
  return (
    <div className="space-y-6 container">
      <AdminPageHeader
        title="Room Availability"
        description="Today's room availability across branches"
      />
      <ReceptionistRoomsView />
    </div>
  );
}
