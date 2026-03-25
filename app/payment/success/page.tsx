import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import InvoiceClient from './InvoiceClient';

function serializePaymentData(payment: any) {
  const booking = payment.booking;
  return {
    id: payment.id,
    stripePaymentIntent: payment.stripePaymentIntent,
    amount: payment.amount,
    status: payment.status,
    paidAt: payment.paidAt?.toISOString() ?? null,
    booking: {
      id: booking.id,
      fromDate: booking.fromDate.toISOString(),
      toDate: booking.toDate.toISOString(),
      status: booking.status,
      bookingGuest: booking.bookingGuest
        ? {
            firstName: booking.bookingGuest.firstName,
            lastName: booking.bookingGuest.lastName,
            email: booking.bookingGuest.email,
          }
        : null,
      bookingRoomItems: booking.bookingRoomItems.map((item: any) => ({
        id: item.id,
        quantityBooked: item.quantityBooked,
        hotelBranchRoomType: {
          roomType: {
            name: item.hotelBranchRoomType.roomType.name,
            price: item.hotelBranchRoomType.roomType.price,
          },
          hotelBranch: {
            name: item.hotelBranchRoomType.hotelBranch.name,
          },
        },
      })),
      usingservices: booking.usingservices.map((s: any) => ({
        id: s.id,
        quantity: s.quantity,
        service: {
          name: s.service.name,
          price: s.service.price,
        },
      })),
    },
  };
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect('/');
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const payment = await prisma.payment.findUnique({
    where: { stripeSessionId: session_id },
    include: {
      booking: {
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
        },
      },
    },
  });

  if (!payment || payment.booking.userId !== session.user.id) {
    redirect('/');
  }

  return <InvoiceClient data={serializePaymentData(payment)} />;
}
