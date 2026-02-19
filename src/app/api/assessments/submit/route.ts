import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { applicationId, answers } = body;

        // Find the assessment attempt
        const attempt = await prisma.assessmentAttempt.findUnique({
            where: { applicationId }
        });

        if (!attempt) {
            return NextResponse.json({ error: 'Assessment attempt not found' }, { status: 404 });
        }

        if (attempt.isCompleted) {
            return NextResponse.json({ error: 'Assessment already submitted' }, { status: 400 });
        }

        // Fetch all questions to calculate scores
        const questions = await prisma.question.findMany({
            include: {
                options: true
            }
        });

        const sectionScores: Record<string, { score: number; total: number }> = {};
        let totalScore = 0;
        let totalPoints = 0;

        // Process each answer
        for (const answer of answers) {
            const question = questions.find(q => q.id === answer.questionId);
            if (!question) continue;

            totalPoints += question.points;

            let score = 0;
            let isCorrect = null;

            // The assessment page sends { questionId, answer } where answer is:
            // - For MCQ: the selected option ID
            // - For SHORT_ANSWER: the text answer
            const selectedOptionId = question.type === 'MCQ' ? (answer.selectedOptionId || answer.answer) : null;
            const textAnswer = question.type === 'SHORT_ANSWER' ? (answer.textAnswer || answer.answer) : null;

            if (question.type === 'MCQ' && selectedOptionId) {
                const selectedOption = question.options.find(o => o.id === selectedOptionId);
                isCorrect = selectedOption?.isCorrect || false;
                score = isCorrect ? question.points : 0;
            } else if (question.type === 'SHORT_ANSWER') {
                // Short answers need manual review, score is 0 initially
                score = 0;
            }

            // Create answer record
            await prisma.answer.create({
                data: {
                    attemptId: attempt.id,
                    questionId: question.id,
                    selectedOptionId: selectedOptionId || null,
                    textAnswer: textAnswer || null,
                    isCorrect,
                    score
                }
            });

            // Track section scores
            if (!sectionScores[question.category]) {
                sectionScores[question.category] = { score: 0, total: 0 };
            }
            sectionScores[question.category].score += score;
            sectionScores[question.category].total += question.points;

            totalScore += score;
        }

        // Calculate percentage score
        const percentageScore = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0;

        // Update assessment attempt
        await prisma.assessmentAttempt.update({
            where: { id: attempt.id },
            data: {
                submittedAt: new Date(),
                isCompleted: true,
                totalScore: percentageScore,
                sectionScores: JSON.stringify(sectionScores)
            }
        });

        return NextResponse.json({
            message: 'Assessment submitted successfully',
            score: percentageScore
        });
    } catch (error) {
        console.error('Error submitting assessment:', error);
        return NextResponse.json({ error: 'Failed to submit assessment' }, { status: 500 });
    }
}
