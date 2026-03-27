"use client";

import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: { value: number; isPositive: boolean };
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {trend && (
        <div
          className={`flex items-center gap-1 mt-1 text-sm ${
            trend.isPositive ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {trend.isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{Math.abs(trend.value).toFixed(1)}%</span>
        </div>
      )}
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}
