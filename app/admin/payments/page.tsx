import { PaymentTable } from "@/components/admin/payments/PaymentTable";

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payments & Billing</h1>
      <PaymentTable />
    </div>
  );
}
