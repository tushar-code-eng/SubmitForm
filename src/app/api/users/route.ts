import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const selectedDate = url.searchParams.get('date') || '' // Extract date from query parameters

    const startOfDay = new Date(`${selectedDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${selectedDate}T23:59:59.999Z`);

    try {

        const tempUsers = await prisma.user.findMany()

        if (selectedDate) {
            const users = tempUsers.filter((user) =>
                user.printDates.some((date: Date) => {
                    const printDate = new Date(date);
                    return printDate >= startOfDay && printDate <= endOfDay;
                })
            );
            return NextResponse.json(users)
        }

        return NextResponse.json(tempUsers)

    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ error: 'Error fetching users. Please try again later.' }, { status: 500 })
    }
}
