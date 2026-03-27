import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withAdminApi } from "@/lib/admin-auth";
import { RoomTypeUpdateSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";

function extractId(req: Request): string {
  return new URL(req.url).pathname.split("/").pop()!;
}

export const PATCH = withAdminApi(async (req) => {
  const id = extractId(req);
  const body = await req.json();
  const parsed = RoomTypeUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  try {
    const roomType = await prisma.roomType.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: roomType });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Room type not found" },
        { status: 404 }
      );
    }
    throw error;
  }
});
