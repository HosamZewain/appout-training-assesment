'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Applicant {
    id: string;
    fullName: string;
    email: string;
    mobile: string;
    residenceCity: string;
    status: string;
    createdAt: string;
    assessmentAttempt?: {
        totalScore: number;
        isCompleted: boolean;
    };
}

export default function ApplicantsListPage() {
    const { status: authStatus } = useSession();
    const router = useRouter();
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        if (authStatus === 'unauthenticated') {
            router.push('/admin/login');
            return;
        }

        if (authStatus === 'authenticated') {
            fetchApplicants();
        }
    }, [authStatus, router]);

    const fetchApplicants = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (statusFilter) params.append('status', statusFilter);

            const response = await fetch(`/api/admin/applicants?${params}`);
            const data = await response.json();
            setApplicants(data);
        } catch (error) {
            console.error('Error fetching applicants:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authStatus === 'authenticated') {
            const timeout = setTimeout(() => {
                fetchApplicants();
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [search, statusFilter, authStatus]);

    if (authStatus === 'loading' || loading) {
        return (
            <div className="container py-20 flex items-center justify-center">
                <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Applicants</h1>
                    <p className="text-secondary">Manage and review all applicants</p>
                </div>
                <Link href="/admin/dashboard" className="btn btn-secondary">
                    ← Back to Dashboard
                </Link>
            </div>

            {/* Filters */}
            <div className="glass-card mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="input-label">Search</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Search by name, email, or mobile..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="input-label">Status</label>
                        <select
                            className="select-field"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="NEW">New</option>
                            <option value="REVIEWED">Reviewed</option>
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="CONTACTED">Contacted</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Applicants Table */}
            <div className="glass-card">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left p-4">Name</th>
                                <th className="text-left p-4">Email</th>
                                <th className="text-left p-4">Mobile</th>
                                <th className="text-left p-4">City</th>
                                <th className="text-left p-4">Score</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-secondary">
                                        No applicants found
                                    </td>
                                </tr>
                            ) : (
                                applicants.map((applicant) => (
                                    <tr key={applicant.id} className="border-b border-gray-800 hover:bg-gray-800 hover:bg-opacity-30">
                                        <td className="p-4">{applicant.fullName}</td>
                                        <td className="p-4 text-sm text-secondary">{applicant.email}</td>
                                        <td className="p-4 text-sm text-secondary">{applicant.mobile}</td>
                                        <td className="p-4 text-sm">{applicant.residenceCity}</td>
                                        <td className="p-4">
                                            {applicant.assessmentAttempt?.isCompleted ? (
                                                <span className="font-semibold">
                                                    {applicant.assessmentAttempt.totalScore.toFixed(1)}%
                                                </span>
                                            ) : (
                                                <span className="text-secondary text-sm">Pending</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${applicant.status === 'NEW' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                                                    applicant.status === 'REVIEWED' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                                                        applicant.status === 'SHORTLISTED' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                                                            applicant.status === 'REJECTED' ? 'bg-red-500 bg-opacity-20 text-red-400' :
                                                                'bg-purple-500 bg-opacity-20 text-purple-400'
                                                }`}>
                                                {applicant.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <Link
                                                href={`/admin/applicants/${applicant.id}`}
                                                className="text-sm text-accent hover:underline"
                                            >
                                                View Details →
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
