import type { Prisma } from '@prisma/client';

const CLOUDINARY_PREFIX = 'hotel-assets';

function toCloudinaryPublicId(localPath: string): string {
  const normalized = localPath.startsWith('/') ? localPath.slice(1) : localPath;
  const lastDot = normalized.lastIndexOf('.');
  const withoutExt = lastDot > 0 ? normalized.slice(0, lastDot) : normalized;
  return `${CLOUDINARY_PREFIX}/${withoutExt}`;
}

function toImages(paths: string[]): string[] {
  return paths.map(toCloudinaryPublicId);
}

// ---------------------------------------------------------------------------
// Hotel Branches
// ---------------------------------------------------------------------------

export const hotelBranchesData: Prisma.HotelBranchCreateInput[] = [
  {
    name: 'La Sieste Premium Hang Be',
    location: '94 Hang Be, Hoan Kiem, Hanoi',
  },
  {
    name: 'La Sieste Classic Ma May',
    location: '94 Ma May, Hoan Kiem, Hanoi',
  },
  {
    name: 'La Sieste Premium Hang Thung',
    location: '19 Hang Thung, Hoan Kiem, Hanoi',
  },
  {
    name: 'La Sieste Premium SaiGon',
    location: '276 Bui Thi Xuan, District 1, Ho Chi Minh City',
  },
  {
    name: 'La Sieste Premium SaiGon Central',
    location: '26-28 Ly Tu Trong, District 1, Ho Chi Minh City',
  },
  {
    name: 'La Sieste Hoi An Resort & Spa',
    location: '132 Hung Vuong, Thanh Ha, Hoi An',
  },
];

// ---------------------------------------------------------------------------
// Room Types
// ---------------------------------------------------------------------------

