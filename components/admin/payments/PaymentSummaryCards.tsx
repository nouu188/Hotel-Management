"use client";

import { DollarSign, Clock, RotateCcw } from "lucide-react";
import { formatVND } from "../overview/KpiCardGrid";

interface PaymentSummaryData {
  totalRevenue: number;
  pendingAmount: number;
  refundedAmount: number;
}

export function PaymentSummaryCards({ data }: { data: PaymentSummaryData }) {
  const cards = [
    { title: "Total Revenue", value: formatVND(data.totalRevenue), icon: DollarSign, color: "text-green-600 bg-green-50" },
    { title: "Pending Payments", value: formatVND(data.pendingAmount), icon: Clock, color: "text-amber-600 bg-amber-50" },
    { title: "Total Refunds", value: formatVND(data.refundedAmount), icon: RotateCcw, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{card.title}</p>
              <p className="text-xl font-bold">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
