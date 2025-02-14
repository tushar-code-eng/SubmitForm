-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderState" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "orderZipCode" TEXT NOT NULL DEFAULT '';
