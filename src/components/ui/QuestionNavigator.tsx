import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuestionNavigatorProps {
    currentIndex: number;
    answers: Record<string, any>;
    questions: Array<{ id: string; category: string }>;
    onSelectQuestion: (index: number) => void;
    className?: string;
}

export function QuestionNavigator({
    currentIndex,
    answers,
    questions,
    onSelectQuestion,
    className
}: QuestionNavigatorProps) {
    return (
        <div className={cn("grid grid-cols-4 sm:grid-cols-5 gap-2", className)}>
            {questions.map((question, index) => {
                const isAnswered = !!answers[question.id];
                const isCurrent = index === currentIndex;

                let statusColor = "bg-muted text-muted-foreground border-border hover:bg-muted/80"; // Default
                if (isAnswered) statusColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20";
                if (isCurrent) statusColor = "bg-primary/20 text-primary border-primary ring-2 ring-primary/20 hover:bg-primary/30";

                return (
                    <motion.button
                        key={question.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectQuestion(index)}
                        className={cn(
                            "relative flex flex-col items-center justify-center p-2 rounded-lg border transition-colors duration-200",
                            statusColor
                        )}
                        title={`Question ${index + 1} (${question.category})`}
                    >
                        <span className="text-xs font-bold mb-1">{index + 1}</span>
                        {isAnswered ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : (
                            <Circle className={cn("w-4 h-4", isCurrent ? "fill-indigo-400/20 text-indigo-400" : "text-slate-600")} />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
