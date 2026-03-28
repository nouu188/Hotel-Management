import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { withAdminApi } from "@/lib/admin-auth";
import { UserStatus } from "@prisma/client";

function extractId(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split("/");
  return segments[segments.length - 1];
}

export const GET = withAdminApi(async (req) => {
  const id = extractId(req);

  const guest = await prisma.user.findUnique({
    where: { id, role: "USER" },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      image: true,
      gender: true,
      location: true,
      birthDay: true,
      status: true,
      createdAt: true,
      booking: {
        select: {
          id: true,
          fromDate: true,
          toDate: true,
          status: true,
          createdAt: true,
          bookingGuest: {
            select: { firstName: true, lastName: true },
          },
          payment: {
            select: { id: true, amount: true, status: true, paidAt: true, createdAt: true },
          },
          bookingRoomItems: {
            select: {
              quantityBooked: true,
              hotelBranchRoomType: {
                select: {
                  roomType: { select: { name: true } },
                  hotelBranch: { select: { name: true } },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!guest) {
    return NextResponse.json(
      { success: false, message: "Guest not found" },
      { status: 404 }
    );
  }

  const totalSpent = guest.booking.reduce((sum, b) => {
    if (b.payment?.status === "PAID") return sum + b.payment.amount;
    return sum;
  }, 0);

  const totalBookings = guest.booking.length;

  return NextResponse.json({
    success: true,
    data: { ...guest, totalSpent, totalBookings },
  });
});

export const PATCH = withAdminApi(async (req) => {
  const id = extractId(req);
  const body = await req.json();

  const validStatuses: UserStatus[] = ["ACTIVE", "SUSPENDED", "DELETED"];
  if (!body.status || !validStatuses.includes(body.status)) {
    return NextResponse.json(
      { success: false, message: "Invalid status" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { id, role: "USER" } });
  if (!existing) {
    return NextResponse.json(
      { success: false, message: "Guest not found" },
      { status: 404 }
    );
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { status: body.status },
  });

  return NextResponse.json({ success: true, data: updated });
});
