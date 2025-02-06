import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { fullName, address, state, zipCode, mobileNumber, alternateMobileNumber } = await req.json();

    if (!fullName || !address || !state || !zipCode || !mobileNumber) {
      return NextResponse.json({ error: "All required fields must be provided." }, { status: 400 });
    }
    const currentDate = new Date();
    const indiaTime = new Date(currentDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));

    const user = await prisma.user.upsert({
      where: { mobileNumber },
      update: {
        fullName, address, state, zipCode, alternateMobileNumber, printDates: {
          push: indiaTime

        }
      },
      create: { fullName, address, state, zipCode, mobileNumber, alternateMobileNumber, printDates: [indiaTime],createdAt:indiaTime },
    });

    return NextResponse.json({ message: "User registered/updated successfully", user }, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
