'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSnackbar } from '@/context/SnackbarContext';

export default function MainContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { showSnackbar } = useSnackbar();
    const isAdmin = pathname?.startsWith('/admin') ?? false;
    const isMaintenanceOrOffline = pathname === '/maintenance' || pathname === '/offline';

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const originalFetch = window.fetch;
            window.fetch = async (...args) => {
                const method = (typeof args[0] === 'object' && args[0] instanceof Request
                    ? args[0].method
                    : (args[1]?.method || 'GET')).toUpperCase();
                const isFormSubmit = method !== 'GET';

                try {
                    const res = await originalFetch(...args);
                    if (res.status >= 500 && res.status <= 504) {
                        if (isFormSubmit) {
                            let errorMessage = 'An error occurred';
                            switch (res.status) {
                                case 500: errorMessage = 'Internal Server Error'; break;
                                case 501: errorMessage = 'Not Implemented'; break;
                                case 502: errorMessage = 'Bad Gateway'; break;
                                case 503: errorMessage = 'Service Unavailable'; break;
                                case 504: errorMessage = 'Gateway Timeout'; break;
                                default: errorMessage = `Server Error (${res.status})`;
                            }
                            showSnackbar(errorMessage, 'error');
                        } else {
                            if (window.location.pathname !== '/maintenance') {
                                window.location.href = '/maintenance';
                            }
                        }
                    }
                    return res;
                } catch (err) {
                    if (isFormSubmit) {
                        showSnackbar('Network connection failed. Please check your internet.', 'error');
                    } else {
                        if (window.location.pathname !== '/maintenance') {
                            window.location.href = '/maintenance';
                        }
                    }
                    throw err;
                }
            };
            return () => {
                window.fetch = originalFetch;
            };
        }
    }, [showSnackbar]);

    return (
        <main className={(isAdmin || isMaintenanceOrOffline) ? "min-h-screen" : "min-h-screen pt-[56px] md:pt-[72px]"}>
            {children}
        </main>
    );
}
