"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentSummaryCards } from "./PaymentSummaryCards";
import { PaymentDashboardCharts } from "./PaymentDashboardCharts";
import { PaymentDetailSheet } from "./PaymentDetailSheet";
import { AdminPayment, getAdminPaymentColumns } from "./PaymentColumns";
import { PaymentStatus } from "@prisma/client";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Search, X } from "lucide-react";

const paymentStatuses = Object.values(PaymentStatus);

export function PaymentTable() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [summary, setSummary] = useState({ totalRevenue: 0, pendingAmount: 0, refundedAmount: 0 });
  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleViewDetails = useCallback((payment: AdminPayment) => {
    setSelectedPayment(payment);
    setSheetOpen(true);
  }, []);

  const columns = useMemo(
    () => getAdminPaymentColumns(handleViewDetails),
    [handleViewDetails]
  );

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await api.admin.payments.getAll(params);
      if (res.success && res.data) {
        const data = res.data as any;
        setPayments(data.payments);
        setPagination((prev) => ({ ...prev, ...data.pagination }));
        if (data.summary) {
          setSummary(data.summary);
        }
      }
    } catch {
      toast.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter, search]);

  useEffect(() => {
    const timeout = setTimeout(fetchPayments, 300);
    return () => clearTimeout(timeout);
  }, [fetchPayments]);

  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  const hasFilters = search || statusFilter;

  return (
    <div className="space-y-6">
      <PaymentDashboardCharts />

      <PaymentSummaryCards data={summary} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by booking ID or payment ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPagination((p) => ({ ...p, page: 1 })); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            {paymentStatuses.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setStatusFilter(""); setPagination((p) => ({ ...p, page: 1 })); }}>
            <X className="mr-1 h-4 w-4" /> Clear
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="p-4" key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </tr>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j} className="p-4">
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {pagination.total} total payments — Page {pagination.page} of {pagination.totalPages || 1}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.totalPages}>
            Next
          </Button>
        </div>
      </div>

      <PaymentDetailSheet
        payment={selectedPayment}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
