import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const {
            fullName,
            address,
            state,
            zipCode,
            mobileNumber,
            alternateMobileNumber,
            orderDetails,
            numOfPieces,
            numOfParcels,
            totalAmount,
            orderAddress,
            orderState,
            orderZipCode,
            trackingId,
            trackingCompany,
            paymentStatus,
        } = body

        const currentDate = new Date()
        const istDate = new Date(currentDate.getTime() + (5.5 * 60 * 60 * 1000))

        // Check if user exists
        let user = await prisma.user.findUnique({
            where: { mobileNumber },
        })

        if (!user) {
            // Create new user if they don't exist
            user = await prisma.user.create({
                data: {
                    fullName,
                    address,
                    state,
                    zipCode,
                    mobileNumber,
                    alternateMobileNumber,
                    printDates: [istDate],
                    createdAt: istDate,
                },
            })
        } else {
            // Update user's printDates if they exist
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    printDates: {
                        push: istDate
                    }
                }
            })
        }

        let order = null;
        if (orderDetails || numOfPieces || numOfParcels || totalAmount || trackingId || trackingCompany || paymentStatus) {
            order = await prisma.order.create({
                data: {
                    orderDetails: orderDetails,
                    numOfPieces: numOfPieces ?? 0,
                    numOfParcels: numOfParcels ?? 0,
                    totalAmount: totalAmount ?? 0,
                    orderAddress: orderAddress || address,
                    orderState: orderState || state,
                    orderZipCode: orderZipCode || zipCode,
                    trackingId: trackingId ?? "",
                    trackingCompany: trackingCompany ?? "",
                    paymentStatus: paymentStatus ?? "pending",
                    userId: user.id,
                    orderDate: istDate,
                },
            })
        }

        // Fetch the updated user with orders
        const updatedUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                orders: true
            }
        })

        return NextResponse.json({
            user: updatedUser,
            newOrder: order
        })
    } catch (error) {
        console.error("Error processing request:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to process request" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}