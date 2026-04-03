"use client";

import { LogIn, LogOut, Users, Receipt } from "lucide-react";
import { StatCard } from "@/components/admin/shared/StatCard";
import { ReceptionistStats } from "@/types/receptionist";

interface ReceptionistOverviewStatsProps {
  stats: ReceptionistStats;
}

export function ReceptionistOverviewStats({ stats }: ReceptionistOverviewStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Pending Check-ins"
        value={stats.pendingCheckIns}
        icon={LogIn}
        description="Confirmed, arriving today"
      />
      <StatCard
        title="Active Guests"
        value={stats.activeGuests}
        icon={Users}
        description="Currently checked in"
      />
      <StatCard
        title="Pending Check-outs"
        value={stats.pendingCheckOuts}
        icon={LogOut}
        description="Due to check out today"
      />
      <StatCard
        title="Unpaid Bills"
        value={stats.unpaidBills}
        icon={Receipt}
        description="Awaiting payment"
      />
    </div>
  );
}
