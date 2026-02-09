'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
    totalApplicants: number;
    completedAssessments: number;
    averageScore: number;
    topCities: Array<{ city: string; count: number }>;
    attendanceDistribution: { yes: number; no: number };
}

export default function AdminDashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
            return;
        }

        if (status === 'authenticated') {
            fetch('/api/admin/stats')
                .then(res => res.json())
                .then(data => {
                    setStats(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [status, router]);

    if (status === 'loading' || loading) {
        return (
            <div className="container py-20 flex items-center justify-center">
                <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-secondary">Welcome back, {session?.user?.email}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass-card">
                    <div className="text-4xl mb-2">👥</div>
                    <h3 className="text-2xl font-bold">{stats?.totalApplicants || 0}</h3>
                    <p className="text-sm text-secondary">Total Applicants</p>
                </div>

                <div className="glass-card">
                    <div className="text-4xl mb-2">✅</div>
                    <h3 className="text-2xl font-bold">{stats?.completedAssessments || 0}</h3>
                    <p className="text-sm text-secondary">Completed Assessments</p>
                </div>

                <div className="glass-card">
                    <div className="text-4xl mb-2">📊</div>
                    <h3 className="text-2xl font-bold">{stats?.averageScore?.toFixed(1) || 0}%</h3>
                    <p className="text-sm text-secondary">Average Score</p>
                </div>

                <div className="glass-card">
                    <div className="text-4xl mb-2">📍</div>
                    <h3 className="text-2xl font-bold">{stats?.topCities?.[0]?.city || 'N/A'}</h3>
                    <p className="text-sm text-secondary">Top City</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card mb-8">
                <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                    <Link href="/admin/applicants" className="btn btn-primary">
                        View All Applicants
                    </Link>
                    <button className="btn btn-secondary" onClick={() => router.push('/admin/applicants?status=NEW')}>
                        New Applications
                    </button>
                </div>
            </div>

            {/* Attendance Distribution */}
            {stats && (
                <div className="glass-card">
                    <h2 className="text-2xl font-bold mb-4">Can Attend in Tanta</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-500 bg-opacity-10 border border-green-500 rounded-lg">
                            <div className="text-3xl font-bold text-green-400">{stats.attendanceDistribution.yes}</div>
                            <div className="text-sm text-secondary">Yes</div>
                        </div>
                        <div className="text-center p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
                            <div className="text-3xl font-bold text-red-400">{stats.attendanceDistribution.no}</div>
                            <div className="text-sm text-secondary">No</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
