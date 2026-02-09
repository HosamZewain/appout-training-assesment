'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { QuestionNavigator } from '@/components/ui/QuestionNavigator';
import { ConfirmModal } from '@/components/ui/Modal';

interface Question {
    id: string;
    text: string;
    type: 'MCQ' | 'SHORT_ANSWER';
    category: string;
    options?: Array<{ id: string; text: string; orderIndex: number }>;
}

export default function AssessmentPage() {
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            const applicationId = sessionStorage.getItem('applicationId');
            if (!applicationId) {
                router.push('/apply');
                return;
            }

            try {
                const response = await fetch('/api/assessments/questions');
                if (!response.ok) throw new Error('Failed to fetch questions');
                const data = await response.json();
                setQuestions(data);
            } catch (err) {
                setError('Failed to load assessment. Please refresh the page.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [router]);

    const handleAnswer = (answer: string) => {
        if (!questions[currentIndex]) return;
        setAnswers(prev => ({
            ...prev,
            [questions[currentIndex].id]: answer
        }));
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsModalOpen(false); // Close modal first
        setIsSubmitting(true);
        setSubmitError('');

        const applicationId = sessionStorage.getItem('applicationId');
        if (!applicationId) {
            router.push('/apply');
            return;
        }

        try {
            const response = await fetch('/api/assessments/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    applicationId,
                    answers: Object.entries(answers).map(([questionId, answer]) => ({
                        questionId,
                        answer
                    }))
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Submission failed');
            }

            // Clear session and redirect
            sessionStorage.removeItem('applicationId');
            router.push('/thank-you'); // Assuming there is a thank you page, or redirect to home
        } catch (err: any) {
            setSubmitError(err.message || 'Failed to submit assessment. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading your assessment...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
                <div className="glass-card max-w-md w-full text-center p-8 border-red-500/20">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Error</h2>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const isAnswered = !!answers[currentQuestion?.id];
    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / questions.length) * 100;

    return (
        <div className="min-h-screen py-8 px-4 bg-background relative z-10 selection:bg-primary/30">
            <div className="container max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Technical Assessment</h1>
                        <p className="text-muted-foreground text-sm">Application ID: {sessionStorage.getItem('applicationId')?.slice(0, 8)}...</p>
                    </div>
                    <div className="flex items-center gap-4 bg-card p-3 rounded-xl border border-border mt-4 md:mt-0">
                        <div className="text-right">
                            <p className="text-sm font-medium text-primary">{answeredCount} / {questions.length}</p>
                            <p className="text-xs text-muted-foreground">questions answered</p>
                        </div>
                        <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Main Question Area */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-card p-6 md:p-10 min-h-[400px] flex flex-col relative rounded-xl border border-border shadow-sm"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                                    <span className="text-9xl font-bold text-primary font-mono">
                                        {(currentIndex + 1).toString().padStart(2, '0')}
                                    </span>
                                </div>

                                <div className="mb-8 relative z-10">
                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                        {currentQuestion.category}
                                    </span>
                                    <h2 className="text-xl md:text-2xl font-semibold leading-relaxed text-slate-100">
                                        {currentQuestion.text}
                                    </h2>
                                </div>

                                <div className="flex-grow relative z-10">
                                    {currentQuestion.type === 'MCQ' ? (
                                        <div className="space-y-3">
                                            {currentQuestion.options?.map((option) => (
                                                <label
                                                    key={option.id}
                                                    className={`
                                                        flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer group
                                                        ${answers[currentQuestion.id] === option.text
                                                            ? 'bg-indigo-500/10 border-indigo-500 ring-1 ring-indigo-500/50'
                                                            : 'bg-slate-800/20 border-slate-700 hover:bg-slate-800/40 hover:border-slate-600'
                                                        }
                                                    `}
                                                >
                                                    <div className={`
                                                        w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors
                                                        ${answers[currentQuestion.id] === option.text
                                                            ? 'border-indigo-500 bg-indigo-500 text-white'
                                                            : 'border-slate-500 group-hover:border-indigo-400'
                                                        }
                                                    `}>
                                                        {answers[currentQuestion.id] === option.text && <div className="w-2 h-2 rounded-full bg-white" />}
                                                    </div>
                                                    <input
                                                        type="radio"
                                                        name={`question-${currentQuestion.id}`}
                                                        value={option.text}
                                                        checked={answers[currentQuestion.id] === option.text}
                                                        onChange={(e) => handleAnswer(e.target.value)}
                                                        className="hidden"
                                                    />
                                                    <span className="text-slate-200">{option.text}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <textarea
                                            value={answers[currentQuestion.id] || ''}
                                            onChange={(e) => handleAnswer(e.target.value)}
                                            placeholder="Type your answer here..."
                                            className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none transition-all placeholder:text-slate-600"
                                        />
                                    )}
                                </div>

                                <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/5 relative z-10">
                                    <Button
                                        variant="ghost"
                                        onClick={handlePrevious}
                                        disabled={currentIndex === 0}
                                        leftIcon={<ChevronLeft className="w-4 h-4" />}
                                    >
                                        Previous
                                    </Button>

                                    {currentIndex === questions.length - 1 ? (
                                        <Button
                                            onClick={() => setIsModalOpen(true)}
                                            rightIcon={<Send className="w-4 h-4" />}
                                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/20"
                                        >
                                            Submit Assessment
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleNext}
                                            rightIcon={<ChevronRight className="w-4 h-4" />}
                                        >
                                            Next Question
                                        </Button>
                                    )}
                                </div>

                                {submitError && (
                                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                        {submitError}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Sidebar / Navigation */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary rounded-full" />
                                Question Map
                            </h3>
                            <QuestionNavigator
                                currentIndex={currentIndex}
                                answers={answers}
                                questions={questions}
                                onSelectQuestion={setCurrentIndex}
                            />

                            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500 ring-2 ring-indigo-500/20"></div>
                                    <span>Current Question</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-500 flex items-center justify-center">
                                        <CheckCircle2 className="w-2.5 h-2.5" />
                                    </div>
                                    <span>Answered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700"></div>
                                    <span>Not Answered</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                            <h3 className="text-lg font-semibold text-card-foreground mb-2">Instructions</h3>
                            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                                <li>You can skip questions and come back later.</li>
                                <li>Review all answers before submitting.</li>
                                <li>Don't refresh the page or you may lose progress.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleSubmit}
                title="Submit Assessment?"
                description={`You have answered ${answeredCount} out of ${questions.length} questions. Are you sure you want to finish?`}
                confirmText="Yes, Submit"
                type="primary"
                isLoading={isSubmitting}
            />
        </div>
    );
}
