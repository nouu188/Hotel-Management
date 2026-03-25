'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { formatVND, type RoomLineItem, type ServiceLineItem } from '../types';

const BOOKING_EXPIRY_MINUTES = 35;

function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

interface OrderSummaryCardProps {
  bookingId: string;
  createdAt: string;
  isCancelled: boolean;
  roomSubtotals: RoomLineItem[];
  serviceSubtotals: ServiceLineItem[];
  totalAmount: number;
}

export default function OrderSummaryCard({
  bookingId,
  createdAt,
  isCancelled,
  roomSubtotals,
  serviceSubtotals,
  totalAmount,
}: OrderSummaryCardProps) {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const calculateTimeLeft = useCallback(() => {
    const createdAtMs = new Date(createdAt).getTime();
    const expiresAt = createdAtMs + BOOKING_EXPIRY_MINUTES * 60 * 1000;
    return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  }, [createdAt]);

  useEffect(() => {
    if (isCancelled) return;

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft, isCancelled]);

  const isExpired = timeLeft !== null && timeLeft <= 0;

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || 'Failed to create checkout session.');
        return;
      }

      window.location.href = data.data.url;
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">
      <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

      <div className="space-y-3">
        {roomSubtotals.map((room, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {room.name} x{room.quantity}
            </span>
            <span className="font-medium text-gray-800">
              {formatVND(room.subtotal)}
            </span>
          </div>
        ))}
        {serviceSubtotals.map((service, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {service.name} x{service.quantity}
            </span>
            <span className="font-medium text-gray-800">
              {formatVND(service.subtotal)}
            </span>
          </div>
        ))}
      </div>

      <hr className="border-slate-200" />

      <div className="flex justify-between items-center">
        <span className="text-base font-bold text-gray-900">Total</span>
        <span className="text-xl font-bold text-[#077dab]">
          {formatVND(totalAmount)}
        </span>
      </div>

      <Button
        className={cn(
          'w-full h-12 text-base font-semibold rounded-xl',
          'bg-[#077dab] hover:bg-[#066a94] text-white'
        )}
        onClick={handlePayNow}
        disabled={loading || isCancelled || isExpired}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Processing...
          </>
        ) : isCancelled ? (
          'Booking Cancelled'
        ) : isExpired ? (
          'Booking Expired'
        ) : (
          'Pay Now'
        )}
      </Button>

      {!isCancelled && timeLeft !== null && (
        <div
          className={cn(
            'flex items-center justify-center gap-2 text-sm py-2 px-3 rounded-lg',
            isExpired
              ? 'bg-red-50 text-red-600'
              : timeLeft < 300
                ? 'bg-amber-50 text-amber-600'
                : 'bg-blue-50 text-[#077dab]'
          )}
        >
          <Clock size={16} />
          {isExpired ? (
            <span className="font-medium">Booking has expired</span>
          ) : (
            <span>
              <span className="font-mono font-semibold">
                {formatCountdown(timeLeft)}
              </span>{' '}
              remaining to complete payment
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
        <Lock size={14} />
        <span>Secured by Stripe. Your data is encrypted.</span>
      </div>
    </div>
  );
}
