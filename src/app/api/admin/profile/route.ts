import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { currentPassword, newPassword, email } = body;

        if (!currentPassword) {
            return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
        }

        // Get current admin
        const admin = await prisma.admin.findUnique({
            where: { email: session.user.email },
        });

        if (!admin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, admin.password);
        if (!isValidPassword) {
            return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
        }

        const updates: any = {};

        // Update email if provided and different
        if (email && email !== admin.email) {
            // Check if email already exists
            const existing = await prisma.admin.findUnique({
                where: { email },
            });
            if (existing) {
                return NextResponse.json({ error: 'Email already currently in use' }, { status: 400 });
            }
            updates.email = email;
        }

        // Update password if provided
        if (newPassword) {
            if (newPassword.length < 6) {
                return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
            }
            updates.password = await bcrypt.hash(newPassword, 10);
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ message: 'No changes made' });
        }

        // Apply updates
        await prisma.admin.update({
            where: { id: admin.id },
            data: updates,
        });

        return NextResponse.json({ message: 'Profile updated successfully' });

    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
