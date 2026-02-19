import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { fullName, mobile, email, residenceCity, residenceGovernorate, canAttendTanta } = body;

        // --- Sanitization & Validation ---

        // Trim inputs
        fullName = fullName?.trim();
        email = email?.trim().toLowerCase();
        mobile = mobile?.trim();
        residenceCity = residenceCity?.trim();
        residenceGovernorate = residenceGovernorate?.trim();

        if (!fullName || fullName.length < 3 || fullName.length > 100) {
            return NextResponse.json({ error: 'Full name must be between 3 and 100 characters' }, { status: 400 });
        }

        if (!mobile || !/^01[0-9]{9}$/.test(mobile)) {
            return NextResponse.json({ error: 'Invalid mobile number' }, { status: 400 });
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 100) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        if (!residenceCity || residenceCity.length < 2 || residenceCity.length > 50) {
            return NextResponse.json({ error: 'City is required (2-50 chars)' }, { status: 400 });
        }

        if (!residenceGovernorate || residenceGovernorate.length < 2 || residenceGovernorate.length > 50) {
            return NextResponse.json({ error: 'Governorate is required (2-50 chars)' }, { status: 400 });
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
    } catch (error) {
        console.error('Application creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
