import { ReceptionistOverviewStats } from "@/components/receptionist/overview/ReceptionistOverviewStats";
import { TodayBookingList } from "@/components/receptionist/overview/TodayBookingList";
import { ReceptionistStats } from "@/types/receptionist";

const defaultStats: ReceptionistStats = {
  pendingCheckIns: 0,
  activeGuests: 0,
  pendingCheckOuts: 0,
  unpaidBills: 0,
  todayCheckInList: [],
  todayCheckOutList: [],
};

export default async function ReceptionistOverviewPage() {
  let stats: ReceptionistStats = defaultStats;

  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/receptionist/stats`,
      { cache: "no-store" }
    );
    const json = await res.json();
    if (json.success && json.data) {
      stats = { ...defaultStats, ...json.data };
    }
  } catch (error) {
    console.error("Failed to fetch receptionist stats:", error);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>

      <ReceptionistOverviewStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayBookingList
          title="Today's Check-ins"
          bookings={stats.todayCheckInList}
          emptyMessage="No check-ins scheduled for today"
        />
        <TodayBookingList
          title="Today's Check-outs"
          bookings={stats.todayCheckOutList}
          emptyMessage="No check-outs scheduled for today"
        />
      </div>
    </div>
  );
}
