import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const results = await prisma.booking.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    const data = results.map((r) => ({ status: r.status, count: r._count._all }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("API Error (GET /api/admin/stats/bookings-by-status):", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
