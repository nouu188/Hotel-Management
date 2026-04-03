import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withAdminApi } from "@/lib/admin-auth";
import { Prisma } from "@prisma/client";
import { CreateStaffSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

export const GET = withAdminApi(async (req) => {
  const searchParams = req.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
  const search = searchParams.get("search");
  const role = searchParams.get("role");
  const status = searchParams.get("status");

  const where: Prisma.StaffWhereInput = {};

  if (role) {
    where.role = role as Prisma.EnumStaffRoleFilter;
  }

  if (status) {
    where.status = status as Prisma.EnumStaffStatusFilter;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [staff, total] = await Promise.all([
    prisma.staff.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.staff.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      staff,
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
  const result = CreateStaffSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.error.errors[0].message },
      { status: 400 }
    );
  }

  const { name, email, password, staffRole, enrollDate } = result.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { success: false, message: "Email is already in use" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const staff = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "RECEPTIONIST",
      },
    });

    return tx.staff.create({
      data: {
        name,
        role: staffRole,
        enrollDate: new Date(enrollDate),
        userId: newUser.id,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  });

  return NextResponse.json({ success: true, data: staff }, { status: 201 });
});
