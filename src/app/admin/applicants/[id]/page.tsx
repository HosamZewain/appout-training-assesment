'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Phone, MapPin, Calendar, Check, X,
    ChevronDown, ChevronUp, Save, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { ScoreRing } from '@/components/admin/ScoreRing';

interface ApplicantDetails {
    id: string;
    fullName: string;
    email: string;
    mobile: string;
    residenceCity: string;
    residenceGovernorate: string;
    canAttendTanta: boolean;
    status: string;
    adminNotes: string | null;
    createdAt: string;
    assessmentAttempt?: {
        totalScore: number;
        sectionScores: string;
        submittedAt: string | null;
        answers: Array<{
            question: {
                category: string;
                text: string;
                type: string;
                options: Array<{ id: string; text: string; isCorrect: boolean }>;
            };
            selectedOptionId: string | null;
            textAnswer: string | null;
            isCorrect: boolean | null;
            score: number;
        }>;
    };
}

const statusOptions = [
    { value: 'NEW', label: 'New', color: 'bg-blue-500' },
    { value: 'REVIEWED', label: 'Reviewed', color: 'bg-yellow-500' },
    { value: 'SHORTLISTED', label: 'Shortlisted', color: 'bg-emerald-500' },
    { value: 'REJECTED', label: 'Rejected', color: 'bg-red-500' },
    { value: 'CONTACTED', label: 'Contacted', color: 'bg-purple-500' },
];

