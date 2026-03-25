import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { CreateCheckoutSessionSchema } from "@/lib/validation";
import { calculateBookingAmount } from "@/lib/utils/price-calculation";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = CreateCheckoutSessionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Invalid input.", errors: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { bookingId } = validation.data;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        bookingRoomItems: {
          include: {
            hotelBranchRoomType: {
              include: { roomType: true, hotelBranch: true },
            },
          },
        },
        usingservices: { include: { service: true } },
        bookingGuest: true,
        payment: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found." },
        { status: 404 }
      );
    }

    if (booking.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "You do not have permission to access this booking." },
        { status: 403 }
      );
    }

    if (booking.status !== "PENDING") {
      return NextResponse.json(
        { success: false, message: "Booking is not in a payable state." },
        { status: 400 }
      );
    }

    if (booking.payment?.stripeSessionId) {
      const existingSession = await stripe.checkout.sessions.retrieve(
        booking.payment.stripeSessionId
      );
      if (existingSession.status === "open") {
        return NextResponse.json({
          success: true,
          data: { url: existingSession.url },
        });
      }
    }

    const roomTypeIds = booking.bookingRoomItems.map(
      (item) => item.hotelBranchRoomTypeId
    );
    const serviceIds = booking.usingservices.map((item) => item.serviceId);

    const [roomTypes, services] = await Promise.all([
      prisma.hotelBranchRoomType.findMany({
        where: { id: { in: roomTypeIds } },
        include: { roomType: true },
      }),
      prisma.service.findMany({
        where: { id: { in: serviceIds } },
      }),
    ]);

    const numberOfNights = Math.ceil(
      (booking.toDate.getTime() - booking.fromDate.getTime()) /
        (1000 * 3600 * 24)
    );

    const usingServiceItems = booking.usingservices.map((s) => ({
      serviceId: s.serviceId,
      quantity: s.quantity,
    }));

    const bookingRoomItems = booking.bookingRoomItems.map((item) => ({
      hotelBranchRoomTypeId: item.hotelBranchRoomTypeId,
      quantityBooked: item.quantityBooked,
    }));

    const { total, lineItems } = calculateBookingAmount({
      bookingRoomItems,
      roomTypes,
      numberOfNights,
      services,
      usingServiceItems,
    });

    const stripeLineItems = lineItems.map((item) => ({
      price_data: {
        currency: "vnd",
        product_data: { name: item.name },
        unit_amount: item.unitAmount,
      },
      quantity: item.quantity,
    }));

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: stripeLineItems,
      metadata: { bookingId: booking.id },
      customer_email: booking.bookingGuest?.email,
      success_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/${booking.id}`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    if (booking.payment) {
      await prisma.payment.update({
        where: { id: booking.payment.id },
        data: { stripeSessionId: checkoutSession.id },
      });
    } else {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          stripeSessionId: checkoutSession.id,
          amount: total,
          currency: "vnd",
          status: "PENDING",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: { url: checkoutSession.url },
    });
  } catch (error) {
    console.error("[API] POST /payments/create-checkout-session error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
