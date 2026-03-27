import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withAdminApi } from "@/lib/admin-auth";
import { InventoryCreateSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";

export const GET = withAdminApi(async (req) => {
  const searchParams = req.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
  const branchId = searchParams.get("branchId");
  const status = searchParams.get("status");

  const where: Prisma.HotelBranchRoomTypeWhereInput = {};

  if (branchId) {
    where.hotelBranchId = branchId;
  }

  if (status) {
    where.status = status as Prisma.EnumInventoryStatusFilter;
  }

  const [inventory, total] = await Promise.all([
    prisma.hotelBranchRoomType.findMany({
      where,
      include: {
        roomType: true,
        hotelBranch: { select: { id: true, name: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.hotelBranchRoomType.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      inventory,
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
  const parsed = InventoryCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { hotelBranchId, roomTypeId, quantity } = parsed.data;

  const record = await prisma.hotelBranchRoomType.upsert({
    where: {
      hotelBranchId_roomTypeId: { hotelBranchId, roomTypeId },
    },
    update: { quantity },
    create: { hotelBranchId, roomTypeId, quantity },
  });

  return NextResponse.json({ success: true, data: record }, { status: 201 });
});
