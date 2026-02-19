import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;

    try {
        const applicant = await prisma.application.findUnique({
            where: { id: params.id },
            include: {
                assessmentAttempt: {
                    include: {
                        answers: {
                            include: {
                                question: {
                                    include: {
                                        options: {
                                            orderBy: { orderIndex: 'asc' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!applicant) {
            return NextResponse.json({ error: 'Applicant not found' }, { status: 404 });
        }

        return NextResponse.json(applicant);
    } catch (error) {
        console.error('Error fetching applicant details:', error);
        return NextResponse.json({ error: 'Failed to fetch applicant' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;

    try {
        const body = await request.json();
        const { status, adminNotes } = body;

        const updated = await prisma.application.update({
            where: { id: params.id },
            data: {
                status,
                adminNotes,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating applicant:', error);
        return NextResponse.json({ error: 'Failed to update applicant' }, { status: 500 });
    }
}
