import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { withAdminApi } from "@/lib/admin-auth";
import { UpdateStaffSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";

function extractId(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split("/");
  return segments[segments.length - 1];
}

export const GET = withAdminApi(async (req) => {
  const id = extractId(req);

  const staff = await prisma.staff.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, status: true } },
    },
  });

  if (!staff) {
    return NextResponse.json(
      { success: false, message: "Staff not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: staff });
});

export const PATCH = withAdminApi(async (req) => {
  const id = extractId(req);
  const body = await req.json();
  const result = UpdateStaffSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.error.errors[0].message },
      { status: 400 }
    );
  }

  const { name, staffRole, status } = result.data;

  try {
    const staff = await prisma.$transaction(async (tx) => {
      const updated = await tx.staff.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(staffRole !== undefined && { role: staffRole }),
          ...(status !== undefined && { status }),
        },
        include: {
          user: { select: { id: true, name: true, email: true, status: true } },
        },
      });

      if (status === "TERMINATED" && updated.userId) {
        await tx.user.update({
          where: { id: updated.userId },
          data: { status: "SUSPENDED" },
        });
      }

      return updated;
    });

    return NextResponse.json({ success: true, data: staff });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Staff not found" },
        { status: 404 }
      );
    }
    throw error;
  }
});
