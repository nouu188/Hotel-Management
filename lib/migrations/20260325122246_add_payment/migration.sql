/*
  Warnings:

  - You are about to drop the column `lateCheckOutFee` on the `Bill` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'EXPIRED', 'REFUNDED');

-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'STRIPE';

-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "lateCheckOutFee";

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentIntent" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'vnd',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripeSessionId_key" ON "Payment"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripePaymentIntent_key" ON "Payment"("stripePaymentIntent");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
