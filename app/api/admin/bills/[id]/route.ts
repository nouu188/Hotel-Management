import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { withAdminApi } from "@/lib/admin-auth";
import { BillUpdateSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";

function extractId(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split("/");
  return segments[segments.length - 1];
}

export const GET = withAdminApi(async (req) => {
  const id = extractId(req);

  const bill = await prisma.bill.findUnique({
    where: { id },
    include: {
      booking: {
        include: {
          bookingGuest: true,
          bookingRoomItems: {
            include: {
              hotelBranchRoomType: {
                include: {
                  roomType: true,
                  hotelBranch: { select: { name: true } },
                },
              },
            },
          },
          user: { select: { id: true, name: true, email: true } },
          payment: true,
        },
      },
      staff: { select: { id: true, name: true, role: true } },
    },
  });

  if (!bill) {
    return NextResponse.json(
      { success: false, message: "Bill not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: bill });
});

export const PATCH = withAdminApi(async (req) => {
  const id = extractId(req);
  const body = await req.json();
  const parsed = BillUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  try {
    const bill = await prisma.bill.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: bill });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, message: "Bill not found" },
          { status: 404 }
        );
      }
    }
    throw error;
  }
});
