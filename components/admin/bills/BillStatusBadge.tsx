"use client";

import { Badge } from "@/components/ui/badge";
import { BillStatus } from "@prisma/client";

const statusConfig: Record<
  BillStatus,
  { variant: "default" | "secondary" | "outline" | "destructive"; label: string }
> = {
  PAID: { variant: "default", label: "Paid" },
  UNPAID: { variant: "secondary", label: "Unpaid" },
  PENDING: { variant: "outline", label: "Pending" },
  CANCELLED: { variant: "destructive", label: "Cancelled" },
};

export function BillStatusBadge({ status }: { status: BillStatus }) {
  const config = statusConfig[status] ?? { variant: "outline" as const, label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
