'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronRight, ChevronDown, User, Download, MapPin, GraduationCap, X, TrendingUp } from 'lucide-react';
import { exportToExcel } from '@/lib/export-utils';

interface Applicant {
    id: string;
    fullName: string;
    email: string;
    mobile: string;
    residenceCity: string;
    residenceGovernorate: string;
    canAttendTanta: boolean;
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

function ApplicantsContent() {
    const { status: authStatus } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Initialize filter states from URL params
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
    const [canAttendTanta, setCanAttendTanta] = useState(searchParams.get('canAttendTanta') || '');
    const [governorate, setGovernorate] = useState(searchParams.get('governorate') || '');
    const [city, setCity] = useState(searchParams.get('city') || '');
    const [assessmentStatus, setAssessmentStatus] = useState(searchParams.get('assessmentStatus') || '');
    const [minScore, setMinScore] = useState(searchParams.get('minScore') || '');

    const activeFilterCount = [statusFilter, canAttendTanta, governorate, city, assessmentStatus, minScore].filter(Boolean).length;

    // Auto-open filter panel if any filter was previously active
    useEffect(() => {
        if (activeFilterCount > 0) {
            setShowFilters(true);
        }
    }, []);

    // Sync filters to URL
    const syncFiltersToURL = useCallback(() => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (statusFilter) params.set('status', statusFilter);
        if (canAttendTanta) params.set('canAttendTanta', canAttendTanta);
        if (governorate) params.set('governorate', governorate);
        if (city) params.set('city', city);
        if (assessmentStatus) params.set('assessmentStatus', assessmentStatus);
        if (minScore) params.set('minScore', minScore);

        const paramString = params.toString();
        const newUrl = paramString ? `/admin/applicants?${paramString}` : '/admin/applicants';
        router.replace(newUrl, { scroll: false });
    }, [search, statusFilter, canAttendTanta, governorate, city, assessmentStatus, minScore, router]);

    useEffect(() => {
        if (authStatus === 'unauthenticated') {
            router.push('/admin/login');
            return;
        }

        if (authStatus === 'authenticated') {
            fetchApplicants();
        }
    }, [authStatus, router]);

    const handleExport = () => {
        const exportData = applicants.map(a => ({
            'Full Name': a.fullName,
            'Email': a.email,
            'Mobile': a.mobile,
            'City': a.residenceCity,
            'Governorate': a.residenceGovernorate,
            'Can Attend Tanta': a.canAttendTanta ? 'Yes' : 'No',
            'Status': a.status,
            'Score': a.assessmentAttempt?.isCompleted ? Math.round(a.assessmentAttempt.totalScore) : 'Pending',
            'Applied On': new Date(a.createdAt).toLocaleDateString(),
        }));

        exportToExcel(exportData, `Applicants_${new Date().toISOString().split('T')[0]}`);
    };

    const fetchApplicants = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (statusFilter) params.append('status', statusFilter);
            if (canAttendTanta) params.append('canAttendTanta', canAttendTanta);
            if (governorate) params.append('governorate', governorate);
            if (city) params.append('city', city);
            if (assessmentStatus) params.append('assessmentStatus', assessmentStatus);
            if (minScore) params.append('minScore', minScore);

