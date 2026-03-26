import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PaymentStatus } from "@prisma/client";

const statusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
  PAID: { label: "Paid", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  FAILED: { label: "Failed", className: "bg-red-100 text-red-800 hover:bg-red-100" },
  EXPIRED: { label: "Expired", className: "bg-slate-100 text-slate-800 hover:bg-slate-100" },
  REFUNDED: { label: "Refunded", className: "bg-purple-100 text-purple-800 hover:bg-purple-100" },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = statusConfig[status] ?? { label: status, className: "" };
  return (
    <Badge variant="secondary" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
