import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Fetch all MCQ questions
        const mcqQuestions = await prisma.question.findMany({
            where: {
                type: 'MCQ'
            },
            include: {
                options: {
                    select: {
                        id: true,
                        text: true,
                        orderIndex: true
                    },
                    orderBy: {
                        orderIndex: 'asc'
                    }
                }
            }
        });

        // Fetch all SHORT_ANSWER questions
        const shortAnswerQuestions = await prisma.question.findMany({
            where: {
                type: 'SHORT_ANSWER'
            },
            include: {
                options: {
                    select: {
                        id: true,
                        text: true,
                        orderIndex: true
                    }
                }
            }
        });

        // Shuffle and select 17 MCQ questions
        const shuffledMcq = mcqQuestions.sort(() => Math.random() - 0.5);
        const selectedMcq = shuffledMcq.slice(0, 17);

        // Shuffle and select 3 SHORT_ANSWER questions
        const shuffledShortAnswer = shortAnswerQuestions.sort(() => Math.random() - 0.5);
        const selectedShortAnswer = shuffledShortAnswer.slice(0, 3);

        // Combine and shuffle the final 20 questions
        const finalQuestions = [...selectedMcq, ...selectedShortAnswer].sort(() => Math.random() - 0.5);

        return NextResponse.json(finalQuestions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }
}
