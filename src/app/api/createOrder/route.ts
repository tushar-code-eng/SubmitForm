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
            trackingId,
            trackingCompany,
            paymentStatus,
        } = body

        const result = await prisma.$transaction(async (tx) => {
            const existingUser = await tx.user.findUnique({
                where: { mobileNumber },
            })

            if (existingUser) {
                throw new Error("User Already Exists")
            }

            const currentDate = new Date()
            const istDate = new Date(currentDate.getTime() + (5.5 * 60 * 60 * 1000))

            const user = await tx.user.create({
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
                        orderDate: istDate,
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