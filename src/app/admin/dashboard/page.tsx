'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Users,
    CheckCircle2,
    TrendingUp,
    MapPin,
    ArrowRight,
    Clock
} from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';

interface Stats {
    totalApplicants: number;
    completedAssessments: number;
    averageScore: number;
    topCities: Array<{ city: string; count: number }>;
    attendanceDistribution: { yes: number; no: number };
}

interface RecentApplicant {
    id: string;
    fullName: string;
    email: string;
    status: string;
    createdAt: string;
}

export default function AdminDashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentApplicants, setRecentApplicants] = useState<RecentApplicant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
            return;
        }

        if (status === 'authenticated') {
            Promise.all([
                fetch('/api/admin/stats').then(res => res.json()),
                fetch('/api/admin/applicants?limit=5').then(res => res.json())
            ]).then(([statsData, applicantsData]) => {
                setStats(statsData);
                setRecentApplicants(Array.isArray(applicantsData) ? applicantsData.slice(0, 5) : []);
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    }, [status, router]);

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-slate-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const totalApplicants = stats?.totalApplicants || 0;
    const maxCityCount = stats?.topCities?.[0]?.count || 1;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-slate-800"
                    >
                        Dashboard
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 mt-1"
                    >
                        Welcome back, {session?.user?.email?.split('@')[0] || 'Admin'}
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link
                        href="/admin/applicants"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
                    >
                        View All Applicants
                        <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Applicants"
                    value={stats?.totalApplicants || 0}
                    icon={<Users size={24} />}
                    variant="primary"
                />
                <StatsCard
                    title="Completed Assessments"
                    value={stats?.completedAssessments || 0}
                    icon={<CheckCircle2 size={24} />}
                    variant="success"
                />
                <StatsCard
                    title="Average Score"
                    value={`${stats?.averageScore?.toFixed(1) || 0}%`}
                    icon={<TrendingUp size={24} />}
                    variant="warning"
                />
                <StatsCard
                    title="Top City"
                    value={stats?.topCities?.[0]?.city || 'N/A'}
                    icon={<MapPin size={24} />}
                    variant="default"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Attendance Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
                >
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Can Attend in Tanta</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500">Yes</span>
                                <span className="text-emerald-400 font-medium">{stats?.attendanceDistribution?.yes || 0}</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${totalApplicants > 0 ? ((stats?.attendanceDistribution?.yes || 0) / totalApplicants) * 100 : 0}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500">No</span>
                                <span className="text-red-400 font-medium">{stats?.attendanceDistribution?.no || 0}</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${totalApplicants > 0 ? ((stats?.attendanceDistribution?.no || 0) / totalApplicants) * 100 : 0}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Top Cities */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
                >
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Top Cities</h2>
                    <div className="space-y-3">
                        {stats?.topCities?.slice(0, 5).map((city, idx) => (
                            <div key={city.city}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-700">{city.city}</span>
                                    <span className="text-slate-500">{city.count}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(city.count / maxCityCount) * 100}%` }}
                                        transition={{ duration: 0.8, delay: 0.1 * idx, ease: 'easeOut' }}
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                        {(!stats?.topCities || stats.topCities.length === 0) && (
                            <p className="text-slate-500 text-sm">No data available</p>
                        )}
                    </div>
                </motion.div>

                {/* Recent Applicants */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-800">Recent Applicants</h2>
                        <Clock size={18} className="text-slate-500" />
                    </div>
                    <div className="space-y-3">
                        {recentApplicants.map((applicant) => (
                            <Link
                                key={applicant.id}
                                href={`/admin/applicants/${applicant.id}`}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                    {applicant.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                                        {applicant.fullName}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">{applicant.email}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${applicant.status === 'NEW' ? 'bg-blue-500/20 text-blue-400' :
                                    applicant.status === 'REVIEWED' ? 'bg-yellow-500/20 text-yellow-400' :
                                        applicant.status === 'SHORTLISTED' ? 'bg-green-500/20 text-green-400' :
                                            applicant.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                                'bg-purple-500/20 text-purple-400'
                                    }`}>
                                    {applicant.status}
                                </span>
                            </Link>
                        ))}
                        {recentApplicants.length === 0 && (
                            <p className="text-slate-500 text-sm text-center py-4">No applicants yet</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
