-- AlterTable
ALTER TABLE "User" ADD COLUMN     "alternateAddress" TEXT[] DEFAULT ARRAY[]::TEXT[];