export default function ApplicantDetailsPage() {
    const { status: authStatus } = useSession();
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [applicant, setApplicant] = useState<ApplicantDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (authStatus === 'unauthenticated') {
            router.push('/admin/login');
            return;
        }

        if (authStatus === 'authenticated' && id) {
            fetchApplicant();
        }
    }, [authStatus, id, router]);

    const fetchApplicant = async () => {
        try {
            const response = await fetch(`/api/admin/applicants/${id}`);
            const data = await response.json();
            setApplicant(data);
            setStatus(data.status);
            setNotes(data.adminNotes || '');
            setLoading(false);
        } catch (error) {
            console.error('Error fetching applicant:', error);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch(`/api/admin/applicants/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, adminNotes: notes }),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error('Failed to save:', error);
        } finally {
            setSaving(false);
        }
    };

    const toggleSection = (category: string) => {
        setExpandedSections(prev => ({ ...prev, [category]: !prev[category] }));
    };

    if (authStatus === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-slate-500">Loading applicant details...</p>
                </div>
            </div>
        );
    }

    if (!applicant) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Applicant not found</h2>
                    <Link href="/admin/applicants" className="text-indigo-600 hover:underline">
                        ← Back to list
                    </Link>
                </div>
            </div>
        );
    }

    const sectionScores = applicant.assessmentAttempt?.sectionScores
        ? JSON.parse(applicant.assessmentAttempt.sectionScores)
        : {};

    // Group answers by category
    type AnswerType = NonNullable<ApplicantDetails['assessmentAttempt']>['answers'][number];
    const answersByCategory: Record<string, AnswerType[]> = {};
    applicant.assessmentAttempt?.answers.forEach(answer => {
        const cat = answer.question.category;
        if (!answersByCategory[cat]) answersByCategory[cat] = [];
        answersByCategory[cat].push(answer);
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/applicants"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{applicant.fullName}</h1>
                        <p className="text-slate-500 mt-1">Applicant Details</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Personal Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
                    >
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Personal Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-100">
                                    <Mail size={18} className="text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Email</p>
                                    <p className="text-slate-800">{applicant.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-100">
                                    <Phone size={18} className="text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Mobile</p>
                                    <p className="text-slate-800">{applicant.mobile}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-100">
                                    <MapPin size={18} className="text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Location</p>
                                    <p className="text-slate-800">{applicant.residenceCity}, {applicant.residenceGovernorate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${applicant.canAttendTanta ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                    {applicant.canAttendTanta ? (
                                        <Check size={18} className="text-emerald-400" />
                                    ) : (
                                        <X size={18} className="text-red-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Can Attend in Tanta</p>
                                    <p className={applicant.canAttendTanta ? 'text-emerald-400' : 'text-red-400'}>
                                        {applicant.canAttendTanta ? 'Yes' : 'No'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-100">
                                    <Calendar size={18} className="text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Applied On</p>
                                    <p className="text-slate-800">{new Date(applicant.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Admin Actions Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
                    >
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Admin Actions</h2>

                        {/* Status Selector */}
                        <div className="mb-4">
                            <label className="text-xs text-slate-500 block mb-2">Status</label>
                            <div className="grid grid-cols-2 gap-2">
                                {statusOptions.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setStatus(opt.value)}
                                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${status === opt.value
                                            ? `${opt.color} text-white shadow-lg`
                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="mb-4">
                            <label className="text-xs text-slate-500 block mb-2">Internal Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add notes about this applicant..."
                                rows={4}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : saved ? (
                                <>
                                    <Check size={18} />
                                    Saved!
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </motion.div>
                </div>

                {/* Right Column - Assessment */}
                <div className="lg:col-span-2 space-y-6">
                    {applicant.assessmentAttempt ? (
                        <>
                            {/* Score Overview */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
                            >
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <ScoreRing
                                        score={applicant.assessmentAttempt.totalScore}
                                        size="lg"
                                        label="Overall Score"
                                    />
                                    <div className="flex-1 w-full">
                                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Section Breakdown</h2>
                                        <div className="space-y-3">
                                            {Object.entries(sectionScores).map(([category, scores]: [string, any]) => {
                                                const percentage = (scores.score / scores.total) * 100;
                                                return (
                                                    <div key={category}>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-slate-600">{category}</span>
                                                            <span className="text-slate-500">{scores.score}/{scores.total}</span>
                                                        </div>
                                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${percentage}%` }}
                                                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                                                className={`h-full rounded-full ${percentage >= 80 ? 'bg-emerald-500' :
                                                                    percentage >= 60 ? 'bg-indigo-500' :
                                                                        percentage >= 40 ? 'bg-yellow-500' :
                                                                            'bg-red-500'
                                                                    }`}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Answers by Category */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-4"
                            >
                                {Object.entries(answersByCategory).map(([category, answers]) => (
                                    <div
                                        key={category}
                                        className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                                    >
                                        <button
                                            onClick={() => toggleSection(category)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                                                    {category}
                                                </span>
                                                <span className="text-slate-400 text-sm">
                                                    {answers.length} question{answers.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            {expandedSections[category] ? (
                                                <ChevronUp size={20} className="text-slate-400" />
                                            ) : (
                                                <ChevronDown size={20} className="text-slate-400" />
                                            )}
                                        </button>

                                        <AnimatePresence>
                                            {expandedSections[category] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="border-t border-slate-200"
                                                >
                                                    <div className="p-4 space-y-4">
                                                        {answers.map((answer, idx) => (
                                                            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
                                                                <div className="flex justify-between items-start mb-3">
                                                                    <p className="text-slate-800 font-medium">{answer.question.text}</p>
                                                                    <span className={`ml-4 shrink-0 px-2 py-1 rounded text-xs font-semibold ${answer.isCorrect === true ? 'bg-emerald-500/20 text-emerald-400' :
                                                                        answer.isCorrect === false ? 'bg-red-500/20 text-red-400' :
                                                                            'bg-yellow-500/20 text-yellow-400'
                                                                        }`}>
                                                                        {answer.score} pts
                                                                    </span>
                                                                </div>

                                                                {answer.question.type === 'MCQ' ? (
                                                                    <div className="space-y-2">
                                                                        {answer.question.options.map((option) => {
                                                                            const isSelected = option.id === answer.selectedOptionId;
                                                                            const isCorrect = option.isCorrect;
                                                                            let bgClass = 'bg-slate-100';
                                                                            let borderClass = 'border-transparent';

                                                                            if (isSelected && isCorrect) {
                                                                                bgClass = 'bg-emerald-500/10';
                                                                                borderClass = 'border-emerald-500/50';
                                                                            } else if (isSelected && !isCorrect) {
                                                                                bgClass = 'bg-red-500/10';
                                                                                borderClass = 'border-red-500/50';
                                                                            } else if (isCorrect) {
                                                                                bgClass = 'bg-emerald-500/5';
                                                                                borderClass = 'border-emerald-500/30';
                                                                            }

                                                                            return (
                                                                                <div
                                                                                    key={option.id}
                                                                                    className={`p-3 rounded-lg text-sm ${bgClass} border ${borderClass}`}
                                                                                >
                                                                                    <div className="flex items-center justify-between">
                                                                                        <span className="text-slate-700">{option.text}</span>
                                                                                        <div className="flex items-center gap-2">
                                                                                            {isSelected && (
                                                                                                <span className="text-xs text-slate-500">Selected</span>
                                                                                            )}
                                                                                            {isCorrect && (
                                                                                                <Check size={16} className="text-emerald-400" />
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                ) : (
                                                                    <div className="p-3 bg-slate-50 rounded-lg">
                                                                        <p className="text-xs text-slate-500 mb-1">Answer:</p>
                                                                        <p className="text-slate-700 whitespace-pre-wrap">
                                                                            {answer.textAnswer || '(No answer provided)'}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </motion.div>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white border border-slate-200 rounded-2xl p-12 shadow-sm text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                                <X size={32} className="text-slate-600" />
                            </div>
                            <p className="text-slate-500">Assessment not completed yet</p>
                            <p className="text-slate-600 text-sm mt-1">The applicant hasn't submitted their assessment</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
