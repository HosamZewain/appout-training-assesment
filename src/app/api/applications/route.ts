import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fullName, mobile, email, residenceCity, residenceGovernorate, canAttendTanta } = body;

        // Validation
        if (!fullName || fullName.length < 3) {
            return NextResponse.json({ error: 'Full name must be at least 3 characters' }, { status: 400 });
        }

        if (!mobile || !/^01[0-9]{9}$/.test(mobile)) {
            return NextResponse.json({ error: 'Invalid mobile number' }, { status: 400 });
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // Check for duplicates
        const existing = await prisma.application.findFirst({
            where: {
                OR: [
                    { email },
                    { mobile }
                ]
            }
        });

        if (existing) {
            return NextResponse.json(
                { error: 'You have already applied with this email or mobile number' },
                { status: 409 }
            );
        }

        // Create application
        const application = await prisma.application.create({
            data: {
                fullName,
                mobile,
                email,
                residenceCity,
                residenceGovernorate,
                canAttendTanta: Boolean(canAttendTanta),
            },
        });

        // Create assessment attempt
        await prisma.assessmentAttempt.create({
            data: {
                applicationId: application.id,
            },
        });

        return NextResponse.json({ id: application.id, message: 'Application created successfully' }, { status: 201 });
    } catch (error: unknown) {
        console.error('Application creation error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorDetails = error instanceof Error ? error.stack : String(error);
        console.error('Error details:', errorDetails);
        return NextResponse.json(
            {
                error: 'Internal server error',
                message: errorMessage,
                ...(process.env.NODE_ENV !== 'production' && { stack: errorDetails }),
            },
            { status: 500 }
        );
    }
}
