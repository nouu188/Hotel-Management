"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export function KpiCard({ title, value, icon: Icon, description }: KpiCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}
