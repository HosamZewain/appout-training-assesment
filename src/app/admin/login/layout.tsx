'use client';

import { SessionProvider } from 'next-auth/react';

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Login page has its own layout without the sidebar
    return (
        <SessionProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                {children}
            </div>
        </SessionProvider>
    );
}
