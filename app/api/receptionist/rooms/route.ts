import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withReceptionistApi } from "@/lib/admin-auth";
import { startOfDay, endOfDay } from "date-fns";

export const GET = withReceptionistApi(async (req) => {
  const searchParams = req.nextUrl.searchParams;
  const branchId = searchParams.get("branchId");

  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  const where = branchId ? { hotelBranchId: branchId } : {};

  const entries = await prisma.hotelBranchRoomType.findMany({
    where,
    include: {
      hotelBranch: true,
      roomType: true,
      availabilities: {
        where: {
          date: { gte: todayStart, lte: todayEnd },
        },
      },
    },
  });

  const branchMap = new Map<
    string,
    {
      branch: { id: string; name: string; location: string };
      rooms: {
        id: string;
        roomType: { name: string; capacity: number; price: number };
        quantity: number;
        availableRooms: number;
        status: string;
      }[];
    }
  >();

  for (const entry of entries) {
    const { hotelBranch, roomType, availabilities, id, quantity, status } = entry;
    const todayAvailability = availabilities[0];
    const bookedRooms = todayAvailability?.bookedRooms ?? 0;
    const availableRooms = quantity - bookedRooms;

    if (!branchMap.has(hotelBranch.id)) {
      branchMap.set(hotelBranch.id, {
        branch: {
          id: hotelBranch.id,
          name: hotelBranch.name,
          location: hotelBranch.location,
        },
        rooms: [],
      });
    }

    branchMap.get(hotelBranch.id)!.rooms.push({
      id,
      roomType: {
        name: roomType.name,
        capacity: roomType.capacity,
        price: roomType.price,
      },
      quantity,
      availableRooms,
      status,
    });
  }

  const result = Array.from(branchMap.values());

  return NextResponse.json({ success: true, data: result });
});
