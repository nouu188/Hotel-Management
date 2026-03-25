export interface SerializedBooking {
  id: string;
  userId: string;
  fromDate: string;
  toDate: string;
  status: string;
  createdAt: string;
  bookingGuest: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  bookingRoomItems: {
    id: string;
    quantityBooked: number;
    hotelBranchRoomType: {
      roomType: {
        name: string;
        price: number;
        capacity: number;
        bedType: string | null;
        image: string[];
      };
      hotelBranch: {
        name: string;
      };
    };
  }[];
  usingservices: {
    id: string;
    quantity: number;
    service: {
      name: string;
      price: number;
    };
  }[];
  payment: {
    status: string;
    stripeSessionId: string;
    stripePaymentIntent: string | null;
    paidAt: string | null;
    amount: number;
  } | null;
}

export interface RoomLineItem {
  name: string;
  quantity: number;
  pricePerNight: number;
  subtotal: number;
}

export interface ServiceLineItem {
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
