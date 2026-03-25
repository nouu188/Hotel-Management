interface RoomTypeInfo {
  id: string;
  roomType: { price: number; name: string };
}

interface ServiceInfo {
  id: string;
  price: number;
  name: string;
}

interface BookingRoomItem {
  hotelBranchRoomTypeId: string;
  quantityBooked: number;
}

interface UsingServiceItem {
  serviceId: string;
  quantity: number;
}

export interface LineItem {
  name: string;
  unitAmount: number;
  quantity: number;
}

export interface BookingAmountResult {
  total: number;
  lineItems: LineItem[];
}

export function calculateBookingAmount({
  bookingRoomItems,
  roomTypes,
  numberOfNights,
  services,
  usingServiceItems,
}: {
  bookingRoomItems: BookingRoomItem[];
  roomTypes: RoomTypeInfo[];
  numberOfNights: number;
  services?: ServiceInfo[];
  usingServiceItems?: UsingServiceItem[];
}): BookingAmountResult {
  const lineItems: LineItem[] = [];
  let total = 0;

  for (const item of bookingRoomItems) {
    const roomTypeInfo = roomTypes.find(rt => rt.id === item.hotelBranchRoomTypeId);
    if (!roomTypeInfo) {
      throw new Error(`Room type info not found for ${item.hotelBranchRoomTypeId}`);
    }
    const itemTotal = roomTypeInfo.roomType.price * item.quantityBooked * numberOfNights;
    total += itemTotal;
    lineItems.push({
      name: `${roomTypeInfo.roomType.name} (${numberOfNights} night${numberOfNights > 1 ? 's' : ''})`,
      unitAmount: roomTypeInfo.roomType.price * numberOfNights,
      quantity: item.quantityBooked,
    });
  }

  if (usingServiceItems && services) {
    for (const item of usingServiceItems) {
      const serviceInfo = services.find(s => s.id === item.serviceId);
      if (!serviceInfo) {
        throw new Error(`Service not found for ${item.serviceId}`);
      }
      const itemTotal = serviceInfo.price * item.quantity;
      total += itemTotal;
      lineItems.push({
        name: serviceInfo.name,
        unitAmount: serviceInfo.price,
        quantity: item.quantity,
      });
    }
  }

  return { total, lineItems };
}
