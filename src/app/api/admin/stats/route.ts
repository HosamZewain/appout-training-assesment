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
        // Total applicants
        const totalApplicants = await prisma.application.count();

        // Completed assessments
        const completedAssessments = await prisma.assessmentAttempt.count({
            where: { isCompleted: true }
        });

        // Average score
        const assessments = await prisma.assessmentAttempt.findMany({
            where: { isCompleted: true },
            select: { totalScore: true }
        });
        const averageScore = assessments.length > 0
            ? assessments.reduce((sum, a) => sum + a.totalScore, 0) / assessments.length
            : 0;

        // Top cities
        const applications = await prisma.application.findMany({
            select: { residenceCity: true }
        });
        const cityCount: Record<string, number> = {};
        applications.forEach(app => {
            cityCount[app.residenceCity] = (cityCount[app.residenceCity] || 0) + 1;
        });
        const topCities = Object.entries(cityCount)
            .map(([city, count]) => ({ city, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Attendance distribution
        const yesCount = await prisma.application.count({ where: { canAttendTanta: true } });
        const noCount = await prisma.application.count({ where: { canAttendTanta: false } });

        return NextResponse.json({
            totalApplicants,
            completedAssessments,
            averageScore,
            topCities,
            attendanceDistribution: { yes: yesCount, no: noCount }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
