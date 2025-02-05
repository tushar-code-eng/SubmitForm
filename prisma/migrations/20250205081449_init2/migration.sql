-- CreateEnum
CREATE TYPE "paymentStatusEnum" AS ENUM ('pending', 'paid');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderDetails" TEXT NOT NULL,
    "numOfPieces" INTEGER NOT NULL,
    "numOfParcels" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "trackingId" TEXT NOT NULL,
    "trackingCompany" TEXT NOT NULL,
    "paymentStatus" "paymentStatusEnum" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
