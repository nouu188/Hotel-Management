"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AdminStaff } from "./StaffColumns";
import { StaffStatus } from "@prisma/client";
import { format } from "date-fns";
import { toast } from "sonner";

interface StaffDetailSheetProps {
  staff: AdminStaff | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const roleBadgeVariant: Record<string, string> = {
  RECEPTIONIST: "bg-blue-100 text-blue-700",
  RESERVATION: "bg-purple-100 text-purple-700",
  CASHIER: "bg-green-100 text-green-700",
};

const statusBadgeVariant: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  ON_LEAVE: "bg-yellow-100 text-yellow-700",
  TERMINATED: "bg-red-100 text-red-700",
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2.5">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="col-span-2 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

export function StaffDetailSheet({
  staff,
  open,
  onOpenChange,
  onUpdate,
}: StaffDetailSheetProps) {
  const [selectedStatus, setSelectedStatus] = useState<StaffStatus | "">("");
  const [saving, setSaving] = useState(false);

  if (!staff) return null;

  const handleSaveStatus = async () => {
    if (!selectedStatus) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/staff/${staff.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.message || "Failed to update status");
        return;
      }
      toast.success("Staff status updated");
      onUpdate();
      onOpenChange(false);
    } catch {
      toast.error("Failed to update staff status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Staff Details</SheetTitle>
          <SheetDescription>
            ID: #{staff.id.slice(-8).toUpperCase()}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Staff Info</h3>
            <div className="divide-y divide-slate-100">
              <DetailRow label="Name" value={staff.name} />
              <DetailRow
                label="Email"
                value={staff.user?.email ?? <span className="text-slate-400">N/A</span>}
              />
              <DetailRow
                label="Role"
                value={
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeVariant[staff.role]}`}
                  >
                    {staff.role}
                  </span>
                }
              />
              <DetailRow
                label="Status"
                value={
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeVariant[staff.status]}`}
                  >
                    {staff.status.replace(/_/g, " ")}
                  </span>
                }
              />
              <DetailRow
                label="Enroll Date"
                value={format(new Date(staff.enrollDate), "MMM d, yyyy")}
              />
              <DetailRow
                label="Created"
                value={format(new Date(staff.createdAt), "MMM d, yyyy HH:mm")}
              />
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Update Status</h3>
            <div className="flex items-center gap-3">
              <Select
                value={selectedStatus || staff.status}
                onValueChange={(v) => setSelectedStatus(v as StaffStatus)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="ON_LEAVE">ON LEAVE</SelectItem>
                  <SelectItem value="TERMINATED">TERMINATED</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleSaveStatus}
                disabled={saving || !selectedStatus || selectedStatus === staff.status}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
