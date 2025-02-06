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
        console.log(body)
        
        const order = await prisma.order.create({
            data: {
                orderDetails: body.orderDetails,
                numOfPieces: body.numOfPieces,
                numOfParcels: body.numOfParcels,
                totalAmount: body.totalAmount,
                trackingId: body.trackingId,
                trackingCompany: body.trackingCompany,
                paymentStatus: body.paymentStatus,
                userId: body.userId
            },
        })

        return NextResponse.json(order)
    } catch (error) {
        console.error('Error creating order:', error)
        return NextResponse.json(
            { error: 'Error creating order. Please try again later.' }, 
            { status: 500 }
        )
    }
}