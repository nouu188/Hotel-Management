import { withAdminApi } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { subDays, startOfDay, eachDayOfInterval, format } from "date-fns";

export const GET = withAdminApi(async (req) => {
  const days = parseInt(req.nextUrl.searchParams.get("days") || "30", 10);
  const start = startOfDay(subDays(new Date(), days));

  const [payments, statusCounts] = await Promise.all([
    prisma.payment.findMany({
      where: { status: "PAID", paidAt: { gte: start } },
      select: { amount: true, paidAt: true },
    }),
    prisma.payment.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  const revenueMap = new Map<string, number>();
  const dayRange = eachDayOfInterval({ start, end: new Date() });
  for (const day of dayRange) revenueMap.set(format(day, "yyyy-MM-dd"), 0);
  for (const p of payments) {
    if (p.paidAt) {
      const key = format(p.paidAt, "yyyy-MM-dd");
      revenueMap.set(key, (revenueMap.get(key) ?? 0) + p.amount);
    }
  }
  const revenueByDay = Array.from(revenueMap.entries()).map(
    ([date, revenue]) => ({ date, revenue })
  );

  const byStatus = statusCounts.map((s) => ({
    status: s.status,
    count: s._count.status,
  }));

  return NextResponse.json({
    success: true,
    data: { revenueByDay, byStatus },
  });
});
