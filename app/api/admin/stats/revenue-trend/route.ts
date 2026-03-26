import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { subDays, startOfDay, eachDayOfInterval, format } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const days = parseInt(request.nextUrl.searchParams.get("days") || "30", 10);
    const today = new Date();
    const startDate = startOfDay(subDays(today, days));

    const results = await prisma.$queryRaw<Array<{ date: string; revenue: number }>>`
      SELECT DATE("paidAt")::text as date, COALESCE(SUM(amount), 0)::float as revenue
      FROM "Payment"
      WHERE status = 'PAID' AND "paidAt" >= ${startDate}
      GROUP BY DATE("paidAt")
      ORDER BY date ASC
    `;

    const revenueMap = new Map(results.map((r) => [r.date, r.revenue]));

    const data = eachDayOfInterval({ start: startDate, end: today }).map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      return { date: dateStr, revenue: revenueMap.get(dateStr) || 0 };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("API Error (GET /api/admin/stats/revenue-trend):", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
