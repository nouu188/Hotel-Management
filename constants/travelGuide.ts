export interface TravelGuideItem {
  name: string;
  detail: string;
  distance?: string;
  tip?: string;
}

export interface TravelSection {
  id: string;
  title: string;
  description: string;
  items: TravelGuideItem[];
}

export const travelGuideSections: TravelSection[] = [
  {
    id: "landmarks",
    title: "Must-See Landmarks",
    description: "Ho Chi Minh City's iconic sights within easy reach of the hotel.",
    items: [
      { name: "Ben Thanh Market", detail: "Historic market with local food, souvenirs and crafts.", distance: "10 min walk", tip: "Visit early morning to avoid crowds" },
      { name: "Notre-Dame Cathedral Basilica", detail: "French colonial cathedral at the heart of District 1.", distance: "15 min walk" },
      { name: "Reunification Palace", detail: "Historic landmark from the Vietnam War era.", distance: "10 min walk" },
      { name: "War Remnants Museum", detail: "Powerful museum documenting the Vietnam War.", distance: "15 min walk" },
      { name: "Saigon Central Post Office", detail: "Elegant French-era post office, still operational.", distance: "15 min walk" },
    ],
  },
  {
    id: "dining",
    title: "Where to Eat",
    description: "From street food to fine dining — Saigon's culinary scene at its best.",
    items: [
      { name: "Bui Vien Walking Street", detail: "Vibrant street food scene, best after dark.", distance: "10 min walk", tip: "Try the bánh mì and fresh spring rolls" },
      { name: "Pho Hoa Pasteur", detail: "Legendary pho restaurant open since 1960.", distance: "15 min walk" },
      { name: "Quan Bui", detail: "Elegant Vietnamese restaurant with modern interpretations of classic dishes.", distance: "5 min walk" },
    ],
  },
  {
    id: "transport",
    title: "Getting Around",
    description: "Navigating Ho Chi Minh City with ease.",
    items: [
      { name: "Grab (ride-hailing)", detail: "Most reliable option for short trips. Download the Grab app before arrival.", tip: "Use GrabCar for AC comfort" },
      { name: "Airport Transfer", detail: "Book via the hotel for a fixed price — 7-seater from 550,000 VND.", tip: "Ask the front desk to arrange" },
      { name: "Walking", detail: "District 1 is very walkable. Most major attractions are within 20 minutes on foot.", distance: "15–20 min radius" },
      { name: "Cyclo", detail: "Traditional bicycle rickshaw — great for a scenic city tour.", tip: "Agree on price before riding" },
    ],
  },
  {
    id: "tips",
    title: "Local Tips",
    description: "Practical advice for a smooth and memorable stay in Saigon.",
    items: [
      { name: "Currency", detail: "Vietnamese Dong (VND). ATMs widely available in District 1. Many places accept USD." },
      { name: "Weather", detail: "Tropical climate. Dry season Nov–Apr; rainy season May–Oct. Carry a small umbrella." },
      { name: "Dress code", detail: "Light, breathable clothing recommended. Cover shoulders and knees at temples." },
      { name: "Safety", detail: "Generally safe for tourists. Keep bags on your lap in open-air vehicles to avoid snatch theft." },
    ],
  },
];

export const hotelAddress = "17 Lê Thánh Tôn, Bến Nghé, District 1, Ho Chi Minh City, Vietnam";
export const hotelMapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4673477809063!2d106.69940831480177!3d10.777501992319784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f46b8e96a0b%3A0xd5b81eb8e0e3e7a7!2sLa%20Siesta%20Premium%20Saigon!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s";
