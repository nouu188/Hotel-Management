"use client";

import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; className: string }> = {
  AVAILABLE: { label: "Available", className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" },
  UNDER_MAINTENANCE: { label: "Maintenance", className: "bg-amber-100 text-amber-700 hover:bg-amber-100" },
  BLOCKED: { label: "Blocked", className: "bg-red-100 text-red-700 hover:bg-red-100" },
};

export function InventoryStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, className: "" };
  return <Badge className={config.className}>{config.label}</Badge>;
}
