export interface SpecialOffer {
  id: string;
  name: string;
  imgUrl: string[];
  altText: string;
  tagline: string;
  description: string;
  includes: string[];
  terms: string[];
  badge?: string;
}

export const specialOffers: SpecialOffer[] = [
  {
    id: "early-bird",
    name: "Early Bird Discount",
    imgUrl: ["/images/1.jpg"],
    altText: "Hotel room",
    tagline: "Save 20% · Book 30 days in advance",
    description: "Book at least 30 days in advance and enjoy 20% off our best available rate.",
    includes: ["20% discount on room rate", "Daily complimentary breakfast for 2", "Early check-in from 12:00 (subject to availability)"],
    terms: ["Non-refundable — payment charged at booking", "Valid for stays Jan 1 – Dec 31, 2026", "Cannot be combined with other offers"],
    badge: "Best Value",
  },
  {
    id: "romance-package",
    name: "Romance Package",
    imgUrl: ["/images/12.jpg"],
    altText: "Junior Suite",
    tagline: "For two · Starting from USD 350/night",
    description: "Celebrate a special occasion with a curated romance package featuring exclusive extras.",
    includes: ["Bottle of champagne on arrival", "In-room flower decoration", "Romantic turndown service", "Late check-out until 15:00"],
    terms: ["Available in Junior Suite and above", "Must be booked 7 days in advance", "Subject to availability"],
    badge: "Limited Time",
  },
  {
    id: "spa-retreat",
    name: "Spa Retreat Package",
    imgUrl: ["/images/5.jpg"],
    altText: "Spa",
    tagline: "Relax & renew · Min. 2 nights",
    description: "Rejuvenate with our curated spa package combining luxurious accommodation with signature treatments.",
    includes: ["Daily breakfast for 2", "One 90-minute massage per person", "15% discount on additional spa services", "Complimentary healthy snack platter"],
    terms: ["Minimum 2-night stay required", "Advance booking required for spa treatments", "Non-transferable"],
  },
  {
    id: "long-stay",
    name: "Long Stay Offer",
    imgUrl: ["/images/9.jpg"],
    altText: "Executive Room",
    tagline: "Stay 7+ nights · Save 30%",
    description: "Extended stays deserve exceptional value. Enjoy 30% off when you book 7 or more consecutive nights.",
    includes: ["30% discount on room rate", "Daily breakfast for 2", "One complimentary airport transfer", "Weekly laundry service"],
    terms: ["Minimum 7 consecutive nights", "Non-refundable after check-in", "Rate applies to base room category"],
    badge: "Early Bird",
  },
];
