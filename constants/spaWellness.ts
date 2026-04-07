export interface SpaTreatment {
  name: string;
  duration: string;
  price: string;
  category: "massage" | "facial" | "body" | "package";
}

export interface FacilityInBrief {
  name: string;
  slug: string;
  href: string;
  imgUrl: string[];
  altText: string;
  tagline: string;
  description: string;
  badges: string[];
}

export interface FacilityDetail extends FacilityInBrief {
  infoPanel: { line1: string; line2: string; line3: string; line4?: string };
  highlights: string[];
  amenities: string[];
  treatments?: SpaTreatment[];
  policies?: string[];
}

export const facilitiesInBrief: FacilityInBrief[] = [
  {
    name: "La Spa",
    slug: "la-spa",
    href: "/health_care/la-spa",
    imgUrl: ["/images/5.jpg"],
    altText: "La Spa treatment room",
    tagline: "Holistic wellness · Signature treatments",
    description:
      "A sanctuary of relaxation and rejuvenation, La Spa offers signature treatments blending Eastern and Western techniques.",
    badges: ["Open 09:00–21:00", "Advance booking required", "Floor 6"],
  },
  {
    name: "Fitness Center",
    slug: "gym",
    href: "/health_care/gym",
    imgUrl: ["/images/11.jpg"],
    altText: "Hotel fitness center",
    tagline: "State-of-the-art equipment · Complimentary for guests",
    description:
      "Our fully equipped fitness center is available to all hotel guests, featuring modern cardio and strength training equipment.",
    badges: ["Open 06:00–22:00", "Complimentary for guests", "Floor 5"],
  },
  {
    name: "Swimming Pool",
    slug: "swimming-pool",
    href: "/health_care/swimming-pool",
    imgUrl: ["/images/10.jpg"],
    altText: "Hotel rooftop pool",
    tagline: "Rooftop pool · Panoramic city views",
    description:
      "Escape to our rooftop infinity pool with sweeping views of Ho Chi Minh City. Towels and loungers provided.",
    badges: ["Open 07:00–21:00", "Complimentary for guests", "Rooftop"],
  },
];

export const laSpaDetail: FacilityDetail = {
  ...facilitiesInBrief[0],
  infoPanel: {
    line1: "Hours: 09:00 – 21:00",
    line2: "Location: Floor 6",
    line3: "Advance booking: Required",
    line4: "Contact: concierge or ext. 601",
  },
  highlights: [
    "Signature La Siesta body ritual (120 minutes)",
    "Couples treatment rooms available",
    "Premium product lines: Elemis & ESPA",
    "Private steam room in each treatment suite",
  ],
  amenities: [
    "Steam shower in each treatment room",
    "Complimentary herbal tea and fruits post-treatment",
    "Plush robes and slippers provided",
    "Secure locker facilities",
  ],
  treatments: [
    {
      name: "Body Massage – Relaxation Treatment",
      duration: "90 minutes",
      price: "VND 1,100,000",
      category: "massage",
    },
    {
      name: "Body Massage – Tension Relief Therapy",
      duration: "90 minutes",
      price: "VND 1,100,000",
      category: "massage",
    },
    {
      name: "Body Massage – Hot Stone Massage",
      duration: "90 minutes",
      price: "VND 1,100,000",
      category: "massage",
    },
    {
      name: "Head, Neck & Back Massage",
      duration: "45 minutes",
      price: "VND 565,000",
      category: "massage",
    },
    {
      name: "Foot Massage",
      duration: "45 minutes",
      price: "VND 565,000",
      category: "massage",
    },
    {
      name: "Purifying Facial",
      duration: "60 minutes",
      price: "VND 950,000",
      category: "facial",
    },
    {
      name: "Anti-Aging Facial",
      duration: "75 minutes",
      price: "VND 1,200,000",
      category: "facial",
    },
    {
      name: "Body Scrub & Wrap",
      duration: "60 minutes",
      price: "VND 850,000",
      category: "body",
    },
    {
      name: "La Sieste Signature Package (massage + facial)",
      duration: "180 minutes",
      price: "VND 2,500,000",
      category: "package",
    },
  ],
  policies: [
    "Advance booking required — reserve at reception or concierge",
    "Please arrive 15 minutes before your appointment",
    "48-hour cancellation policy — full charge for late cancellations",
    "Minimum age: 18 years",
  ],
};

export const gymDetail: FacilityDetail = {
  ...facilitiesInBrief[1],
  infoPanel: {
    line1: "Hours: 06:00 – 22:00",
    line2: "Location: Floor 5",
    line3: "Access: Guest room key card",
    line4: "Complimentary for hotel guests",
  },
  highlights: [
    "Modern cardio equipment: treadmills, bikes, ellipticals",
    "Free weights and resistance machines",
    "Yoga mats and stretching area",
    "Complimentary access for all hotel guests",
  ],
  amenities: [
    "Air-conditioned environment",
    "Complimentary towel service",
    "Filtered water station",
    "Changing rooms with showers",
    "Locker facilities",
  ],
  policies: [
    "Access via guest room key card",
    "Appropriate gym attire required — no swimwear",
    "Equipment use is at guest's own risk",
    "Personal trainers available on request (additional charge)",
  ],
};

export const swimmingPoolDetail: FacilityDetail = {
  ...facilitiesInBrief[2],
  infoPanel: {
    line1: "Hours: 07:00 – 21:00",
    line2: "Location: Rooftop",
    line3: "Towels: Complimentary",
    line4: "Loungers: First-come basis",
  },
  highlights: [
    "Rooftop infinity pool with panoramic city views",
    "Heated pool (temperature: 28°C)",
    "Separate children's wading pool",
    "Poolside bar service available",
  ],
  amenities: [
    "Complimentary towel service",
    "Sun loungers and umbrellas",
    "Poolside bar (Twilight Bar service 11:00–21:00)",
    "Changing rooms adjacent to pool",
  ],
  policies: [
    "Hotel guests only — guest room key card required",
    "Swimwear required at all times",
    "No glassware in pool area",
    "Children under 12 must be accompanied by an adult",
  ],
};
