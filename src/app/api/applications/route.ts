import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs';

// Helper: wrap a promise with a timeout
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`${label} timed out after ${ms}ms`));
        }, ms);
        promise
            .then((val) => { clearTimeout(timer); resolve(val); })
            .catch((err) => { clearTimeout(timer); reject(err); });
    });
}

export async function POST(request: NextRequest) {
    const diagnostics: string[] = [];

    try {
        // Collect diagnostics
        const dbUrl = process.env.DATABASE_URL || 'NOT SET';
        diagnostics.push(`DATABASE_URL=${dbUrl}`);
        diagnostics.push(`CWD=${process.cwd()}`);
        diagnostics.push(`NODE_ENV=${process.env.NODE_ENV || 'not set'}`);

        // Check if the SQLite database file exists
        if (dbUrl.startsWith('file:')) {
            const dbPath = dbUrl.replace('file:', '').replace(/\?.*$/, '');
            const resolvedPath = path.resolve(process.cwd(), dbPath);
            const exists = fs.existsSync(resolvedPath);
            diagnostics.push(`DB resolved path=${resolvedPath}`);
            diagnostics.push(`DB file exists=${exists}`);
        }

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

        // Test Prisma connection first with a 10s timeout
        diagnostics.push('Testing Prisma connection...');
        await withTimeout(
            prisma.$connect(),
            10000,
            'Prisma $connect()'
        );
        diagnostics.push('Prisma connected successfully');

        // Check for duplicates (with timeout)
        const existing = await withTimeout(
            prisma.application.findFirst({
                where: {
                    OR: [
                        { email },
                        { mobile }
                    ]
                }
            }),
            10000,
            'Duplicate check query'
        );

        if (existing) {
            return NextResponse.json(
                { error: 'You have already applied with this email or mobile number' },
                { status: 409 }
            );
        }

        // Create application (with timeout)
        const application = await withTimeout(
            prisma.application.create({
                data: {
                    fullName,
                    mobile,
                    email,
                    residenceCity,
                    residenceGovernorate,
                    canAttendTanta: Boolean(canAttendTanta),
                },
            }),
            10000,
            'Application create query'
        );

        // Create assessment attempt (with timeout)
        await withTimeout(
            prisma.assessmentAttempt.create({
                data: {
                    applicationId: application.id,
                },
            }),
            10000,
            'AssessmentAttempt create query'
        );

        return NextResponse.json({ id: application.id, message: 'Application created successfully' }, { status: 201 });
    } catch (error: unknown) {
        console.error('Application creation error:', error);
        console.error('Diagnostics:', diagnostics.join(' | '));
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                error: 'Internal server error',
                message: errorMessage,
                diagnostics,
            },
            { status: 500 }
        );
    }
}
