import { AdminBookingTable } from "@/components/admin/bookings/AdminBookingTable";

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Booking Management</h1>
      <AdminBookingTable />
    </div>
  );
}
