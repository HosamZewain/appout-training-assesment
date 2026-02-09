import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';

        const where: any = {};

        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { mobile: { contains: search } },
            ];
        }

        if (status) {
            where.status = status;
        }

        const applicants = await prisma.application.findMany({
            where,
            include: {
                assessmentAttempt: {
                    select: {
                        totalScore: true,
                        isCompleted: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(applicants);
    } catch (error) {
        console.error('Error fetching applicants:', error);
        return NextResponse.json({ error: 'Failed to fetch applicants' }, { status: 500 });
    }
}
