"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { format, parseISO } from "date-fns";
import { formatVND } from "./KpiCardGrid";

interface RevenueChartProps {
  data: Array<{ date: string; revenue: number }>;
}

function formatShortVND(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(val: string) => format(parseISO(val), "MMM d")}
            fontSize={12}
          />
          <YAxis tickFormatter={formatShortVND} fontSize={12} />
          <Tooltip
            formatter={(value: any) => [formatVND(Number(value)), "Revenue"]}
            labelFormatter={(label: any) =>
              format(parseISO(String(label)), "MMM d, yyyy")
            }
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--chart-1, #077dab)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
