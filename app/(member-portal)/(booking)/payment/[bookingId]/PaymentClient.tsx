'use client';

import { differenceInCalendarDays } from 'date-fns';
import { BedDouble, ConciergeBell, AlertCircle } from 'lucide-react';
import { formatVND, type SerializedBooking } from '../types';
import BookingSummaryCard from './BookingSummaryCard';
import OrderSummaryCard from './OrderSummaryCard';

export default function PaymentClient({
  booking,
}: {
  booking: SerializedBooking;
}) {
  const isCancelled = booking.status === 'CANCELLED';

  const fromDate = new Date(booking.fromDate);
  const toDate = new Date(booking.toDate);
  const numberOfNights = differenceInCalendarDays(toDate, fromDate);

  const hotelBranchName =
    booking.bookingRoomItems[0]?.hotelBranchRoomType.hotelBranch.name ?? '';

  const guestName = booking.bookingGuest
    ? `${booking.bookingGuest.firstName} ${booking.bookingGuest.lastName}`
    : null;

  const roomSubtotals = booking.bookingRoomItems.map((item) => ({
    name: item.hotelBranchRoomType.roomType.name,
    quantity: item.quantityBooked,
    pricePerNight: item.hotelBranchRoomType.roomType.price,
    subtotal:
      item.hotelBranchRoomType.roomType.price *
      item.quantityBooked *
      numberOfNights,
  }));

  const serviceSubtotals = booking.usingservices.map((s) => ({
    name: s.service.name,
    quantity: s.quantity,
    unitPrice: s.service.price,
    subtotal: s.service.price * s.quantity,
  }));

  const totalAmount =
    roomSubtotals.reduce((sum, r) => sum + r.subtotal, 0) +
    serviceSubtotals.reduce((sum, s) => sum + s.subtotal, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="container mx-auto xl:px-35 py-8 px-4">
        <h1 className="playfair text-3xl font-bold text-gray-900 mb-8">
          Complete Your Payment
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {isCancelled && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
                <AlertCircle className="text-red-500 shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-red-800">
                    Booking Cancelled
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    This booking has been cancelled and is no longer available
                    for payment.
                  </p>
                </div>
              </div>
            )}

            <BookingSummaryCard
              hotelBranchName={hotelBranchName}
              fromDate={fromDate}
              toDate={toDate}
              numberOfNights={numberOfNights}
              guestName={guestName}
            />

            {/* Room Details */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BedDouble size={20} className="text-[#077dab]" />
                Room Details
              </h2>
              <div className="divide-y divide-slate-100">
                {roomSubtotals.map((room, i) => (
                  <div key={i} className="grid grid-cols-3 gap-4 py-3">
                    <div className="col-span-1">
                      <p className="text-sm text-gray-500">Room Type</p>
                      <p className="font-semibold text-gray-800">
                        {room.name}
                      </p>
                    </div>
                    <div className="col-span-1 text-center">
                      <p className="text-sm text-gray-500">
                        {room.quantity} room{room.quantity > 1 ? 's' : ''} x{' '}
                        {formatVND(room.pricePerNight)}/night
                      </p>
                    </div>
                    <div className="col-span-1 text-right">
                      <p className="font-semibold text-gray-800">
                        {formatVND(room.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            {serviceSubtotals.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ConciergeBell size={20} className="text-[#077dab]" />
                  Additional Services
                </h2>
                <div className="divide-y divide-slate-100">
                  {serviceSubtotals.map((service, i) => (
                    <div key={i} className="grid grid-cols-3 gap-4 py-3">
                      <div className="col-span-1">
                        <p className="font-semibold text-gray-800">
                          {service.name}
                        </p>
                      </div>
                      <div className="col-span-1 text-center">
                        <p className="text-sm text-gray-500">
                          {service.quantity} x {formatVND(service.unitPrice)}
                        </p>
                      </div>
                      <div className="col-span-1 text-right">
                        <p className="font-semibold text-gray-800">
                          {formatVND(service.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sticky Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <OrderSummaryCard
                bookingId={booking.id}
                createdAt={booking.createdAt}
                isCancelled={isCancelled}
                roomSubtotals={roomSubtotals}
                serviceSubtotals={serviceSubtotals}
                totalAmount={totalAmount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
