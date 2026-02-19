'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronRight, User } from 'lucide-react';

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

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
    NEW: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
    REVIEWED: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400' },
    SHORTLISTED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    REJECTED: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
    CONTACTED: { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-400' },
};

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
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-slate-500">Loading applicants...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-slate-800">Applicants</h1>
                <p className="text-slate-500 mt-1">Manage and review all training applicants</p>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
            >
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or mobile..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all cursor-pointer min-w-[180px]"
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
            </motion.div>

            {/* Results Count */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between"
            >
                <p className="text-sm text-slate-500">
                    Showing <span className="text-slate-800 font-medium">{applicants.length}</span> applicants
                </p>
            </motion.div>

            {/* Applicants List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
            >
                {applicants.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                            <User size={32} className="text-slate-600" />
                        </div>
                        <p className="text-slate-500">No applicants found</p>
                        <p className="text-slate-600 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {applicants.map((applicant, idx) => {
                            const statusStyle = statusColors[applicant.status] || statusColors.NEW;
                            return (
                                <motion.div
                                    key={applicant.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * idx }}
                                >
                                    <Link
                                        href={`/admin/applicants/${applicant.id}`}
                                        className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group"
                                    >
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shrink-0">
                                            {applicant.fullName.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Main Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-medium text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                                                    {applicant.fullName}
                                                </h3>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                                                    {applicant.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                                <span className="truncate">{applicant.email}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="hidden sm:inline">{applicant.mobile}</span>
                                            </div>
                                        </div>

                                        {/* City */}
                                        <div className="hidden md:block text-sm text-slate-400 shrink-0 w-28 text-center">
                                            {applicant.residenceCity}
                                        </div>

                                        {/* Score */}
                                        <div className="shrink-0 w-20 text-center">
                                            {applicant.assessmentAttempt?.isCompleted ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center relative">
                                                        <svg className="w-10 h-10 -rotate-90">
                                                            <circle
                                                                cx="20"
                                                                cy="20"
                                                                r="16"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="3"
                                                                className="text-slate-200"
                                                            />
                                                            <circle
                                                                cx="20"
                                                                cy="20"
                                                                r="16"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="3"
                                                                strokeDasharray={100}
                                                                strokeDashoffset={100 - applicant.assessmentAttempt.totalScore}
                                                                strokeLinecap="round"
                                                                className={
                                                                    applicant.assessmentAttempt.totalScore >= 80 ? 'text-emerald-500' :
                                                                        applicant.assessmentAttempt.totalScore >= 60 ? 'text-indigo-500' :
                                                                            applicant.assessmentAttempt.totalScore >= 40 ? 'text-yellow-500' :
                                                                                'text-red-500'
                                                                }
                                                            />
                                                        </svg>
                                                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-800">
                                                            {Math.round(applicant.assessmentAttempt.totalScore)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-600">Pending</span>
                                            )}
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
