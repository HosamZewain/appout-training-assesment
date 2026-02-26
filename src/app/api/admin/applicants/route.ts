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
        const canAttendTanta = searchParams.get('canAttendTanta');
        const governorate = searchParams.get('governorate') || '';
        const city = searchParams.get('city') || '';
        const assessmentStatus = searchParams.get('assessmentStatus') || '';
        const minScore = searchParams.get('minScore');
        const limit = searchParams.get('limit');

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

        if (canAttendTanta === 'true') {
            where.canAttendTanta = true;
        } else if (canAttendTanta === 'false') {
            where.canAttendTanta = false;
        }

        if (governorate) {
            where.residenceGovernorate = { contains: governorate, mode: 'insensitive' };
        }

        if (city) {
            where.residenceCity = { contains: city, mode: 'insensitive' };
        }

        if (assessmentStatus === 'completed') {
            where.assessmentAttempt = { isCompleted: true };
        } else if (assessmentStatus === 'pending') {
            where.assessmentAttempt = { isCompleted: false };
        } else if (assessmentStatus === 'not_started') {
            where.assessmentAttempt = null;
        }

        // For minScore, we need to filter on the related assessment
        if (minScore) {
            const minScoreNum = parseFloat(minScore);
            if (!isNaN(minScoreNum)) {
                where.assessmentAttempt = {
                    ...where.assessmentAttempt,
                    isCompleted: true,
                    totalScore: { gte: minScoreNum },
                };
            }
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
            ...(limit ? { take: parseInt(limit) } : {}),
        });

        return NextResponse.json(applicants);
    } catch (error) {
        console.error('Error fetching applicants:', error);
        return NextResponse.json({ error: 'Failed to fetch applicants' }, { status: 500 });
    }
}
