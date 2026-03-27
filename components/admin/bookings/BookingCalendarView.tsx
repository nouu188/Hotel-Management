"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { cn } from "@/lib/utils";

type CalendarDay = {
  date: string;
  count: number;
  checkIns: number;
  checkOuts: number;
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function BookingCalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCalendarData = useCallback(async () => {
    setLoading(true);
    try {
      const monthStr = format(currentMonth, "yyyy-MM");
      const res = await fetch(`/api/admin/bookings/calendar?month=${monthStr}`);
      const json = await res.json();
      if (json.success) {
        setCalendarData(json.data);
      }
    } catch {
      setCalendarData([]);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const dataMap = new Map(calendarData.map((d) => [d.date, d]));

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-px">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-slate-500"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const data = dataMap.get(dateStr);
          const inMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);

          return (
            <div
              key={dateStr}
              className={cn(
                "min-h-[80px] rounded-lg border p-2 transition-colors",
                !inMonth && "bg-slate-50 opacity-40",
                today && "border-primary bg-primary/5",
                inMonth && !today && "border-slate-100 hover:border-slate-200"
              )}
            >
              <div
                className={cn(
                  "text-sm font-medium",
                  today && "text-primary",
                  !inMonth && "text-slate-400",
                  inMonth && !today && "text-slate-700"
                )}
              >
                {format(day, "d")}
              </div>

              {loading ? (
                <div className="mt-1 h-4 w-10 animate-pulse rounded bg-slate-100" />
              ) : (
                inMonth &&
                data && (
                  <div className="mt-1 space-y-0.5">
                    {data.count > 0 && (
                      <span className="inline-block rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                        {data.count} active
                      </span>
                    )}
                    {data.checkIns > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-green-600">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                        {data.checkIns} in
                      </div>
                    )}
                    {data.checkOuts > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-red-500">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                        {data.checkOuts} out
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
