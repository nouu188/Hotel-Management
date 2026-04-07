export interface VenueInBrief {
  name: string;
  slug: string;
  href: string;
  imgUrl: string[];
  altText: string;
  tagline: string;
  description: string;
  badges: string[];
}

export interface MenuCategory {
  name: string;
  items: string[];
}

export interface VenueDetail extends VenueInBrief {
  infoPanel: { line1: string; line2: string; line3: string; line4?: string };
  highlights: string[];
  menuHighlights: string[];
  atmosphere: string[];
  reservationNote?: string;
}

export interface InRoomDiningDetail extends VenueInBrief {
  menuCategories: MenuCategory[];
  orderNote: string;
}

export const venuesInBrief: VenueInBrief[] = [
  {
    name: "Cloud Nine Saigon Restaurant",
    slug: "cloud-nine-saigon-restaurant",
    href: "/wine_dine/cloud-nine-saigon-restaurant",
    imgUrl: ["/images/3.jpg"],
    altText: "Cloud Nine Saigon Restaurant",
    tagline: "Fine Dining · Floor 2 · Open daily",
    description:
      "Our signature restaurant offers a refined dining experience with an extensive menu celebrating Vietnamese and international cuisine.",
    badges: ["Open 06:00–22:00", "Breakfast included", "Floor 2"],
  },
  {
    name: "Twilight Bar Saigon",
    slug: "twightlight-bar-saigon",
    href: "/wine_dine/twightlight-bar-saigon",
    imgUrl: ["/images/4.jpg"],
    altText: "Twilight Sky Bar Saigon",
    tagline: "Rooftop bar · Panoramic views · Sunset cocktails",
    description:
      "Perched on the rooftop, Twilight Bar Saigon is the perfect spot for sunset cocktails and panoramic views over Ho Chi Minh City.",
    badges: ["Open 11:00–24:00", "Rooftop level", "Cocktail bar"],
  },
  {
    name: "In-Room Dining",
    slug: "inroom-dining",
    href: "/wine_dine/inroom-dining",
    imgUrl: ["/images/1.jpg"],
    altText: "In-room dining setup",
    tagline: "Available 24/7 · Delivered to your room",
    description:
      "Enjoy a curated selection of dishes and beverages delivered directly to your room, any time of day or night.",
    badges: ["Available 24/7", "Full menu", "45 min delivery"],
  },
];

export const cloudNineDetail: VenueDetail = {
  ...venuesInBrief[0],
  infoPanel: {
    line1: "Hours: 06:00 – 22:00",
    line2: "Location: Floor 2",
    line3: "Dress code: Smart casual",
    line4: "Reservations: Recommended",
  },
  highlights: [
    "Daily complimentary breakfast included with most room types",
    "À la carte menu available all day",
    "Private dining room for groups of 8–20 guests",
    "Curated wine list featuring French and New World selections",
  ],
  menuHighlights: [
    "Vietnamese spring rolls with fresh herbs",
    "Grilled sea bass with lemongrass butter",
    "Wagyu beef tenderloin with truffle jus",
    "Chef's selection of artisanal cheeses",
    "Bespoke dessert tasting menu",
  ],
  atmosphere: [
    "Elegant, contemporary décor with warm lighting",
    "Floor-to-ceiling windows with city views",
    "Outdoor terrace seating (weather permitting)",
    "Live acoustic music on Friday and Saturday evenings",
  ],
  reservationNote:
    "Reservations are recommended for dinner service, especially on weekends.",
};

export const twilightBarDetail: VenueDetail = {
  ...venuesInBrief[1],
  infoPanel: {
    line1: "Hours: 11:00 – 24:00",
    line2: "Location: Rooftop",
    line3: "Happy Hour: 17:00–19:00",
    line4: "Dress code: Smart casual",
  },
  highlights: [
    "360° panoramic views of Ho Chi Minh City skyline",
    "Signature cocktail menu crafted by our resident mixologist",
    "Extensive selection of imported spirits and local craft beers",
    "Happy Hour daily from 17:00–19:00 (buy 1 get 1 free)",
  ],
  menuHighlights: [
    "Saigon Sunset — rum, passionfruit, lime, ginger beer",
    "La Siesta Sling — gin, lychee, elderflower, prosecco",
    "Craft beer selection (local and imported)",
    "Light bites: charcuterie board, bruschetta, sliders",
  ],
  atmosphere: [
    "Al-fresco rooftop setting with plunge pool views",
    "Chic lounge seating and high bar stools",
    "DJ sets on Friday and Saturday from 20:00",
    "Private event hire available (inquire at reception)",
  ],
};

export const inRoomDiningDetail: InRoomDiningDetail = {
  ...venuesInBrief[2],
  menuCategories: [
    {
      name: "Breakfast",
      items: [
        "Continental breakfast set",
        "Vietnamese pho (beef or chicken)",
        "Fresh fruit platter",
        "Yogurt parfait with granola",
        "Eggs prepared to order (scrambled, fried, omelette)",
      ],
    },
    {
      name: "Lunch & Dinner",
      items: [
        "Vietnamese rice or noodle dishes",
        "Club sandwich with fries",
        "Grilled chicken Caesar salad",
        "Pasta of the day",
        "Selection from the Cloud Nine Saigon menu",
      ],
    },
    {
      name: "Beverages",
      items: [
        "Coffee & tea selection",
        "Fresh juices (orange, watermelon, mixed tropical)",
        "Soft drinks and mineral water",
        "Beer and wine (selected labels)",
        "In-room minibar replenishment",
      ],
    },
    {
      name: "Snacks & Desserts",
      items: [
        "Seasonal fruit basket",
        "Cheese and crackers",
        "Vietnamese sticky rice dessert",
        "Chocolate fondant cake",
        "Ice cream (vanilla, chocolate, mango)",
      ],
    },
  ],
  orderNote:
    "Please call the front desk or use the in-room dining menu card. Orders are typically delivered within 45 minutes.",
};
