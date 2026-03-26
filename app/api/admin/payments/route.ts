import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Prisma.PaymentWhereInput = {};

    if (status) {
      where.status = status as Prisma.EnumPaymentStatusFilter;
    }

    if (search) {
      where.OR = [
        { bookingId: { contains: search, mode: "insensitive" } },
        { id: { contains: search, mode: "insensitive" } },
        { stripePaymentIntent: { contains: search, mode: "insensitive" } },
      ];
    }

    const [payments, total, paidSum, pendingSum, refundedSum] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: { booking: { include: { bookingGuest: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.payment.count({ where }),
      prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
      prisma.payment.aggregate({ where: { status: "PENDING" }, _sum: { amount: true } }),
      prisma.payment.aggregate({ where: { status: "REFUNDED" }, _sum: { amount: true } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        payments,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        summary: {
          totalRevenue: paidSum._sum.amount ?? 0,
          pendingAmount: pendingSum._sum.amount ?? 0,
          refundedAmount: refundedSum._sum.amount ?? 0,
        },
      },
    });
  } catch (error) {
    console.error("API Error (GET /api/admin/payments):", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
