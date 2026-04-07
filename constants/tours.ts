export interface TourPricingRow {
  label: string;
  price: string;
}

export interface TourServiceInBrief {
  name: string;
  slug: string;
  imgUrl: string[];
  altText: string;
  tagline: string;
  description: string;
  badges: string[];
  href: string;
}

export interface TourServiceDetail extends TourServiceInBrief {
  infoPanel: { line1: string; line2: string; line3: string; line4?: string };
  howItWorks: string[];
  includes: string[];
  requirements?: string[];
  pricing: TourPricingRow[];
  note?: string;
}

export const tourServicesInBrief: TourServiceInBrief[] = [
  {
    name: "Visa On Arrival",
    slug: "visa-on-arrival",
    href: "/tours/visa-on-arrival",
    imgUrl: ["/images/7.jpg"],
    altText: "Visa on arrival service",
    tagline: "Hassle-free Vietnam entry · From USD 25",
    description:
      "Our concierge team handles your Vietnam visa on arrival — from application to approval letter.",
    badges: ["2–3 day processing", "100+ eligible countries", "Email support"],
  },
  {
    name: "Transfer Services",
    slug: "transfer-services",
    href: "/tours/transfer-services",
    imgUrl: ["/images/8.jpg"],
    altText: "Airport transfer service",
    tagline: "Fixed price · Door-to-door comfort",
    description:
      "Private airport and city transfers in modern, air-conditioned vehicles with professional drivers.",
    badges: ["24/7 availability", "Fixed pricing", "Meet & greet service"],
  },
];

export const visaOnArrivalDetail: TourServiceDetail = {
  ...tourServicesInBrief[0],
  infoPanel: {
    line1: "Processing: 2–3 business days",
    line2: "Eligible: 100+ nationalities",
    line3: "Validity: 30 or 90 days",
    line4: "Support: English & Vietnamese",
  },
  howItWorks: [
    "Send your passport details and travel dates to the hotel concierge",
    "We submit your application to the immigration authority",
    "Receive your approval letter via email within 2–3 business days",
    "Present the letter at the visa on arrival counter at the airport",
    "Pay the stamping fee at the counter (payable in USD cash)",
  ],
  includes: [
    "Application processing fee",
    "Approval letter (emailed as PDF)",
    "24/7 email support for any questions",
  ],
  requirements: [
    "Passport valid for at least 6 months",
    "Passport-sized photo (digital copy accepted)",
    "Arrival and departure dates",
    "Vietnamese entry port (Tan Son Nhat International Airport)",
  ],
  pricing: [
    { label: "Single entry (30 days)", price: "USD 25" },
    { label: "Multiple entry (30 days)", price: "USD 50" },
    { label: "Single entry (90 days)", price: "USD 50" },
    { label: "Multiple entry (90 days)", price: "USD 95" },
    { label: "Stamping fee (paid at airport)", price: "USD 25 (cash only)" },
  ],
  note: "Prices are subject to change by Vietnamese immigration authorities. The hotel charges no additional service fee.",
};

export const transferServicesDetail: TourServiceDetail = {
  ...tourServicesInBrief[1],
  infoPanel: {
    line1: "Available: 24 hours / 7 days",
    line2: "Vehicle: 7-seat or 16-seat",
    line3: "Route: Airport ↔ Hotel",
    line4: "Booking: 24 hrs in advance",
  },
  howItWorks: [
    "Contact the front desk or concierge at least 24 hours before your transfer",
    "Provide your flight number, arrival/departure time, and number of passengers",
    "Our driver will meet you at the arrivals hall with a name board",
    "Payment is made at the hotel or directly to the driver",
  ],
  includes: [
    "Professional driver with name board at airport",
    "Air-conditioned vehicle",
    "Complimentary waiting time up to 60 minutes after scheduled arrival",
    "Meet & greet assistance",
  ],
  pricing: [
    {
      label: "Airport Transfer – 7-seater (1–4 pax, one way)",
      price: "VND 550,000",
    },
    {
      label: "Airport Transfer – 16-seater (5–10 pax, one way)",
      price: "VND 1,200,000",
    },
    { label: "City transfer (per trip, 7-seater)", price: "By quotation" },
  ],
  note: "Prices are per vehicle, per way. Toll fees are included.",
};
