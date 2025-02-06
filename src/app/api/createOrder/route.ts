// app/api/customer-order/route.ts
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Extract user and order data
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
            trackingId,
            trackingCompany,
            paymentStatus,
        } = body

        // Create or update user and create order in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create user
            const existingUser = await tx.user.findUnique({
                where: { mobileNumber },
            })

            const currentDate = new Date();
            const indiaTime = new Date(currentDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));

            if (existingUser) {
                throw new Error("User Already Exists")
            }
            const user = await tx.user.create({
                data: {
                    fullName,
                    address,
                    state,
                    zipCode,
                    mobileNumber,
                    alternateMobileNumber,
                    printDates: [new Date()],
                    createdAt: indiaTime,
                },
            })

            // Only create order if at least one order field is provided
            if (orderDetails || numOfPieces || numOfParcels || totalAmount || trackingId || trackingCompany || paymentStatus) {
                const order = await tx.order.create({
                    data: {
                        orderDetails: orderDetails ?? "",
                        numOfPieces: numOfPieces ?? 0,
                        numOfParcels: numOfParcels ?? 0,
                        totalAmount: totalAmount ?? 0,
                        trackingId: trackingId ?? "",
                        trackingCompany: trackingCompany ?? "",
                        paymentStatus: paymentStatus ?? "pending",
                        userId: user.id,
                        orderDate: indiaTime,
                    },
                })
                return { user, order }
            }

            return { user }
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error("Error processing request:", error)
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        )
    }
}