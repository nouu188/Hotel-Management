import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { removeBookingExpirationJob } from "@/lib/queue";
import type Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const sig = request.headers.get("stripe-signature")!;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("[Webhook] Signature verification failed:", err);
      return NextResponse.json(
        { success: false, message: "Invalid signature." },
        { status: 400 }
      );
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;
        if (!bookingId) {
          console.error("[Webhook] Missing bookingId in session metadata.");
          break;
        }

        const payment = await prisma.payment.findUnique({
          where: { stripeSessionId: session.id },
        });

        if (!payment) {
          console.error(`[Webhook] Payment not found for session ${session.id}`);
          break;
        }

        if (payment.status === "PAID") {
          break;
        }

        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "PAID",
              stripePaymentIntent: session.payment_intent as string,
              paidAt: new Date(),
            },
          }),
          prisma.booking.update({
            where: { id: bookingId },
            data: { status: "CONFIRMED" },
          }),
        ]);

        await removeBookingExpirationJob(bookingId);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;

        const payment = await prisma.payment.findUnique({
          where: { stripeSessionId: session.id },
        });

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: "EXPIRED" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Unhandled error:", error);
    return NextResponse.json(
      { success: false, message: "Webhook handler failed." },
      { status: 500 }
    );
  }
}
