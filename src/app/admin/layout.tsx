'use client';

import { SessionProvider } from 'next-auth/react';
import { Sidebar } from '@/components/admin/Sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
                <Sidebar />
                {/* Main content area with margin for sidebar */}
                <main className="ml-[260px] min-h-screen transition-all duration-200">
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </SessionProvider>
    );
}
