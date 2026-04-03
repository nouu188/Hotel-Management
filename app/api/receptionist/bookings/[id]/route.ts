import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { withReceptionistApi } from "@/lib/admin-auth";
import { removeBookingExpirationJob } from "@/lib/queue";

function extractId(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split("/");
  return segments[segments.length - 1];
}

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

export const GET = withReceptionistApi(async (req) => {
  const id = extractId(req);

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: bookingInclude,
  });

  if (!booking) {
    return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: booking });
});

export const PATCH = withReceptionistApi(async (req) => {
  const id = extractId(req);
  const body = await req.json();
  const { status } = body;

  const validTransitions: Record<string, string[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["CHECKED_IN", "CANCELLED"],
    CHECKED_IN: ["CHECKED_OUT"],
  };

  const existingBooking = await prisma.booking.findUnique({
    where: { id },
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
        where: { id },
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
      await removeBookingExpirationJob(id);
    } catch {
      // Non-critical: job may already have been processed
    }
  } else {
    updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: bookingInclude,
    });
  }

  return NextResponse.json({ success: true, data: updatedBooking });
});
