import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

interface UserInput {
    mobileNumber: string;
}

// Add proper type annotation for the request parameter and return type
export async function POST(
    req: NextRequest // Change Request to NextRequest
): Promise<NextResponse> { // Add return type annotation
    const { users } = await req.json();

    try {
        if (!Array.isArray(users) || users.length === 0) {
            return NextResponse.json(
                { error: 'Select some users to add' },
                { status: 500 }
            );
        }

        const currentDate = new Date();
        const indiaTime = new Date(currentDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));

        const updatedUsers = await prisma.user.updateMany({
            where: {
                mobileNumber: {
                    in: users.map((user) => user.mobileNumber),
                },
            },
            data: {
                printDates: {
                    push: indiaTime,
                },
            },
        });

        return NextResponse.json(updatedUsers);
    } catch (error) {
        console.error('Error updating users:', error);
        return NextResponse.json(
            { error: 'Failed' },
            { status: 500 }
        );
    }
}