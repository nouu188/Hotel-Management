'use client';

import Link from 'next/link';
import { format, differenceInCalendarDays } from 'date-fns';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  CreditCard,
  Receipt,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface InvoiceData {
  id: string;
  stripePaymentIntent: string | null;
  amount: number;
  status: string;
  paidAt: string | null;
  booking: {
    id: string;
    fromDate: string;
    toDate: string;
    status: string;
    bookingGuest: {
      firstName: string;
      lastName: string;
      email: string;
    } | null;
    bookingRoomItems: {
      id: string;
      quantityBooked: number;
      hotelBranchRoomType: {
        roomType: { name: string; price: number };
        hotelBranch: { name: string };
      };
    }[];
    usingservices: {
      id: string;
      quantity: number;
      service: { name: string; price: number };
    }[];
  };
}

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100">
      <p className="text-sm text-gray-500 col-span-1">{label}</p>
      <div className="col-span-2 text-sm font-medium text-gray-800">
        {children}
      </div>
    </div>
  );
}

export default function InvoiceClient({ data }: { data: InvoiceData }) {
  const { booking } = data;
  const fromDate = new Date(booking.fromDate);
  const toDate = new Date(booking.toDate);
  const numberOfNights = differenceInCalendarDays(toDate, fromDate);

  const hotelBranchName =
    booking.bookingRoomItems[0]?.hotelBranchRoomType.hotelBranch.name ?? '';

  const roomLines = booking.bookingRoomItems.map((item) => ({
    name: item.hotelBranchRoomType.roomType.name,
    quantity: item.quantityBooked,
    unitPrice: item.hotelBranchRoomType.roomType.price,
    subtotal:
      item.hotelBranchRoomType.roomType.price *
      item.quantityBooked *
      numberOfNights,
  }));

  const serviceLines = booking.usingservices.map((s) => ({
    name: s.service.name,
    quantity: s.quantity,
    unitPrice: s.service.price,
    subtotal: s.service.price * s.quantity,
  }));

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="text-emerald-600" size={36} />
              </div>
            </div>
            <h1 className="playfair text-2xl font-bold text-gray-900">
              Payment Successful
            </h1>
            <p className="text-gray-500 mt-2">
              Thank you for your booking
            </p>
          </div>

          <div className="px-8 py-6 space-y-8">
            {/* Invoice Details */}
            <section>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Receipt size={16} />
                Invoice Details
              </h2>
              <div>
                <DetailRow label="Booking Reference">
                  <span className="font-mono">
                    #{booking.id.slice(0, 8).toUpperCase()}
                  </span>
                </DetailRow>
                {data.stripePaymentIntent && (
                  <DetailRow label="Transaction ID">
                    <span className="font-mono">
                      {data.stripePaymentIntent.slice(0, 12)}
                    </span>
                  </DetailRow>
                )}
                {data.paidAt && (
                  <DetailRow label="Payment Date">
                    {format(new Date(data.paidAt), 'MMM dd, yyyy')}
                  </DetailRow>
                )}
                <DetailRow label="Status">
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                    PAID
                  </Badge>
                </DetailRow>
              </div>
            </section>

            {/* Hotel & Stay */}
            <section>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin size={16} />
                Hotel &amp; Stay
              </h2>
              <div>
                <DetailRow label="Hotel Branch">
                  {hotelBranchName}
                </DetailRow>
                <DetailRow label="Check-in">
                  <span className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#077dab]" />
                    {format(fromDate, 'MMM dd, yyyy')}
                  </span>
                </DetailRow>
                <DetailRow label="Check-out">
                  <span className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#077dab]" />
                    {format(toDate, 'MMM dd, yyyy')}
                  </span>
                </DetailRow>
                <DetailRow label="Duration">
                  <span className="flex items-center gap-2">
                    <Clock size={14} className="text-[#077dab]" />
                    {numberOfNights} night{numberOfNights > 1 ? 's' : ''}
                  </span>
                </DetailRow>
                {booking.bookingGuest && (
                  <DetailRow label="Guest">
                    <span className="flex items-center gap-2">
                      <User size={14} className="text-[#077dab]" />
                      {booking.bookingGuest.firstName}{' '}
                      {booking.bookingGuest.lastName}
                    </span>
                  </DetailRow>
                )}
              </div>
            </section>

            {/* Room Details */}
            <section>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Room Details
              </h2>
              <div className="rounded-lg border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-slate-50 text-xs font-semibold text-gray-500 uppercase">
                  <div className="col-span-5">Room</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Unit Price</div>
                  <div className="col-span-3 text-right">Subtotal</div>
                </div>
                {roomLines.map((room, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-12 gap-2 px-4 py-3 border-t border-slate-100 text-sm"
                  >
                    <div className="col-span-5 font-medium text-gray-800">
                      {room.name}
                    </div>
                    <div className="col-span-2 text-center text-gray-600">
                      {room.quantity}
                    </div>
                    <div className="col-span-2 text-right text-gray-600">
                      {formatVND(room.unitPrice)}
                    </div>
                    <div className="col-span-3 text-right font-medium text-gray-800">
                      {formatVND(room.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Services */}
            {serviceLines.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Additional Services
                </h2>
                <div className="rounded-lg border border-slate-100 overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-slate-50 text-xs font-semibold text-gray-500 uppercase">
                    <div className="col-span-5">Service</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Unit Price</div>
                    <div className="col-span-3 text-right">Subtotal</div>
                  </div>
                  {serviceLines.map((service, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 gap-2 px-4 py-3 border-t border-slate-100 text-sm"
                    >
                      <div className="col-span-5 font-medium text-gray-800">
                        {service.name}
                      </div>
                      <div className="col-span-2 text-center text-gray-600">
                        {service.quantity}
                      </div>
                      <div className="col-span-2 text-right text-gray-600">
                        {formatVND(service.unitPrice)}
                      </div>
                      <div className="col-span-3 text-right font-medium text-gray-800">
                        {formatVND(service.subtotal)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Total */}
            <div className="border-t-2 border-slate-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">
                  Total Paid
                </span>
                <span className="text-2xl font-bold text-[#077dab]">
                  {formatVND(data.amount)}
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 pb-2">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl"
                asChild
              >
                <Link href="/user">
                  <CreditCard size={16} />
                  Back to Dashboard
                </Link>
              </Button>
              <Button
                className="flex-1 h-11 rounded-xl bg-[#077dab] hover:bg-[#066a94] text-white"
                asChild
              >
                <Link href="/">Book Another Room</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
