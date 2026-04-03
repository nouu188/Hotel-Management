import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { withReceptionistApi } from "@/lib/admin-auth";

function extractId(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split("/");
  return segments[segments.length - 1];
}

export const GET = withReceptionistApi(async (req) => {
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
      _count: { select: { booking: true } },
      booking: {
        select: {
          id: true,
          fromDate: true,
          toDate: true,
          status: true,
          createdAt: true,
          payment: {
            select: { id: true, amount: true, status: true, paidAt: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!guest) {
    return NextResponse.json({ success: false, message: "Guest not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: guest });
});
