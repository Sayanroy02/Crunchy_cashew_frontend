'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OfflineHandler() {
    const [isOffline, setIsOffline] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsOffline(!navigator.onLine);

            const handleOnline = () => {
                setIsOffline(false);
                setDismissed(false);
            };

            const handleOffline = () => {
                setIsOffline(true);
                setDismissed(false);
            };

            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);

            return () => {
                window.removeEventListener('online', handleOnline);
                window.removeEventListener('offline', handleOffline);
            };
        }
    }, []);

    if (!isOffline || dismissed) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-red-100 p-5 animate-slide-in-up">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-wifi-slash text-red-500 text-lg"></i>
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm">No Internet Connection</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Please check your network settings. You can continue viewing offline info.
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <button 
                            onClick={() => router.push('/offline')}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
                        >
                            Go Offline Page
                        </button>
                        <button 
                            onClick={() => setDismissed(true)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
