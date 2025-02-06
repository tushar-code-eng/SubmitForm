import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { fullName, address, state, zipCode, mobileNumber, alternateMobileNumber } = await req.json();

    if (!fullName || !address || !state || !zipCode || !mobileNumber) {
      return NextResponse.json({ error: "All required fields must be provided." }, { status: 400 });
    }
    const printDate = new Date();

    const user = await prisma.user.upsert({
      where: { mobileNumber },
      update: {
        fullName, address, state, zipCode, alternateMobileNumber, printDates: {
          push: printDate

        }
      },
      create: { fullName, address, state, zipCode, mobileNumber, alternateMobileNumber, printDates: [printDate] },
    });

    return NextResponse.json({ message: "User registered/updated successfully", user }, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
