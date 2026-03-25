import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    const { bookingId } = await params;

    const payment = await prisma.payment.findUnique({
      where: { bookingId },
      include: { booking: true },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Payment not found." },
        { status: 404 }
      );
    }

    if (payment.booking.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "You do not have permission to access this payment." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: payment });
  } catch (error) {
    console.error("[API] GET /payments/[bookingId] error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
