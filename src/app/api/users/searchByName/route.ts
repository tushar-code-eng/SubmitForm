import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const nameValue = url.searchParams.get('name') || '' // Extract nameValue from query parameters
    console.log(nameValue)

    try {
        const users = await prisma.user.findMany({
            where: {
                fullName: {
                    startsWith: nameValue,
                    mode: 'insensitive',
                },
            },
        });
        console.log(users)
        return NextResponse.json(users)
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ error: 'Error fetching users. Please try again later.' }, { status: 500 })
    }
}
