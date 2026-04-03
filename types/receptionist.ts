import { BookingStatus } from "@prisma/client";

export type TodayBooking = {
  id: string;
  status: string;
  bookingGuest: { firstName: string; lastName: string } | null;
  user: { name: string };
  bookingRoomItems: Array<{
    hotelBranchRoomType: {
      roomType: { name: string };
      hotelBranch: { name: string };
    };
  }>;
};

export type ReceptionistStats = {
  pendingCheckIns: number;
  activeGuests: number;
  pendingCheckOuts: number;
  unpaidBills: number;
  todayCheckInList: TodayBooking[];
  todayCheckOutList: TodayBooking[];
};
