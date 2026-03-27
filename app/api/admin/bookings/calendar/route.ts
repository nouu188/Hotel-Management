import { withAdminApi } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
} from "date-fns";

export const GET = withAdminApi(async (req) => {
  const monthParam = req.nextUrl.searchParams.get("month");
  const branchId = req.nextUrl.searchParams.get("branchId");

  const date = monthParam ? new Date(`${monthParam}-01`) : new Date();
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  const where: Record<string, unknown> = {
    OR: [
      { fromDate: { gte: start, lte: end } },
      { toDate: { gte: start, lte: end } },
      { AND: [{ fromDate: { lte: start } }, { toDate: { gte: end } }] },
    ],
  };

  if (branchId) {
    where.bookingRoomItems = {
      some: { hotelBranchRoomType: { hotelBranchId: branchId } },
    };
  }

  const bookings = await prisma.booking.findMany({
    where,
    select: { id: true, fromDate: true, toDate: true, status: true },
  });

  const days = eachDayOfInterval({ start, end });
  const calendarData = days.map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const count = bookings.filter(
      (b) => b.fromDate <= day && b.toDate > day
    ).length;
    const checkIns = bookings.filter(
      (b) => format(b.fromDate, "yyyy-MM-dd") === dayStr
    ).length;
    const checkOuts = bookings.filter(
      (b) => format(b.toDate, "yyyy-MM-dd") === dayStr
    ).length;

    return { date: dayStr, count, checkIns, checkOuts };
  });

  return NextResponse.json({ success: true, data: calendarData });
});
