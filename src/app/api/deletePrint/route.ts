import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: Request) {
    try {
        const body = await request.json()
        const { userIds, printDate } = body

        if (!userIds || !printDate || !Array.isArray(userIds)) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            )
        }

        const dateToDelete = new Date(printDate)

        dateToDelete.setHours(0, 0, 0, 0)

        const endDate = new Date(dateToDelete)
        endDate.setHours(23, 59, 59, 999)

        const updatePromises = userIds.map(userId =>
            prisma.$executeRaw`
                UPDATE "User"
                SET "printDates" = ARRAY(
                    SELECT pd
                    FROM unnest("printDates") pd
                    WHERE pd < ${dateToDelete} OR pd > ${endDate}
                )
                WHERE id = ${userId};
            `
        );

        await Promise.all(updatePromises)

        return NextResponse.json(
            { message: 'Print dates deleted successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error deleting print dates:', error)
        return NextResponse.json(
            { message: 'Failed to delete print dates' },
            { status: 500 }
        )
    }
}