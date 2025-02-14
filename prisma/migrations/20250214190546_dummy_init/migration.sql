/*
  Warnings:

  - The values [none] on the enum `paymentStatusEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "paymentStatusEnum_new" AS ENUM ('pending', 'paid');
ALTER TABLE "Order" ALTER COLUMN "paymentStatus" TYPE "paymentStatusEnum_new" USING ("paymentStatus"::text::"paymentStatusEnum_new");
ALTER TYPE "paymentStatusEnum" RENAME TO "paymentStatusEnum_old";
ALTER TYPE "paymentStatusEnum_new" RENAME TO "paymentStatusEnum";
DROP TYPE "paymentStatusEnum_old";
COMMIT;
