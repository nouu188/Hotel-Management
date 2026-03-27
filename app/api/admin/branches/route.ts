import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { withAdminApi } from "@/lib/admin-auth";
import { BranchCreateSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";

export const GET = withAdminApi(async (req) => {
  const searchParams = req.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
  const search = searchParams.get("search");

  const where: Prisma.HotelBranchWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  const [branches, total] = await Promise.all([
    prisma.hotelBranch.findMany({
      where,
      include: {
        hotelBranchRoomTypes: {
          include: {
            roomType: { select: { name: true } },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.hotelBranch.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      branches,
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
  const parsed = BranchCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  try {
    const branch = await prisma.hotelBranch.create({
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: branch }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "A branch with this name already exists" },
        { status: 409 }
      );
    }
    throw error;
  }
});
