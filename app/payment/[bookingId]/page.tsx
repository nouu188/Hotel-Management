import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import PaymentClient from './PaymentClient';

function serializeBooking(booking: any) {
  return {
    ...booking,
    fromDate: booking.fromDate.toISOString(),
    toDate: booking.toDate.toISOString(),
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    bookingGuest: booking.bookingGuest
      ? {
          ...booking.bookingGuest,
          createdAt: booking.bookingGuest.createdAt.toISOString(),
          updatedAt: booking.bookingGuest.updatedAt.toISOString(),
        }
      : null,
    bookingRoomItems: booking.bookingRoomItems.map((item: any) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      hotelBranchRoomType: {
        ...item.hotelBranchRoomType,
        createdAt: item.hotelBranchRoomType.createdAt.toISOString(),
        updatedAt: item.hotelBranchRoomType.updatedAt.toISOString(),
        roomType: {
          ...item.hotelBranchRoomType.roomType,
          createdAt: item.hotelBranchRoomType.roomType.createdAt.toISOString(),
          updatedAt: item.hotelBranchRoomType.roomType.updatedAt.toISOString(),
        },
        hotelBranch: {
          ...item.hotelBranchRoomType.hotelBranch,
          createdAt: item.hotelBranchRoomType.hotelBranch.createdAt.toISOString(),
          updatedAt: item.hotelBranchRoomType.hotelBranch.updatedAt.toISOString(),
        },
      },
    })),
    usingservices: booking.usingservices.map((s: any) => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      service: {
        ...s.service,
        createdAt: s.service.createdAt.toISOString(),
        updatedAt: s.service.updatedAt.toISOString(),
      },
    })),
    payment: booking.payment
      ? {
          ...booking.payment,
          paidAt: booking.payment.paidAt?.toISOString() ?? null,
          createdAt: booking.payment.createdAt.toISOString(),
          updatedAt: booking.payment.updatedAt.toISOString(),
        }
      : null,
  };
}

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

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
    notFound();
  }

  if (booking.userId !== session.user.id) {
    redirect('/');
  }

  if (
    booking.status === 'CONFIRMED' &&
    booking.payment &&
    booking.payment.status === 'PAID'
  ) {
    redirect(
      `/payment/success?session_id=${booking.payment.stripeSessionId}`
    );
  }

  return <PaymentClient booking={serializeBooking(booking)} />;
}
