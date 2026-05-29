'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function MainContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin') ?? false;
    const isMaintenanceOrOffline = pathname === '/maintenance' || pathname === '/offline';

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const originalFetch = window.fetch;
            window.fetch = async (...args) => {
                try {
                    const res = await originalFetch(...args);
                    if (res.status >= 500 && res.status <= 504) {
                        if (window.location.pathname !== '/maintenance') {
                            window.location.href = '/maintenance';
                        }
                    }
                    return res;
                } catch (err) {
                    if (window.location.pathname !== '/maintenance') {
                        window.location.href = '/maintenance';
                    }
                    throw err;
                }
            };
            return () => {
                window.fetch = originalFetch;
            };
        }
    }, []);

    return (
        <main className={(isAdmin || isMaintenanceOrOffline) ? "min-h-screen" : "min-h-screen pt-[56px] md:pt-[72px]"}>
            {children}
        </main>
    );
}
