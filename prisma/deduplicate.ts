import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deduplicate() {
    console.log('🧹 Starting deduplication...');

    // 1. Fetch all questions
    const allQuestions = await prisma.question.findMany({
        orderBy: { createdAt: 'asc' }, // Keep the oldest one
        include: {
            options: true,
            answers: true
        }
    });

    console.log(`📊 Found ${allQuestions.length} total questions.`);

    const uniqueQuestions = new Map<string, string>(); // Key: "text|category", Value: questionId to keep
    const duplicates = [];

    for (const q of allQuestions) {
        const key = `${q.text}|${q.category}`;

        if (uniqueQuestions.has(key)) {
            // This is a duplicate
            duplicates.push(q);
        } else {
            // This is the first time seeing this question, keep it
            uniqueQuestions.set(key, q.id);
        }
    }

    console.log(`⚠️ Found ${duplicates.length} duplicates to remove.`);

    if (duplicates.length === 0) {
        console.log('✅ No duplicates found.');
        return;
    }

    // 2. Delete duplicates
    // Note: Due to foreign key constraints, we might need to handle answers pointing to these questions.
    // However, Cascade delete should handle options. 
    // Answers usually link to a specific question ID. If students answered DUPLICATE questions, 
    // simply deleting the question will delete their answers (if Cascade) or fail (if Restrict).
    // Let's check schema/constraints.
    // In schema: 
    // model Option { ... question Question @relation(fields: [questionId], references: [id], onDelete: Cascade) ... }
    // model Answer { ... question Question @relation(fields: [questionId], references: [id]) ... } -> No Cascade on Answer!

    // So we must handle answers first.
    // Valid strategy: Move answers from duplicate question to the kept question?
    // Or just delete them if they are test data?
    // Given the assessment nature, re-mapping answers is safer but complex (option IDs match?).
    // A simpler approach for now: If an answer points to a duplicate question, we can try to re-point it to the kept question.

    for (const dup of duplicates) {
        const keptId = uniqueQuestions.get(`${dup.text}|${dup.category}`);
        if (!keptId) continue; // Should not happen

        console.log(`Processing duplicate ID: ${dup.id} (Kept ID: ${keptId})`);

        // Check if duplicate has answers
        if (dup.answers.length > 0) {
            console.log(`  - Duplicate has ${dup.answers.length} answers. Re-mapping...`);
            // We need to map options too if they are MCQ.
            // This is getting complicated.
            // If the user just ran seed twice, likely no REAL answers exist on the duplicates yet?
            // Or if they did, re-mapping is best.

            // For now, let's TRY to delete. If it fails due to FK, we know we have answers.
            try {
                // Update answers to point to kept question
                // Problem: SelectedOptionId also points to an Option belonging to the DELETED question.
                // We would need to map duplicate-option-ID -> kept-option-ID.
            } catch (e) {
                console.error(`  - Failed to handle answers for ${dup.id}`);
            }
        }
    }

    // Simpler deletion for now: 
    // We will delete duplicates. Prisma should throw if there are answers attached (since no Cascade on Answer).
    // If that happens, we'll log it.

    let deletedCount = 0;
    for (const dup of duplicates) {
        try {
            // First check for answers
            const answersCount = await prisma.answer.count({ where: { questionId: dup.id } });
            if (answersCount > 0) {
                console.warn(`  ⚠️ Skipping duplicate ${dup.id} because it has ${answersCount} related answers. Manual intervention needed or more complex script.`);
                continue;
            }

            // Safe to delete (Options will cascade)
            await prisma.question.delete({
                where: { id: dup.id }
            });
            deletedCount++;
            process.stdout.write('.');
        } catch (error) {
            console.error(`\n❌ Failed to delete ${dup.id}:`, error);
        }
    }

    console.log(`\n\n✅ Successfully deleted ${deletedCount} duplicate questions.`);
}

deduplicate()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
