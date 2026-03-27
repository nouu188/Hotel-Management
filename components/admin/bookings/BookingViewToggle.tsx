"use client";

import { TableIcon, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingViewToggleProps {
  view: "table" | "calendar";
  onViewChange: (view: "table" | "calendar") => void;
}

export function BookingViewToggle({ view, onViewChange }: BookingViewToggleProps) {
  return (
    <div className="flex gap-1 rounded-lg border p-1">
      <button
        onClick={() => onViewChange("table")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          view === "table"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <TableIcon className="h-4 w-4" />
        Table
      </button>
      <button
        onClick={() => onViewChange("calendar")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          view === "calendar"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <CalendarIcon className="h-4 w-4" />
        Calendar
      </button>
    </div>
  );
}
