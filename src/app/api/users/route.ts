import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const selectedDate = url.searchParams.get('date') || '' // Extract date from query parameters
    
    try {
        let users;
        
        if (selectedDate) {
            users = await prisma.user.findMany({
                where: {
                    createdAt: {
                        gte: new Date(`${selectedDate}T00:00:00`),
                        lt: new Date(`${selectedDate}T23:59:59`),
                    },
                },
            })
        } else {
            users = await prisma.user.findMany()
        }

        return NextResponse.json(users)
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ error: 'Error fetching users. Please try again later.' }, { status: 500 })
    }
}
