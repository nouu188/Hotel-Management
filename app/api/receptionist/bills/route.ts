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

  const where: Prisma.BillWhereInput = {};

  if (status) {
    where.status = status as Prisma.EnumBillStatusFilter;
  }

  if (search) {
    where.OR = [
      { id: { contains: search, mode: "insensitive" } },
      {
        booking: {
          bookingGuest: {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      },
    ];
  }

  const [bills, total] = await Promise.all([
    prisma.bill.findMany({
      where,
      include: {
        booking: {
          include: {
            bookingGuest: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
        staff: { select: { id: true, name: true, role: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.bill.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      bills,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});