            const response = await fetch(`/api/admin/applicants?${params}`);
            const data = await response.json();
            setApplicants(data);
        } catch (error) {
            console.error('Error fetching applicants:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearAllFilters = () => {
        setSearch('');
        setStatusFilter('');
        setCanAttendTanta('');
        setGovernorate('');
        setCity('');
        setAssessmentStatus('');
        setMinScore('');
    };

    useEffect(() => {
        if (authStatus === 'authenticated') {
            const timeout = setTimeout(() => {
                fetchApplicants();
                syncFiltersToURL();
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [search, statusFilter, canAttendTanta, governorate, city, assessmentStatus, minScore, authStatus]);

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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Applicants</h1>
                        <p className="text-slate-500 mt-1">Manage and review all training applicants</p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={applicants.length === 0}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-sm active:scale-95"
                    >
                        <Download size={18} />
                        Export to Excel
                    </button>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
            >
                {/* Search + Toggle Row */}
                <div className="p-4">
                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or mobile..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Filters Toggle Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all ${showFilters || activeFilterCount > 0
                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <Filter size={18} />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="inline-flex items-center justify-center w-5 h-5 bg-indigo-600 text-white text-xs font-bold rounded-full">
                                    {activeFilterCount}
                                </span>
                            )}
                            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Expanded Filter Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-4 pt-0 border-t border-slate-100">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                                    {/* Status */}
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Status</label>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all cursor-pointer"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="NEW">New</option>
                                            <option value="REVIEWED">Reviewed</option>
                                            <option value="SHORTLISTED">Shortlisted</option>
                                            <option value="REJECTED">Rejected</option>
                                            <option value="CONTACTED">Contacted</option>
                                        </select>
                                    </div>

                                    {/* Can Attend Tanta */}
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Can Attend Tanta</label>
                                        <select
                                            value={canAttendTanta}
                                            onChange={(e) => setCanAttendTanta(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all cursor-pointer"
                                        >
                                            <option value="">All</option>
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>

                                    {/* Assessment Status */}
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Assessment</label>
                                        <select
                                            value={assessmentStatus}
                                            onChange={(e) => setAssessmentStatus(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all cursor-pointer"
                                        >
                                            <option value="">All</option>
                                            <option value="completed">Completed</option>
                                            <option value="pending">In Progress</option>
                                            <option value="not_started">Not Started</option>
                                        </select>
                                    </div>

                                    {/* Minimum Score */}
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Min Score</label>
                                        <div className="relative">
                                            <TrendingUp size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="e.g. 70"
                                                value={minScore}
                                                onChange={(e) => setMinScore(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Governorate */}
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Governorate</label>
                                        <div className="relative">
                                            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Filter by governorate..."
                                                value={governorate}
                                                onChange={(e) => setGovernorate(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">City</label>
                                        <div className="relative">
                                            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Filter by city..."
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Clear Filters - spans 2 cols on lg */}
                                    <div className="lg:col-span-2 flex items-end">
                                        <button
                                            onClick={clearAllFilters}
                                            disabled={activeFilterCount === 0 && !search}
                                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 hover:bg-red-100 disabled:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed text-red-600 border border-red-200 disabled:border-slate-200 rounded-xl font-medium transition-all"
                                        >
                                            <X size={16} />
                                            Clear All Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Results Count + Active Filter Tags */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-2"
            >
                <p className="text-sm text-slate-500">
                    Showing <span className="text-slate-800 font-medium">{applicants.length}</span> applicants
                </p>
                {statusFilter && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200">
                        Status: {statusFilter}
                        <button onClick={() => setStatusFilter('')} className="hover:text-indigo-900"><X size={12} /></button>
                    </span>
                )}
                {canAttendTanta && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200">
                        Tanta: {canAttendTanta === 'true' ? 'Yes' : 'No'}
                        <button onClick={() => setCanAttendTanta('')} className="hover:text-indigo-900"><X size={12} /></button>
                    </span>
                )}
                {assessmentStatus && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200">
                        Assessment: {assessmentStatus}
                        <button onClick={() => setAssessmentStatus('')} className="hover:text-indigo-900"><X size={12} /></button>
                    </span>
                )}
                {minScore && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200">
                        Score ≥ {minScore}
                        <button onClick={() => setMinScore('')} className="hover:text-indigo-900"><X size={12} /></button>
                    </span>
                )}
                {governorate && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200">
                        Gov: {governorate}
                        <button onClick={() => setGovernorate('')} className="hover:text-indigo-900"><X size={12} /></button>
                    </span>
                )}
                {city && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200">
                        City: {city}
                        <button onClick={() => setCity('')} className="hover:text-indigo-900"><X size={12} /></button>
                    </span>
                )}
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
                                    transition={{ delay: 0.05 * Math.min(idx, 10) }}
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
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className="font-medium text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                                                    {applicant.fullName}
                                                </h3>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                                                    {applicant.status}
                                                </span>
                                                {applicant.canAttendTanta && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full border border-emerald-200">
                                                        <GraduationCap size={12} />
                                                        Tanta
                                                    </span>
                                                )}
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

export default function ApplicantsListPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-slate-500">Loading applicants...</p>
                </div>
            </div>
        }>
            <ApplicantsContent />
        </Suspense>
    );
}
