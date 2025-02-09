import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

interface UserInput {
    mobileNumber: string;
}

export async function POST(
    req: NextRequest
): Promise<NextResponse> {
    try {
        const { users } = await req.json() as { users: UserInput[] };

        if (!Array.isArray(users) || users.length === 0) {
            return NextResponse.json(
                { error: 'Select some users to add' },
                { status: 400 }  // Changed to 400 as it's a client-side error
            );
        }

        // Get current time in IST
        const currentDate = new Date();
        // Add 5 hours and 30 minutes to get IST
        const istDate = new Date(currentDate.getTime() + (5.5 * 60 * 60 * 1000));

        const updatedUsers = await prisma.user.updateMany({
            where: {
                mobileNumber: {
                    in: users.map((user) => user.mobileNumber),
                },
            },
            data: {
                printDates: {
                    push: istDate,
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Users updated successfully',
            data: updatedUsers
        });
    } catch (error) {
        console.error('Error updating users:', error);
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to update users',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}