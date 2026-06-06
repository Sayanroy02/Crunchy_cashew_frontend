'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';

import { useState, useEffect } from 'react';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [isVisible, setIsVisible] = useState(pathname !== '/');

    useEffect(() => {
        if (pathname !== '/') {
            setIsVisible(true);
            return;
        }

        const handleScroll = () => {
            setIsVisible(window.scrollY > 500);
        };

        // Check initial scroll on load
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    // Hide on admin routes or specific pages
    if (pathname.startsWith('/admin') || pathname === '/cc/qr-offer' || pathname === '/maintenance' || pathname === '/offline') return null;

    const navItems = [
        { label: 'Shop', href: '/shop', icon: 'fa-store' },
        { label: 'B2B', href: '/bulk', icon: 'fa-boxes-stacked' },
        { label: 'Home', href: '/', icon: 'fa-house', isMiddle: true },
        { label: 'Blogs', href: '/blogs', icon: 'fa-newspaper' },
        { label: isAuthenticated ? 'Profile' : 'Sign Up', href: isAuthenticated ? '/profile' : '/register', icon: isAuthenticated ? 'fa-user' : 'fa-user-plus' },
    ];

    return (
        <div
            className={`md:hidden fixed bottom-4 left-4 right-4 z-[90] transition-all duration-500 ease-out transform
                ${isVisible
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-10 pointer-events-none'
                }`}
        >
            <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-3xl flex items-center justify-evenly px-2 py-1.5 relative">
                {navItems.map((item) => {
                    const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                    if (item.isMiddle) {
                        return (
                            <div key={item.label} className="flex-1 flex justify-center">
                                <Link href={item.href} className="relative -top-6 flex flex-col items-center justify-center">
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-[4px] border-[#FFF9E7] transition-transform active:scale-95 bg-[#00863D] text-white shadow-[#00863D]/40">
                                        <i className={`fa-solid ${item.icon} text-xl`} />
                                    </div>
                                </Link>
                            </div>
                        );
                    }

                    return (
                        <Link key={item.label} href={item.href} className={`flex-1 flex flex-col items-center justify-center py-2 rounded-2xl transition-all ${isActive ? 'text-[#00863D]' : 'text-gray-700 hover:text-[#00863D] active:text-[#00863D]'}`}>
                            <i className={`fa-solid ${item.icon} text-[18px]`} />
                            <span className="text-[9px] font-bold tracking-wide uppercase mt-1 truncate w-full text-center px-1">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
