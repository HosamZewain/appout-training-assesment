'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

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

export default function ApplicantDetailsPage() {
    const { status: authStatus } = useSession();
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [applicant, setApplicant] = useState<ApplicantDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');

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
            alert('Changes saved successfully');
        } catch (error) {
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    if (authStatus === 'loading' || loading) {
        return (
            <div className="container py-20 flex items-center justify-center">
                <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
            </div>
        );
    }

    if (!applicant) {
        return (
            <div className="container py-20 text-center">
                <h2>Applicant not found</h2>
            </div>
        );
    }

    const sectionScores = applicant.assessmentAttempt?.sectionScores
        ? JSON.parse(applicant.assessmentAttempt.sectionScores)
        : {};

    return (
        <div className="container py-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold mb-2">{applicant.fullName}</h1>
                    <p className="text-secondary">Applicant Details</p>
                </div>
                <Link href="/admin/applicants" className="btn btn-secondary">
                    ← Back to List
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Personal Info & Actions */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Personal Information */}
                    <div className="glass-card">
                        <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
                        <div className="space-y-3">
                            <div>
                                <div className="text-sm text-secondary">Email</div>
                                <div>{applicant.email}</div>
                            </div>
                            <div>
                                <div className="text-sm text-secondary">Mobile</div>
                                <div>{applicant.mobile}</div>
                            </div>
                            <div>
                                <div className="text-sm text-secondary">Location</div>
                                <div>{applicant.residenceCity}, {applicant.residenceGovernorate}</div>
                            </div>
                            <div>
                                <div className="text-sm text-secondary">Can Attend in Tanta</div>
                                <div className={applicant.canAttendTanta ? 'text-green-400' : 'text-red-400'}>
                                    {applicant.canAttendTanta ? 'Yes' : 'No'}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-secondary">Applied On</div>
                                <div>{new Date(applicant.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="glass-card">
                        <h2 className="text-2xl font-bold mb-4">Admin Actions</h2>

                        <div className="input-group">
                            <label className="input-label">Status</label>
                            <select
                                className="select-field"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="NEW">New</option>
                                <option value="REVIEWED">Reviewed</option>
                                <option value="SHORTLISTED">Shortlisted</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="CONTACTED">Contacted</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Notes</label>
                            <textarea
                                className="textarea-field"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add internal notes..."
                                rows={5}
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn btn-primary w-full"
                        >
                            {saving ? <span className="spinner"></span> : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* Right Column - Assessment Results */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Overall Score */}
                    {applicant.assessmentAttempt && (
                        <>
                            <div className="glass-card">
                                <h2 className="text-2xl font-bold mb-4">Assessment Score</h2>
                                <div className="flex items-center gap-4">
                                    <div className="text-5xl font-bold" style={{
                                        background: 'var(--color-gradient-primary)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}>
                                        {applicant.assessmentAttempt.totalScore.toFixed(1)}%
                                    </div>
                                    <div>
                                        <div className="text-secondary text-sm">Total Score</div>
                                        {applicant.assessmentAttempt.submittedAt && (
                                            <div className="text-secondary text-xs">
                                                Submitted: {new Date(applicant.assessmentAttempt.submittedAt).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Section Scores */}
                            <div className="glass-card">
                                <h2 className="text-2xl font-bold mb-4">Section Breakdown</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(sectionScores).map(([category, scores]: [string, any]) => (
                                        <div key={category} className="p-4 bg-gray-800 bg-opacity-30 rounded-lg">
                                            <div className="text-sm text-secondary mb-2">{category}</div>
                                            <div className="progress-bar mb-2">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${(scores.score / scores.total) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-sm font-semibold">
                                                {scores.score} / {scores.total} points
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Detailed Answers */}
                            <div className="glass-card">
                                <h2 className="text-2xl font-bold mb-4">Detailed Answers</h2>
                                <div className="space-y-4">
                                    {applicant.assessmentAttempt.answers.map((answer, idx) => (
                                        <div key={idx} className="p-4 bg-gray-800 bg-opacity-20 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="inline-block px-2 py-1 text-xs rounded bg-purple-500 bg-opacity-20 text-purple-400">
                                                    {answer.question.category}
                                                </span>
                                                <span className={`text-sm font-semibold ${answer.isCorrect === true ? 'text-green-400' :
                                                        answer.isCorrect === false ? 'text-red-400' :
                                                            'text-yellow-400'
                                                    }`}>
                                                    {answer.score} pts
                                                </span>
                                            </div>
                                            <div className="font-semibold mb-2">{answer.question.text}</div>

                                            {answer.question.type === 'MCQ' ? (
                                                <div className="space-y-2">
                                                    {answer.question.options.map((option) => (
                                                        <div
                                                            key={option.id}
                                                            className={`p-2 rounded text-sm ${option.id === answer.selectedOptionId && option.isCorrect
                                                                    ? 'bg-green-500 bg-opacity-20 border border-green-500'
                                                                    : option.id === answer.selectedOptionId
                                                                        ? 'bg-red-500 bg-opacity-20 border border-red-500'
                                                                        : option.isCorrect
                                                                            ? 'bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30'
                                                                            : 'bg-gray-700 bg-opacity-30'
                                                                }`}
                                                        >
                                                            {option.text}
                                                            {option.id === answer.selectedOptionId && ' (Selected)'}
                                                            {option.isCorrect && ' ✓'}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-gray-700 bg-opacity-30 rounded mt-2">
                                                    <div className="text-sm text-secondary mb-1">Answer:</div>
                                                    <div className="whitespace-pre-wrap">
                                                        {answer.textAnswer || '(No answer provided)'}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
