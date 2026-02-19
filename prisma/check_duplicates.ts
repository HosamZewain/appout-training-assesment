import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDuplicates() {
    console.log('🔍 Checking for ANY duplicate texts...');

    const allQuestions = await prisma.question.findMany({
        select: { id: true, text: true, category: true }
    });

    const textMap = new Map<string, any[]>();

    for (const q of allQuestions) {
        if (!textMap.has(q.text)) {
            textMap.set(q.text, []);
        }
        textMap.get(q.text)?.push(q);
    }

    let dupCount = 0;
    for (const [text, questions] of textMap.entries()) {
        if (questions.length > 1) {
            console.log(`⚠️ Duplicate Text Found (${questions.length} times): "${text.substring(0, 50)}..."`);
            questions.forEach(q => console.log(`   - ID: ${q.id} | Category: ${q.category}`));
            dupCount++;
        }
    }

    if (dupCount === 0) {
        console.log('✅ No duplicates found by text.');
    } else {
        console.log(`❌ Found ${dupCount} questions with duplicate texts.`);
    }
}

checkDuplicates()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
