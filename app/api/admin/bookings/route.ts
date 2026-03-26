import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
    const status = searchParams.get("status");
    const branchId = searchParams.get("branchId");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const search = searchParams.get("search");

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
  } catch (error) {
    console.error("API Error (GET /api/admin/bookings):", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
