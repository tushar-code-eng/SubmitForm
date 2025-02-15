import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request) {
    try {
        const sendingOrderIdsOnly = await request.json(); // Assuming the request body is an array of IDs

        // Check if the payload is valid
        if (!Array.isArray(sendingOrderIdsOnly) || sendingOrderIdsOnly.length === 0) {
            return NextResponse.json(
                { error: 'Invalid input: expected an array of IDs.' },
                { status: 400 }
            );
        }

        // Update the isPrinted value for all users with the specified IDs
        const updatedUsers = await prisma.user.updateMany({
            where: {
                id: {
                    in: sendingOrderIdsOnly, // Filter users by the provided IDs
                },
            },
            data: {
                isPrinted: true, // Set isPrinted to true
            },
        });

        return NextResponse.json({ message: 'Users updated successfully', updatedCount: updatedUsers.count });
    } catch (error) {
        console.error('Error updating users:', error instanceof Error ? error.message : error);
        return NextResponse.json(
            { error: 'Error updating users. Please try again later.' },
            { status: 500 }
        );
    }
}
