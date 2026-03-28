import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UserStatus } from "@prisma/client";

const statusConfig: Record<UserStatus, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  SUSPENDED: { label: "Suspended", className: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
  DELETED: { label: "Deleted", className: "bg-red-100 text-red-800 hover:bg-red-100" },
};

export function GuestStatusBadge({ status }: { status: UserStatus }) {
  const config = statusConfig[status] ?? { label: status, className: "" };
  return (
    <Badge variant="secondary" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
