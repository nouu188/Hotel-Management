"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { formatVND } from "@/components/admin/overview/KpiCardGrid";

const STATUS_COLORS: Record<string, string> = {
  PAID: "#22c55e",
  PENDING: "#f59e0b",
  FAILED: "#ef4444",
  EXPIRED: "#64748b",
  REFUNDED: "#8b5cf6",
};

function formatShortVND(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

interface RevenueDay {
  date: string;
  revenue: number;
}

interface StatusCount {
  status: string;
  count: number;
}

export function PaymentDashboardCharts() {
  const [revenueByDay, setRevenueByDay] = useState<RevenueDay[]>([]);
  const [byStatus, setByStatus] = useState<StatusCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/payments/stats?days=30");
        const json = await res.json();
        if (json.success) {
          setRevenueByDay(json.data.revenueByDay);
          setByStatus(json.data.byStatus);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-[350px] rounded-2xl" />
        <Skeleton className="h-[350px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(v: string) => format(parseISO(v), "MMM d")}
              fontSize={12}
            />
            <YAxis tickFormatter={formatShortVND} fontSize={12} />
            <Tooltip
              formatter={(value) => [formatVND(value as number), "Revenue"]}
              labelFormatter={(label) =>
                format(parseISO(String(label)), "MMM d, yyyy")
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--chart-1, #077dab)"
              fill="var(--chart-1, #077dab)"
              fillOpacity={0.15}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Payments by Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={byStatus}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {byStatus.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={STATUS_COLORS[entry.status] ?? "#94a3b8"}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
