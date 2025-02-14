import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const selectedDate = url.searchParams.get('date') || ''

    try {
        let orders;

        if (selectedDate) {
            orders = await prisma.order.findMany({
                where: {
                    orderDate: {
                        gte: new Date(`${selectedDate}T00:00:00`),
                        lt: new Date(`${selectedDate}T23:59:59`),
                    },
                },
                include: {
                    user: true,
                },
                orderBy: {
                    orderDate: 'desc',
                },
            })
        } else {
            orders = await prisma.order.findMany({
                include: {
                    user: true,
                },
                orderBy: {
                    orderDate: 'desc',
                },
            })
        }

        return NextResponse.json(orders)
    } catch (error) {
        console.error('Error fetching orders:', error)
        return NextResponse.json(
            { error: 'Error fetching orders. Please try again later.' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('Order request body:', body)

        // Get current time in IST
        const currentDate = new Date()
        // Add 5 hours and 30 minutes to get IST
        const istDate = new Date(currentDate.getTime() + (5.5 * 60 * 60 * 1000))

        const order = await prisma.order.create({
            data: {
                orderDetails: body.orderDetails,
                numOfPieces: body.numOfPieces,
                numOfParcels: body.numOfParcels,
                totalAmount: body.totalAmount,
                orderAddress:body.orderAddress, ////////////////////////
                trackingId: body.trackingId,
                trackingCompany: body.trackingCompany,
                paymentStatus: body.paymentStatus,
                userId: body.userId,
                orderDate: istDate,
            },
        })

        const user = await prisma.user.findUnique({
            where: {
                id: body.userId,
            },
            select: {
                printDates: true,
            },
        });

        if (user && !user.printDates.includes(istDate)) {
            await prisma.user.update({
                where: {
                    id: body.userId,
                },
                data: {
                    printDates: {
                        push: istDate,
                    },
                },
            });
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error('Error creating order:', error)
        return NextResponse.json(
            { error: 'Error creating order. Please try again later.' },
            { status: 500 }
        )
    }
}