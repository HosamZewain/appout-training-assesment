import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@appout.com'; // Change this if you want a different email
    const newPassword = 'new-password-123'; // Change this to your desired password

    console.log(`🔐 Resetting password for ${email}...`);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const admin = await prisma.admin.upsert({
        where: { email },
        update: {
            password: hashedPassword,
        },
        create: {
            email,
            password: hashedPassword,
        },
    });

    console.log('✅ Admin credentials updated successfully!');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${newPassword}`);
    console.log('⚠️  Please delete this script after use for security.');
}

main()
    .catch((e) => {
        console.error('❌ Error resetting credentials:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
