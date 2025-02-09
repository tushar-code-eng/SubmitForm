import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const selectedDate = url.searchParams.get('date') || '' // Extract date from query parameters
    console.log(selectedDate)

    const startOfDay = new Date(selectedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    console.log("start - >", startOfDay)
    console.log("end - >", endOfDay)

    try {
        const tempUsers = await prisma.user.findMany()

        if (selectedDate) {
            const users = tempUsers.filter((user) =>
                user.printDates.some((date: Date) => {
                    const printDate = new Date(date);
                    return printDate >= startOfDay && printDate <= endOfDay;
                })
            );
            console.log(users)
            return NextResponse.json(users)
        }

        console.log("Here", tempUsers)

        return NextResponse.json(tempUsers)

    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ error: 'Error fetching users. Please try again later.' }, { status: 500 })
    }
}
