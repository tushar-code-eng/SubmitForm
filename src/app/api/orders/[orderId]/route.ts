import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
): Promise<NextResponse> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: params.orderId
      },
      orderBy: {
        orderDate: 'desc'
      }
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { orderId: string } }
): Promise<NextResponse> {
  try {
    const body = await request.json()
    const order = await prisma.order.update({
      where: {
        id: params.orderId
      },
      data: {
        orderDetails: body.orderDetails,
        numOfPieces: body.numOfPieces,
        numOfParcels: body.numOfParcels,
        totalAmount: body.totalAmount,
        trackingId: body.trackingId,
        trackingCompany: body.trackingCompany,
        paymentStatus: body.paymentStatus,
      }
    })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}