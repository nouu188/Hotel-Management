import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withReceptionistApi } from "@/lib/admin-auth";
import { startOfDay, endOfDay } from "date-fns";

const todayListInclude = {
  bookingGuest: true,
  bookingRoomItems: {
    include: {
      hotelBranchRoomType: {
        include: { roomType: true, hotelBranch: true },
      },
    },
  },
};

export const GET = withReceptionistApi(async () => {
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  const [
    pendingCheckIns,
    activeGuests,
    pendingCheckOuts,
    unpaidBills,
    todayCheckInList,
    todayCheckOutList,
  ] = await Promise.all([
    prisma.booking.count({
      where: {
        status: "CONFIRMED",
        fromDate: { gte: todayStart, lte: todayEnd },
      },
    }),
    prisma.booking.count({ where: { status: "CHECKED_IN" } }),
    prisma.booking.count({
      where: {
        status: "CHECKED_IN",
        toDate: { gte: todayStart, lte: todayEnd },
      },
    }),
    prisma.bill.count({ where: { status: "UNPAID" } }),
    prisma.booking.findMany({
      where: {
        status: "CONFIRMED",
        fromDate: { gte: todayStart, lte: todayEnd },
      },
      include: todayListInclude,
    }),
    prisma.booking.findMany({
      where: {
        status: "CHECKED_IN",
        toDate: { gte: todayStart, lte: todayEnd },
      },
      include: todayListInclude,
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      pendingCheckIns,
      activeGuests,
      pendingCheckOuts,
      unpaidBills,
      todayCheckInList,
      todayCheckOutList,
    },
  });
});
