"use client";

import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { ReceptionistBillTable } from "@/components/receptionist/bills/ReceptionistBillTable";

export default function ReceptionistBillsPage() {
  return (
    <div className="space-y-6 container">
      <AdminPageHeader title="Bills" description="View and manage guest bills" />
      <ReceptionistBillTable />
    </div>
  );
}
