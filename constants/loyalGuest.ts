export interface LoyaltyTier {
  name: string;
  color: string;
  minNights: number;
  maxNights: number | null;
  benefits: string[];
}

export interface PointRule {
  action: string;
  pointsEarned: string;
}

export interface RedemptionOption {
  name: string;
  pointsRequired: string;
  description: string;
}

export const loyaltyTiers: LoyaltyTier[] = [
  {
    name: "Silver",
    color: "#C0C0C0",
    minNights: 1,
    maxNights: 9,
    benefits: [
      "Priority check-in",
      "Welcome amenity on arrival",
      "Late check-out until 14:00 (subject to availability)",
      "5% discount on spa treatments",
    ],
  },
  {
    name: "Gold",
    color: "#BF882E",
    minNights: 10,
    maxNights: 24,
    benefits: [
      "All Silver benefits",
      "Complimentary room upgrade (subject to availability)",
      "Daily complimentary breakfast for 2",
      "10% discount on spa treatments",
      "Dedicated concierge service",
    ],
  },
  {
    name: "Platinum",
    color: "#4A4A6A",
    minNights: 25,
    maxNights: null,
    benefits: [
      "All Gold benefits",
      "Guaranteed room upgrade",
      "Airport transfer (one-way, complimentary)",
      "15% discount on all dining",
      "Annual personal gifting",
      "VIP event invitations",
    ],
  },
];

export const pointRules: PointRule[] = [
  { action: "Room Booking", pointsEarned: "10 pts per USD spent" },
  { action: "Spa Treatment", pointsEarned: "5 pts per USD spent" },
  { action: "Dining", pointsEarned: "3 pts per USD spent" },
  { action: "Direct Booking Bonus", pointsEarned: "+50 pts per stay" },
  { action: "Referral", pointsEarned: "200 pts per successful referral" },
];

export const redemptionOptions: RedemptionOption[] = [
  {
    name: "Free Night Stay",
    pointsRequired: "1,000 pts",
    description: "Redeem for one complimentary night in a Superior Room.",
  },
  {
    name: "Spa Credit",
    pointsRequired: "300 pts",
    description: "USD 30 credit towards any La Spa treatment.",
  },
  {
    name: "Dining Credit",
    pointsRequired: "150 pts",
    description: "USD 15 credit at Cloud Nine or Twilight Bar.",
  },
  {
    name: "Airport Transfer",
    pointsRequired: "250 pts",
    description: "One-way airport transfer in a 7-seater vehicle.",
  },
];
