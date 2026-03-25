import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import {
  hotelBranchesData,
  roomTypesData,
  servicesData,
  roomQuantities,
} from '../constants/seed-data.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function seedHotelBranches() {
  console.log('[1/5] Seeding hotel branches...');

  for (const branch of hotelBranchesData) {
    await prisma.hotelBranch.upsert({
      where: { name: branch.name },
      update: { location: branch.location },
      create: branch,
    });
    console.log(`  - ${branch.name}`);
  }
}

async function seedRoomTypes() {
  console.log('[2/5] Seeding room types...');

  for (const roomType of roomTypesData) {
    const existing = await prisma.roomType.findFirst({
      where: { name: roomType.name },
    });

    if (existing) {
      await prisma.roomType.update({
        where: { id: existing.id },
        data: roomType,
      });
    } else {
      await prisma.roomType.create({ data: roomType });
    }
    console.log(`  - ${roomType.name}`);
  }
}

async function seedServices() {
  console.log('[3/5] Seeding services...');

  for (const service of servicesData) {
    const existing = await prisma.service.findFirst({
      where: { name: service.name },
    });

    if (existing) {
      await prisma.service.update({
        where: { id: existing.id },
        data: service,
      });
    } else {
      await prisma.service.create({ data: service });
    }
    console.log(`  - ${service.name}`);
  }
}

async function seedHotelBranchRoomTypes() {
  console.log('[4/5] Seeding hotel branch room types...');

  const branches = await prisma.hotelBranch.findMany();
  const roomTypes = await prisma.roomType.findMany();

  for (const branch of branches) {
    for (const roomType of roomTypes) {
      const quantity = roomQuantities[roomType.name];
      if (quantity == null) continue;

      await prisma.hotelBranchRoomType.upsert({
        where: {
          hotelBranchId_roomTypeId: {
            hotelBranchId: branch.id,
            roomTypeId: roomType.id,
          },
        },
        update: { quantity },
        create: {
          hotelBranchId: branch.id,
          roomTypeId: roomType.id,
          quantity,
        },
      });
    }
    console.log(`  - ${branch.name}: ${roomTypes.length} room types`);
  }
}

async function seedRoomAvailability() {
  console.log('[5/5] Seeding room availability (365 days)...');

  const branchRoomTypes = await prisma.hotelBranchRoomType.findMany();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const BATCH_SIZE = 1000;
  let totalCreated = 0;

  for (const brt of branchRoomTypes) {
    const records: {
      date: Date;
      hotelBranchRoomTypeId: string;
      totalRooms: number;
      bookedRooms: number;
    }[] = [];

    for (let d = 0; d < 365; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);

      records.push({
        date,
        hotelBranchRoomTypeId: brt.id,
        totalRooms: brt.quantity,
        bookedRooms: 0,
      });
    }

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      const result = await prisma.roomAvailability.createMany({
        data: batch,
        skipDuplicates: true,
      });
      totalCreated += result.count;
    }
  }

  console.log(`  - Created ${totalCreated} availability records (duplicates skipped)`);
}

async function main() {
  console.log('Starting database seed...\n');

  await seedHotelBranches();
  await seedRoomTypes();
  await seedServices();
  await seedHotelBranchRoomTypes();
  await seedRoomAvailability();

  console.log('\nSeed completed successfully.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
