export type GalleryCategory = "all" | "rooms" | "dining" | "spa" | "pool" | "exterior" | "events";

export interface GalleryImage {
  src: string;
  altText: string;
  category: Exclude<GalleryCategory, "all">;
  caption?: string;
}

export const galleryImages: GalleryImage[] = [
  { src: "/images/1.jpg", altText: "La Siesta Suite bedroom", category: "rooms", caption: "La Siesta Suite — 75 sqm of refined luxury" },
  { src: "/images/2.jpg", altText: "Superior Room", category: "rooms", caption: "Superior Room" },
  { src: "/images/3.jpg", altText: "Cloud Nine Saigon Restaurant", category: "dining", caption: "Cloud Nine Saigon — Fine dining" },
  { src: "/images/4.jpg", altText: "Twilight Bar", category: "dining", caption: "Twilight Sky Bar Saigon" },
  { src: "/images/5.jpg", altText: "La Spa treatment", category: "spa", caption: "La Spa — Signature treatments" },
  { src: "/images/6.jpg", altText: "Hotel swimming pool", category: "pool", caption: "Rooftop Swimming Pool" },
  { src: "/images/7.jpg", altText: "Hotel exterior", category: "exterior", caption: "La Siesta Premium Saigon" },
  { src: "/images/8.jpg", altText: "Hotel lobby", category: "exterior", caption: "Hotel Lobby" },
  { src: "/images/9.jpg", altText: "Executive Room", category: "rooms", caption: "Executive Room" },
  { src: "/images/10.jpg", altText: "Pool area", category: "pool", caption: "Pool Terrace" },
  { src: "/images/11.jpg", altText: "Gym facilities", category: "spa", caption: "Fitness Center" },
  { src: "/images/12.jpg", altText: "Junior Suite", category: "rooms", caption: "Junior Suite" },
];
