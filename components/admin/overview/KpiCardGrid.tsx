"use client";

import {
  DollarSign,
  CalendarCheck,
  Percent,
  Users,
  LogIn,
  LogOut,
} from "lucide-react";
import { KpiCard } from "./KpiCard";

export interface KpiData {
  totalRevenue: number;
  totalBookings: number;
  occupancyRate: number;
  activeGuests: number;
  upcomingCheckIns: number;
  upcomingCheckOuts: number;
}

export function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN").replace(/,/g, ".") + "₫";
}

export function KpiCardGrid({ data }: { data: KpiData }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <KpiCard
        title="Total Revenue"
        value={formatVND(data.totalRevenue)}
        icon={DollarSign}
      />
      <KpiCard
        title="Total Bookings"
        value={data.totalBookings}
        icon={CalendarCheck}
      />
      <KpiCard
        title="Occupancy Rate"
        value={`${data.occupancyRate.toFixed(1)}%`}
        icon={Percent}
      />
      <KpiCard
        title="Active Guests"
        value={data.activeGuests}
        icon={Users}
      />
      <KpiCard
        title="Upcoming Check-ins"
        value={data.upcomingCheckIns}
        icon={LogIn}
      />
      <KpiCard
        title="Upcoming Check-outs"
        value={data.upcomingCheckOuts}
        icon={LogOut}
      />
    </div>
  );
}
