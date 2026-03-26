import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BookingStatus } from "@prisma/client";

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  CHECKED_IN: { label: "Checked In", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  CHECKED_OUT: { label: "Checked Out", className: "bg-slate-100 text-slate-800 hover:bg-slate-100" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-800 hover:bg-red-100" },
  IN_PROGRESS: { label: "In Progress", className: "bg-orange-100 text-orange-800 hover:bg-orange-100" },
  COMPLETED: { label: "Completed", className: "bg-teal-100 text-teal-800 hover:bg-teal-100" },
  REFUNDED: { label: "Refunded", className: "bg-purple-100 text-purple-800 hover:bg-purple-100" },
  FAIL_PAYMENT: { label: "Failed Payment", className: "bg-red-100 text-red-800 hover:bg-red-100" },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const config = statusConfig[status] ?? { label: status, className: "" };
  return (
    <Badge variant="secondary" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
