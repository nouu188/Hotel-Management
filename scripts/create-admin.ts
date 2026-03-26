import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@hotel.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';

async function createAdmin() {
  console.log(`Creating admin account: ${ADMIN_EMAIL}`);

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: 'ADMIN', password: hashedPassword },
    create: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`Admin account ready: ${admin.email} (id: ${admin.id})`);
}

createAdmin()
  .catch((error) => {
    console.error('Failed to create admin:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
