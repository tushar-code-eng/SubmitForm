import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const selectedDate = url.searchParams.get('date') || ''

    try {
        if (selectedDate) {
            const startOfDay = new Date(selectedDate);
            startOfDay.setUTCHours(0, 0, 0, 0);

            const endOfDay = new Date(selectedDate);
            endOfDay.setUTCHours(23, 59, 59, 999);

            const allUsers = await prisma.user.findMany({
                include: {
                    orders: {
                        where: {
                            orderDate: {
                                gte: startOfDay,
                                lte: endOfDay
                            }
                        }
                    }
                }
            });

            const filteredUsers = allUsers.filter(user =>
                user.printDates.some(date =>
                    new Date(date) >= startOfDay && new Date(date) <= endOfDay
                )
            );

            return NextResponse.json(filteredUsers)
        }

        // const allUsers = await prisma.user.findMany({
        //     include: {
        //         orders: true
        //     }
        // });
        const allUsers = await prisma.user.findMany()

        return NextResponse.json(allUsers)

    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ error: 'Error fetching users. Please try again later.' }, { status: 500 })
    }
}