"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

interface BookingsByStatusChartProps {
  data: Array<{ status: string; count: number }>;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#3b82f6",
  CHECKED_IN: "#22c55e",
  CHECKED_OUT: "#64748b",
  CANCELLED: "#ef4444",
  COMPLETED: "#077dab",
  REFUNDED: "#8b5cf6",
  FAIL_PAYMENT: "#dc2626",
  IN_PROGRESS: "#f97316",
};

export function BookingsByStatusChart({ data }: BookingsByStatusChartProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Bookings by Status</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" fontSize={11} />
          <YAxis allowDecimals={false} fontSize={12} />
          <Tooltip />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.status}
                fill={STATUS_COLORS[entry.status] ?? "#94a3b8"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
