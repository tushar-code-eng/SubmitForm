import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { fullName, address, state, zipCode, mobileNumber, alternateMobileNumber } = await req.json();

    if (!fullName || !address || !state || !zipCode || !mobileNumber) {
      return NextResponse.json({ error: "All required fields must be provided." }, { status: 400 });
    }

    const currentDate = new Date();
    const istDate = new Date(currentDate.getTime() + (5.5 * 60 * 60 * 1000));

    const user = await prisma.user.upsert({
      where: { mobileNumber },
      update: {
        fullName,
        address,
        state,
        zipCode,
        alternateMobileNumber,
        printDates: {
          push: istDate
        }
      },
      create: {
        fullName,
        address,
        state,
        zipCode,
        mobileNumber,
        alternateMobileNumber,
        printDates: [istDate],
        createdAt: istDate
      },
    });

    return NextResponse.json({
      success: true,
      message: "User registered/updated successfully",
      data: user
    }, { status: 201 });

  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to register/update user",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}