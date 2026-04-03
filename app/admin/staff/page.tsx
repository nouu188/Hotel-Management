"use client";

import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { StaffTable } from "@/components/admin/staff/StaffTable";

export default function AdminStaffPage() {
  return (
    <div className="space-y-6 container">
      <AdminPageHeader
        title="Staff Management"
        description="Manage hotel staff accounts and roles"
      />
      <StaffTable />
    </div>
  );
}
