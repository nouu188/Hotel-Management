'use client';

import { format } from 'date-fns';
import { Calendar, MapPin, User, Clock } from 'lucide-react';

interface BookingSummaryCardProps {
  hotelBranchName: string;
  fromDate: Date;
  toDate: Date;
  numberOfNights: number;
  guestName: string | null;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="text-[#077dab] mt-0.5" />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default function BookingSummaryCard({
  hotelBranchName,
  fromDate,
  toDate,
  numberOfNights,
  guestName,
}: BookingSummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Booking Summary
      </h2>
      <div className="space-y-4">
        <InfoRow icon={MapPin} label="Hotel Branch" value={hotelBranchName} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow
            icon={Calendar}
            label="Check-in"
            value={format(fromDate, 'MMM dd, yyyy')}
          />
          <InfoRow
            icon={Calendar}
            label="Check-out"
            value={format(toDate, 'MMM dd, yyyy')}
          />
        </div>
        <InfoRow
          icon={Clock}
          label="Duration"
          value={`${numberOfNights} night${numberOfNights > 1 ? 's' : ''}`}
        />
        {guestName && (
          <InfoRow icon={User} label="Guest" value={guestName} />
        )}
      </div>
    </div>
  );
}
