import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withAdminApi } from "@/lib/admin-auth";
import { InventoryUpdateSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";

function extractId(req: Request): string {
  return new URL(req.url).pathname.split("/").pop()!;
}

export const PATCH = withAdminApi(async (req) => {
  const id = extractId(req);
  const body = await req.json();
  const parsed = InventoryUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  try {
    const record = await prisma.hotelBranchRoomType.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Inventory record not found" },
        { status: 404 }
      );
    }
    throw error;
  }
});
