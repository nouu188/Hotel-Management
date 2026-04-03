import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient, StaffRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

const EMAIL = process.env.RECEPTIONIST_EMAIL || 'receptionist@hotel.com';
const PASSWORD = process.env.RECEPTIONIST_PASSWORD || 'Receptionist@123';
const NAME = process.env.RECEPTIONIST_NAME || 'Receptionist';

async function createReceptionist() {
  console.log(`Creating receptionist account: ${EMAIL}`);

  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  // 1. Tạo hoặc update User
  const user = await prisma.user.upsert({
    where: { email: EMAIL },
    update: {
      password: hashedPassword,
      role: 'STAFF', // ⚠️ không phải ADMIN nữa
    },
    create: {
      email: EMAIL,
      name: NAME,
      password: hashedPassword,
      role: 'STAFF',
    },
  });

  // 2. Tạo hoặc update Staff
  const staff = await prisma.staff.upsert({
    where: { userId: user.id },
    update: {
      role: StaffRole.RECEPTIONIST,
    },
    create: {
      name: NAME,
      role: StaffRole.RECEPTIONIST,
      enrollDate: new Date(),
      userId: user.id,
    },
  });

  console.log(`Receptionist ready: ${user.email} (staffId: ${staff.id})`);
}

createReceptionist()
  .catch((error) => {
    console.error('Failed to create receptionist:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());