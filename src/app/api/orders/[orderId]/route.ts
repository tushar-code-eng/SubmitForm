import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const urlParts = request.nextUrl.pathname.split('/')
        const userId = urlParts[urlParts.length - 1] // Get the last part of the URL

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                orderDate: 'desc'
            }
        })

        return NextResponse.json(orders)
    } catch (error) {
        console.error('GET Order Error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
    try {
        const urlParts = request.nextUrl.pathname.split('/')
        const orderId = urlParts[urlParts.length - 1] // Get the last part of the URL

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const order = await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                orderDetails: body.orderDetails,
                numOfPieces: body.numOfPieces,
                numOfParcels: body.numOfParcels,
                totalAmount: body.totalAmount,
                orderAddress: body.orderAddress,
                orderState: body.orderState,
                orderZipCode: body.orderZipCode,
                trackingId: body.trackingId,
                trackingCompany: body.trackingCompany,
                paymentStatus: body.paymentStatus,
            }
        })

        return NextResponse.json(order)
    } catch (error) {
        console.error('PUT Order Error:', error)
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        )
    }
}