export const roomTypesData: Prisma.RoomTypeCreateInput[] = [
  {
    name: 'Superior Room',
    capacity: 3,
    description:
      'Spacious enough to accommodate a family of 3 OR a group of friends, Superior Room is well appointed with lamps and architectural lighting enhancing the cozy feel.',
    area: 25,
    bedType: 'Hollywood twins (allows 1 double or 2 twin beds)',
    bedNumb: 1,
    bathNumb: 1,
    price: 165,
    image: toImages([
      '/room/superior-room/Superior-Room_1-2000.jpg',
      '/room/superior-room/Superior-Room_2-2000-scaled.jpg',
      '/room/superior-room/Superior-Room_3-2000.jpg',
      '/room/superior-room/Superior-Room_4-2000.jpg',
      '/room/superior-room/Superior-Room_5-2000.jpg',
    ]),
  },
  {
    name: 'Deluxe Room',
    capacity: 2,
    description:
      'Elegant and refined, the Deluxe Room completes your stay with luxurious amenities.',
    area: 22,
    bedType: 'Hollywood twins (allows 1 double or 2 twin beds)',
    bedNumb: 1,
    bathNumb: 1,
    price: 195,
    image: toImages([
      '/room/deluxe-room/Deluxe_6-2000.jpg',
      '/room/deluxe-room/Deluxe_2-2000.jpg',
      '/room/deluxe-room/Deluxe_3-2000.jpg',
      '/room/deluxe-room/Deluxe_4-2000.jpg',
      '/room/deluxe-room/Deluxe_5-2000.jpg',
    ]),
  },
  {
    name: 'Deluxe Connecting Room',
    capacity: 4,
    description:
      'Elegant and refined, the Deluxe Connecting Room completes your stay with luxurious amenities.',
    area: 44,
    bedType: 'Hollywood twins (allows 2 double or 4 twin beds)',
    bedNumb: 2,
    bathNumb: 1,
    price: 390,
    image: toImages([
      '/room/deluxe-connecting-room/Deluxe_1-2000-scaled.jpg',
      '/room/deluxe-connecting-room/Deluxe_2-2000.jpg',
      '/room/deluxe-connecting-room/Deluxe_3-2000.jpg',
      '/room/deluxe-connecting-room/Deluxe_4-2000.jpg',
      '/room/deluxe-connecting-room/Deluxe_5-2000.jpg',
    ]),
  },
  {
    name: 'Executive Room',
    capacity: 2,
    description:
      'Elegant and refined, the Executive Room completes your stay with luxurious amenities.',
    area: 25,
    bedType: 'Hollywood twins (allows 1 double or 2 twin beds)',
    bedNumb: 1,
    bathNumb: 1,
    price: 250,
    image: toImages([
      '/room/executive-room/Executive_2-2000.jpg',
      '/room/executive-room/Executive_3-2000.jpg',
      '/room/executive-room/Executive_4-2000.jpg',
      '/room/executive-room/Executive_5-2000.jpg',
      '/room/executive-room/Executive_1-2000.jpg',
      '/room/executive-room/Executive_6-2000.jpg',
    ]),
  },
  {
    name: 'Executive Connecting Room',
    capacity: 4,
    description:
      'Elegant and refined, the Executive Connecting Room completes your stay with luxurious amenities.',
    area: 44,
    bedType: 'Hollywood twins (allows 2 double or 4 twin beds)',
    bedNumb: 2,
    bathNumb: 1,
    price: 500,
    image: toImages([
      '/room/executive-connecting-room/Executive_1-2000.jpg',
      '/room/executive-connecting-room/Executive_2-2000.jpg',
      '/room/executive-connecting-room/Executive_3-2000-scaled.jpg',
      '/room/executive-connecting-room/Executive_4-2000.jpg',
      '/room/executive-connecting-room/Executive_5-2000.jpg',
      '/room/executive-connecting-room/Executive_6-2000.jpg',
      '/room/executive-connecting-room/Executive_7-2000.jpg',
    ]),
  },
  {
    name: 'Junior Suite',
    capacity: 2,
    description:
      'Featuring a spacious terrace to Ly Tu Trong street, our charming Junior Suites offer tranquil views of street.',
    area: 50,
    bedType: 'Hollywood twins (allows 1 double or 2 twin beds)',
    bedNumb: 1,
    bathNumb: 1,
    price: 500,
    image: toImages([
      '/room/junior-suite/Junior-Suite_3-2000.jpg',
      '/room/junior-suite/Junior-Suite_2-2000-scaled.jpg',
      '/room/junior-suite/Junior-Suite_4-2000.jpg',
      '/room/junior-suite/Junior-Suite_5-2000.jpg',
      '/room/junior-suite/Junior-Suite_6-2000.jpg',
      '/room/junior-suite/Junior-Suite_1-2000.jpg',
      '/room/junior-suite/Junior-Suite_7-2000.jpg',
    ]),
  },
  {
    name: 'La Siesta Suite',
    capacity: 2,
    description:
      'Elegant suite room with spacious balcony, where we arrange outdoor table and chairs for your relaxation time.',
    area: 75,
    bedType: 'Hollywood twins (allows 1 double or 2 twin beds)',
    bedNumb: 1,
    bathNumb: 1,
    price: 600,
    image: toImages([
      '/room/la-sieste-suite/La-Siesta-Suite_1-2000.jpg',
      '/room/la-sieste-suite/La-Siesta-Suite_2-2000.jpg',
      '/room/la-sieste-suite/La-Siesta-Suite_3-2000.jpg',
      '/room/la-sieste-suite/La-Siesta-Suite_4-2000.jpg',
      '/room/la-sieste-suite/La-Siesta-Suite_5-2000.jpg',
      '/room/la-sieste-suite/La-Siesta-Suite_6-R01-OPT2-2000.jpg',
      '/room/la-sieste-suite/La-Siesta-Suite_7-R01-OPT2-2000.jpg',
    ]),
  },
];

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export const servicesData: Prisma.ServiceCreateInput[] = [
  {
    id: 'fb7868e4-2c46-4564-bb27-dfeab2d9ba14',
    name: 'Airport Transfer - 7 Seated Car Per Way',
    price: 550000,
    description:
      'Available for 1-4 passengers for one-way drive (pick up or drop off).',
    priceType: 'PERBOOKING',
    image: toImages(['/extras/airport_transfer_7_seater.jpg']),
  },
  {
    id: 'c0888581-f05f-4610-b1fc-d6d03e1ba209',
    name: 'Airport Transfer - 16 seated Minibus Per Way',
    price: 1200000,
    description:
      'Available for 5-10 passengers for one-way drive (pick up or drop off).',
    priceType: 'PERBOOKING',
    image: toImages(['/extras/transfer_16_seater.webp']),
  },
  {
    id: 'ab910f13-2bda-4e12-9c7e-9ec6e165d9e4',
    name: 'One-time Afternoon Tea',
    price: 300000,
    description: 'Enjoy a delightful one-time afternoon tea experience.',
    priceType: 'PERADULT',
    image: toImages(['/extras/Afternoon_Tea.jpg']),
    notes: 'Special Price. Reserve now is required.',
  },
  {
    id: 'baf4fe61-46be-41b2-95a6-7f8e1b3fe557',
    name: 'One-time Body Massage - 90 Minutes',
    price: 1100000,
    description:
      'Select one option for each person for a relaxing 90-minute body massage.',
    priceType: 'PERADULT',
    image: toImages(['/extras/Body-Message.jpg']),
    notes:
      'Reserve now is required - Special price - Not applicable to discount.',
  },
  {
    id: 'c6810dc7-424d-407e-ad93-72875721394b',
    name: 'Head, Neck, Back Massage - 45 Min/person/time BY La Spa',
    price: 565000,
    description:
      'A targeted 45-minute massage for your head, neck, and back by La Spa.',
    priceType: 'PERADULT',
    image: toImages(['/extras/Afternoon_Tea.jpg']),
    notes:
      'Reserve now is required - Special price - Not applicable to discount.',
  },
  {
    id: 'f65b1c95-4bcb-4836-a85f-d19a6dd10bfe',
    name: 'Foot Massage - 45 Min/person/time BY La Spa',
    price: 565000,
    description: 'A rejuvenating 45-minute foot massage by La Spa.',
    priceType: 'PERADULT',
    image: toImages(['/extras/Afternoon_Tea.jpg']),
    notes:
      'Reserve now is required - Special price - Not applicable to discount.',
  },
];

// ---------------------------------------------------------------------------
// Room quantities per branch (room type name -> quantity)
// ---------------------------------------------------------------------------

export const roomQuantities: Record<string, number> = {
  'Superior Room': 15,
  'Deluxe Room': 12,
  'Deluxe Connecting Room': 6,
  'Executive Room': 10,
  'Executive Connecting Room': 4,
  'Junior Suite': 6,
  'La Siesta Suite': 3,
};
