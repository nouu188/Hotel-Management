import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { parseISO } from 'date-fns';
import { BookingRequestSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import { getBookingExpirationQueue } from "@/lib/queue";
import { calculateBookingAmount } from "@/lib/utils/price-calculation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = BookingRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, message: "Invalid input.", errors: validation.error.flatten() }, { status: 400 });
    }
    const { bookingGuest, bookingData, usingServiceItems, bookingRoomItems } = validation.data;

    const fromDate = parseISO(bookingData.fromDate);
    const toDate = parseISO(bookingData.toDate);

    const roomTypeIds = bookingRoomItems.map(item => item.hotelBranchRoomTypeId);
    const roomTypesDataPromise = prisma.hotelBranchRoomType.findMany({
      where: { id: { in: roomTypeIds } },
      include: { roomType: true },
    });

    const serviceIds = usingServiceItems?.map(item => item.serviceId) || [];
    const servicesDataPromise = prisma.service.findMany({ where: { id: { in: serviceIds } } });
    
    const [roomTypes, services] = await Promise.all([roomTypesDataPromise, servicesDataPromise]);

    const numberOfNights = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24));
    const { total: finalAmount } = calculateBookingAmount({
      bookingRoomItems,
      roomTypes,
      numberOfNights,
      services,
      usingServiceItems,
    });

    const result = await prisma.$transaction(async (tx) => {
      const availabilityChecksPromises = bookingRoomItems.map(item => 
        tx.roomAvailability.findMany({
          where: {
            hotelBranchRoomTypeId: item.hotelBranchRoomTypeId,
            date: { gte: bookingData.fromDate, lt: bookingData.toDate },
          },
        })
      );
      const allAvailabilities = await Promise.all(availabilityChecksPromises);

      for (let i = 0; i < bookingRoomItems.length; i++) {
        const item = bookingRoomItems[i];
        const availabilities = allAvailabilities[i];
        if (availabilities.length < numberOfNights) {
            throw new Error(`Dữ liệu kho phòng bị thiếu cho loại phòng ID ${item.hotelBranchRoomTypeId}`);
        }
        const notEnoughRoomDay = availabilities.find(avail => (avail.totalRooms - avail.bookedRooms) < item.quantityBooked);
        if (notEnoughRoomDay) {
            throw new Error(`Không đủ phòng trống cho loại phòng ID ${item.hotelBranchRoomTypeId}`);
        }
      }

      const newBooking = await tx.booking.create({ data: { userId: bookingData.userId, fromDate, toDate, status: 'PENDING' } });
      
      await Promise.all([
        tx.bookingRoomItem.createMany({ data: bookingRoomItems.map(item => ({ bookingId: newBooking.id, ...item })) }),
        tx.bookingGuest.create({ data: { ...bookingGuest, bookingId: newBooking.id } }),
        usingServiceItems && usingServiceItems.length > 0 
          ? tx.usingService.createMany({ data: usingServiceItems.map(item => ({ bookingId: newBooking.id, status: 'SCHEDULED', ...item })) })
          : Promise.resolve(), 
      ]);

      const inventoryUpdatePromises = bookingRoomItems.map(item =>
        tx.roomAvailability.updateMany({
          where: { hotelBranchRoomTypeId: item.hotelBranchRoomTypeId, date: { gte: fromDate, lt: toDate } },
          data: { bookedRooms: { increment: item.quantityBooked } },
        })
      );
      await Promise.all(inventoryUpdatePromises);

      return { newBooking };
    }, {
      timeout: 15000,
    });

    const PENDING_TIME_LIMIT_MS = 35 * 60 * 1000;
    const queue = getBookingExpirationQueue();
    await queue.add(
      'expire-booking-job',
      { bookingId: result.newBooking.id },
      {
        delay: PENDING_TIME_LIMIT_MS,
        jobId: result.newBooking.id,
      }
    );

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("!!! API ERROR CAUGHT (POST /booking):", error);

    let errorMessage = "An unexpected error occurred during booking creation.";
    let statusCode = 500;

    if (error instanceof SyntaxError) {
      errorMessage = "Invalid JSON format in request body.";
      statusCode = 400;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = `Database error: ${error.code}.`;
      if (error.code === 'P2002') {
        errorMessage = `Data conflict: A booking with similar details might already exist (Unique constraint failed on ${error.meta?.target}).`;
        statusCode = 409;
      } else if (error.code === 'P2003') {
        errorMessage = `Invalid reference: A related record (e.g., user, room type, service) was not found (Foreign key constraint failed on ${error.meta?.field_name}).`;
        statusCode = 400;
      } else if (error.code === 'P2025') {
        errorMessage = `Operation failed: A required record was not found. ${error.meta?.cause || ''}`;
        statusCode = 404;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
      if (
        errorMessage.startsWith("Invalid data for booking room item") ||
        errorMessage.startsWith("No valid room items to create") ||
        errorMessage.startsWith("Invalid service names") ||
        errorMessage.startsWith("Invalid quantity")
      ) {
        statusCode = 400;
      }
    }

    return NextResponse.json(
      { success: false, message: errorMessage, code: (error as any).code, meta: (error as any).meta },
      { status: statusCode }
    );
  }
}