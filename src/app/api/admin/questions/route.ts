import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all questions with options
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') || '';

        const where: Record<string, string> = {};
        if (category) {
            where.category = category;
        }

        const questions = await prisma.question.findMany({
            where,
            include: {
                options: {
                    orderBy: { orderIndex: 'asc' },
                },
            },
            orderBy: { orderIndex: 'asc' },
        });

        return NextResponse.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }
}

// POST create a new question
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { category, text, type, difficulty, points, options } = body;

        if (!category || !text || !type || !difficulty || points === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get the next orderIndex
        const lastQuestion = await prisma.question.findFirst({
            orderBy: { orderIndex: 'desc' },
        });
        const nextOrderIndex = (lastQuestion?.orderIndex ?? -1) + 1;

        const question = await prisma.question.create({
            data: {
                category,
                text,
                type,
                difficulty,
                points: Number(points),
                orderIndex: nextOrderIndex,
                options: {
                    create: (options || []).map((opt: { text: string; isCorrect: boolean }, idx: number) => ({
                        text: opt.text,
                        isCorrect: opt.isCorrect,
                        orderIndex: idx,
                    })),
                },
            },
            include: {
                options: { orderBy: { orderIndex: 'asc' } },
            },
        });

        return NextResponse.json(question, { status: 201 });
    } catch (error) {
        console.error('Error creating question:', error);
        return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
    }
}

// PUT update a question
export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, category, text, type, difficulty, points, options } = body;

        if (!id) {
            return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
        }

        // Update question
        await prisma.question.update({
            where: { id },
            data: {
                category,
                text,
                type,
                difficulty,
                points: Number(points),
            },
        });

        // Replace options: delete old ones and create new ones
        if (options !== undefined) {
            await prisma.option.deleteMany({ where: { questionId: id } });
            if (options.length > 0) {
                await prisma.option.createMany({
                    data: options.map((opt: { text: string; isCorrect: boolean }, idx: number) => ({
                        questionId: id,
                        text: opt.text,
                        isCorrect: opt.isCorrect,
                        orderIndex: idx,
                    })),
                });
            }
        }

        const updated = await prisma.question.findUnique({
            where: { id },
            include: { options: { orderBy: { orderIndex: 'asc' } } },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating question:', error);
        return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
    }
}

// DELETE a question
export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
        }

        await prisma.question.delete({ where: { id } });

        return NextResponse.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
    }
}
