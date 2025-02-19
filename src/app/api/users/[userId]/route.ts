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

        const userDetails = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        return NextResponse.json(userDetails)
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
        const userId = urlParts[urlParts.length - 1] // Get the last part of the URL

        if (!userId) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const userDetails = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                fullName:body.fullName,
                address:body.address,
                state:body.state,
                zipCode:body.zipCode,
                mobileNumber:body.mobileNumber,
                alternateMobileNumber:body.alternateMobileNumber
            }
        })

        return NextResponse.json(userDetails)
    } catch (error) {
        console.error('PUT Order Error:', error)
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        )
    }
}
