'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SectionHeading from '@/components/ui/SectionHeading';
import { COLORS } from '@/constants/styles';

export default function OfflinePage() {
    const router = useRouter();
    const [checking, setChecking] = useState(false);
    const [onlineStatus, setOnlineStatus] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOnlineStatus(navigator.onLine);
        }
    }, []);

    const handleRetry = () => {
        setChecking(true);
        setTimeout(() => {
            if (navigator.onLine) {
                // If online, go back or to home
                router.push('/');
            } else {
                setOnlineStatus(false);
                setChecking(false);
            }
        }, 1000);
    };

    return (
        <div 
            className="min-h-screen w-full flex flex-col items-center justify-center relative px-6 py-12 text-center"
            style={{
                background: 'linear-gradient(135deg, #FFF9E7 0%, #FFFE71 100%)',
                fontFamily: 'var(--font-montserrat), system-ui, -apple-system, sans-serif'
            }}
        >
            {/* Soft Ambient Blobs */}
            <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#00863D]/5 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-[#F6B000]/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-md w-full flex flex-col items-center">
                {/* Brand Logo */}
                <div className="mb-8 select-none">
                    <img 
                        src="/images/cc-Logo-01-1.png" 
                        alt="Crunchy Cashews Logo" 
                        className="w-20 h-20 object-contain drop-shadow-sm"
                    />
                </div>

                {/* Offline Illustration Icon */}
                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-lg border border-gray-100 mb-8 relative">
                    <i className="fa-solid fa-wifi text-gray-300 text-5xl"></i>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-1 bg-red-500 rounded-full rotate-45 transform scale-x-125 shadow-sm"></div>
                    </div>
                </div>

                {/* Section Heading Design */}
                <SectionHeading 
                    text="Connection" 
                    highlight="Lost" 
                    className="mb-4"
                />

                <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed mb-10 px-4">
                    It looks like you're offline. Please check your internet connection and try again.
                </p>

                {/* Retry Button */}
                <button 
                    onClick={handleRetry}
                    disabled={checking}
                    className="w-full max-w-[240px] bg-[#00863D] text-white font-bold rounded-2xl py-4 shadow-lg shadow-[#00863D]/20 hover:scale-102 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                    {checking ? (
                        <>
                            <i className="fa-solid fa-spinner animate-spin"></i>
                            Checking...
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-rotate-right"></i>
                            Retry Connection
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
