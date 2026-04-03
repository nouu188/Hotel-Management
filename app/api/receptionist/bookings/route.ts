import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withReceptionistApi } from "@/lib/admin-auth";
import { Prisma } from "@prisma/client";

export const GET = withReceptionistApi(async (req) => {
  const searchParams = req.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const branchId = searchParams.get("branchId");
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  const where: Prisma.BookingWhereInput = {};

  if (status) {
    where.status = status as Prisma.EnumBookingStatusFilter;
  }

  if (fromDate) {
    where.fromDate = { gte: new Date(fromDate) };
  }

  if (toDate) {
    where.toDate = { lte: new Date(toDate) };
  }

  if (branchId) {
    where.bookingRoomItems = {
      some: { hotelBranchRoomType: { hotelBranchId: branchId } },
    };
  }

  if (search) {
    where.OR = [
      { bookingGuest: { email: { contains: search, mode: "insensitive" } } },
      { bookingGuest: { firstName: { contains: search, mode: "insensitive" } } },
      { id: { contains: search, mode: "insensitive" } },
    ];
  }

  const include = {
    bookingGuest: true,
    bookingRoomItems: {
      include: {
        hotelBranchRoomType: {
          include: { roomType: true, hotelBranch: true },
        },
      },
    },
    payment: true,
    user: { select: { name: true, email: true } },
  };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});
