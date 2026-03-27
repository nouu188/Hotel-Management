import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { removeBookingExpirationJob } from "@/lib/queue";

const bookingInclude = {
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
  usingservices: { include: { service: true } },
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: bookingInclude,
    });

    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("API Error (GET /api/admin/bookings/[bookingId]):", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await params;
    const body = await request.json();
    const { status } = body;

    const validTransitions: Record<string, string[]> = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["CHECKED_IN", "CANCELLED"],
      CHECKED_IN: ["CHECKED_OUT"],
    };

    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { bookingRoomItems: true },
    });

    if (!existingBooking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    const allowedStatuses = validTransitions[existingBooking.status] ?? [];
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Cannot transition from ${existingBooking.status} to ${status}` },
        { status: 400 }
      );
    }

    let updatedBooking;

    if (status === "CANCELLED") {
      updatedBooking = await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.update({
          where: { id: bookingId },
          data: { status: "CANCELLED" },
          include: bookingInclude,
        });

        const decrementPromises = existingBooking.bookingRoomItems.map((item) =>
          tx.roomAvailability.updateMany({
            where: {
              hotelBranchRoomTypeId: item.hotelBranchRoomTypeId,
              date: { gte: existingBooking.fromDate, lt: existingBooking.toDate },
            },
            data: { bookedRooms: { decrement: item.quantityBooked } },
          })
        );
        await Promise.all(decrementPromises);

        return booking;
      });

      try {
        await removeBookingExpirationJob(bookingId);
      } catch {
        // Non-critical: job may already have been processed
      }
    } else {
      updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status },
        include: bookingInclude,
      });
    }

    return NextResponse.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error("API Error (PATCH /api/admin/bookings/[bookingId]):", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
