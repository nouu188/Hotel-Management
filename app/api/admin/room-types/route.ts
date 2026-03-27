import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withAdminApi } from "@/lib/admin-auth";
import { RoomTypeCreateSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";

export const GET = withAdminApi(async (req) => {
  const searchParams = req.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
  const search = searchParams.get("search");

  const where: Prisma.RoomTypeWhereInput = {};

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  const [roomTypes, total] = await Promise.all([
    prisma.roomType.findMany({
      where,
      include: {
        hotelBranchRoomTypes: {
          include: {
            hotelBranch: { select: { name: true } },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.roomType.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      roomTypes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

export const POST = withAdminApi(async (req) => {
  const body = await req.json();
  const parsed = RoomTypeCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const roomType = await prisma.roomType.create({
    data: parsed.data,
  });

  return NextResponse.json({ success: true, data: roomType }, { status: 201 });
});
