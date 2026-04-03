import prisma from "@/lib/prisma";
import { startOfDay, endOfDay, subDays, eachDayOfInterval, format } from "date-fns";
import { KpiCardGrid } from "@/components/admin/overview/KpiCardGrid";
import { RevenueChart } from "@/components/admin/overview/RevenueChart";
import { BookingsByStatusChart } from "@/components/admin/overview/BookingsByStatusChart";

async function getOverviewData() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const thirtyDaysAgo = subDays(todayStart, 30);

  const [
    totalRevenueResult,
    totalBookings,
    activeGuests,
    upcomingCheckIns,
    upcomingCheckOuts,
    totalRoomsResult,
    bookedRoomsTodayResult,
    bookingsByStatus,
    revenueByDay,
  ] = await Promise.all([
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "PAID" },
    }),

    prisma.booking.count(),

    prisma.booking.count({
      where: { status: "CHECKED_IN" },
    }),

    prisma.booking.count({
      where: {
        fromDate: { gte: todayStart, lte: todayEnd },
        status: { in: ["CONFIRMED", "PENDING"] },
      },
    }),

    prisma.booking.count({
      where: {
        toDate: { gte: todayStart, lte: todayEnd },
        status: "CHECKED_IN",
      },
    }),

    prisma.hotelBranchRoomType.aggregate({
      _sum: { quantity: true },
    }),

    prisma.roomAvailability.aggregate({
      _sum: { bookedRooms: true },
      where: { date: { gte: todayStart, lte: todayEnd } },
    }),

    prisma.booking.groupBy({
      by: ["status"],
      _count: { status: true },
    }),

    prisma.payment.findMany({
      where: {
        status: "PAID",
        paidAt: { gte: thirtyDaysAgo },
      },
      select: { amount: true, paidAt: true },
    }),
  ]);

  const totalRooms = totalRoomsResult._sum.quantity ?? 0;
  const bookedToday = bookedRoomsTodayResult._sum.bookedRooms ?? 0;
  const occupancyRate = totalRooms > 0 ? (bookedToday / totalRooms) * 100 : 0;

  const kpiData = {
    totalRevenue: totalRevenueResult._sum.amount ?? 0,
    totalBookings,
    occupancyRate,
    activeGuests,
    upcomingCheckIns,
    upcomingCheckOuts,
  };

  const statusData = bookingsByStatus.map((entry) => ({
    status: entry.status,
    count: entry._count.status,
  }));

  const revenueMap = new Map<string, number>();
  const days = eachDayOfInterval({ start: thirtyDaysAgo, end: now });
  for (const day of days) {
    revenueMap.set(format(day, "yyyy-MM-dd"), 0);
  }
  for (const payment of revenueByDay) {
    if (payment.paidAt) {
      const key = format(payment.paidAt, "yyyy-MM-dd");
      revenueMap.set(key, (revenueMap.get(key) ?? 0) + payment.amount);
    }
  }
  const revenueTrend = Array.from(revenueMap.entries()).map(([date, revenue]) => ({
    date,
    revenue,
  }));

  return { kpiData, statusData, revenueTrend };
}

export default async function OverviewPage() {
  const { kpiData, statusData, revenueTrend } = await getOverviewData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>
      <KpiCardGrid data={kpiData} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart data={revenueTrend} />
        <BookingsByStatusChart data={statusData} />
      </div>
    </div>
  );
}
