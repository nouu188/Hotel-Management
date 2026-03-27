"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AdminBranch } from "./BranchColumns";
import { format } from "date-fns";

interface BranchDetailSheetProps {
  branch: AdminBranch | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2.5">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="col-span-2 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  AVAILABLE: "default",
  UNDER_MAINTENANCE: "secondary",
  BLOCKED: "destructive",
};

export function BranchDetailSheet({ branch, open, onOpenChange }: BranchDetailSheetProps) {
  if (!branch) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{branch.name}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Branch Info</h3>
            <div className="divide-y divide-slate-100">
              <DetailRow label="Name" value={branch.name} />
              <DetailRow label="Location" value={branch.location} />
              <DetailRow label="Created" value={format(new Date(branch.createdAt), "MMM d, yyyy")} />
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Room Types</h3>
            {branch.hotelBranchRoomTypes.length === 0 ? (
              <p className="text-sm text-slate-400">No room types assigned</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {branch.hotelBranchRoomTypes.map((rt) => (
                      <TableRow key={rt.id}>
                        <TableCell className="font-medium">{rt.roomType.name}</TableCell>
                        <TableCell>{rt.quantity}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant[rt.status] ?? "outline"}>
                            {rt.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
