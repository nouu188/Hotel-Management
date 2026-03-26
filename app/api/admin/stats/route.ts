import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { startOfDay, endOfDay } from "date-fns";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    const [
      revenueResult,
      totalBookings,
      occupancyData,
      activeGuests,
      upcomingCheckIns,
      upcomingCheckOuts,
    ] = await Promise.all([
      prisma.payment.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),
      prisma.booking.count(),
      prisma.roomAvailability.aggregate({
        where: { date: { gte: todayStart, lt: todayEnd } },
        _sum: { bookedRooms: true, totalRooms: true },
      }),
      prisma.booking.count({ where: { status: "CHECKED_IN" } }),
      prisma.booking.count({
        where: {
          fromDate: { gte: todayStart, lt: todayEnd },
          status: "CONFIRMED",
        },
      }),
      prisma.booking.count({
        where: {
          toDate: { gte: todayStart, lt: todayEnd },
          status: "CHECKED_IN",
        },
      }),
    ]);

    const totalRevenue = revenueResult._sum.amount || 0;
    const totalBooked = occupancyData._sum.bookedRooms || 0;
    const totalRooms = occupancyData._sum.totalRooms || 0;
    const occupancyRate = totalRooms > 0 ? (totalBooked / totalRooms) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalBookings,
        occupancyRate,
        activeGuests,
        upcomingCheckIns,
        upcomingCheckOuts,
      },
    });
  } catch (error) {
    console.error("API Error (GET /api/admin/stats):", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
