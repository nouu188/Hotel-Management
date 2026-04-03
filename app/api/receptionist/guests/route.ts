import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withReceptionistApi } from "@/lib/admin-auth";
import { Prisma } from "@prisma/client";

export const GET = withReceptionistApi(async (req) => {
  const searchParams = req.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
  const search = searchParams.get("search");
  const status = searchParams.get("status");

  const where: Prisma.UserWhereInput = { role: "USER" };

  if (status) {
    where.status = status as Prisma.EnumUserStatusFilter;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [guests, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        image: true,
        status: true,
        createdAt: true,
        _count: { select: { booking: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      guests,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});
