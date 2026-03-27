import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { withAdminApi } from "@/lib/admin-auth";
import { BranchUpdateSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";

function extractId(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split("/");
  return segments[segments.length - 1];
}

export const GET = withAdminApi(async (req) => {
  const id = extractId(req);

  const branch = await prisma.hotelBranch.findUnique({
    where: { id },
    include: {
      hotelBranchRoomTypes: {
        include: {
          roomType: true,
          availabilities: true,
        },
      },
    },
  });

  if (!branch) {
    return NextResponse.json(
      { success: false, message: "Branch not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: branch });
});

export const PATCH = withAdminApi(async (req) => {
  const id = extractId(req);
  const body = await req.json();
  const parsed = BranchUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  try {
    const branch = await prisma.hotelBranch.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: branch });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { success: false, message: "A branch with this name already exists" },
          { status: 409 }
        );
      }
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, message: "Branch not found" },
          { status: 404 }
        );
      }
    }
    throw error;
  }
});
