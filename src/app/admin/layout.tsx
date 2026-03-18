'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { API } from '@/constants/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [status, setStatus] = useState<'checking' | 'allowed' | 'denied'>('checking');

    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        // Skip auth check entirely for the login page (no redirect loop)
        if (isLoginPage) return;

        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/admin/login');
            return;
        }

        fetch(API.AUTH_ME, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error('Unauthorized');
                return res.json();
            })
            .then(data => {
                if (data.role === 'admin') {
                    setStatus('allowed');
                } else {
                    setStatus('denied');
                    router.push('/');
                }
            })
            .catch(() => {
                setStatus('denied');
                router.push('/admin/login');
            });
    }, [isLoginPage, router]);

    // Render login page directly with no wrapper
    if (isLoginPage) {
        return <>{children}</>;
    }

    if (status === 'checking') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-primary font-semibold text-lg">Verifying Admin Access...</p>
            </div>
        );
    }

    if (status === 'denied') return null;

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: 'fa-solid fa-chart-line' },
        { name: 'Products', path: '/admin/products', icon: 'fa-solid fa-box' },
        { name: 'Orders', path: '/admin/orders', icon: 'fa-solid fa-truck' },
        { name: 'Users', path: '/admin/users', icon: 'fa-solid fa-users' },
        { name: 'Reviews', path: '/admin/reviews', icon: 'fa-solid fa-star' },
        { name: 'Banners', path: '/admin/banners', icon: 'fa-solid fa-images' },
        { name: 'Blogs', path: '/admin/blogs', icon: 'fa-solid fa-blog' },
        { name: 'Customer Blogs', path: '/admin/customer-blogs', icon: 'fa-solid fa-users-viewfinder' },
        { name: 'Queries', path: '/admin/queries', icon: 'fa-solid fa-envelope' },
        { name: 'Bulk Orders', path: '/admin/bulk-orders', icon: 'fa-solid fa-boxes-stacked' },
        { name: 'Pincodes', path: '/admin/pincodes', icon: 'fa-solid fa-location-dot' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/admin/login');
    };

    return (
        <div className="flex bg-[#f8f9fa] min-h-screen font-body text-gray-800">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:flex md:flex-col`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center p-5 border-b border-gray-100">
                        <img src="/images/cc-Logo-01-1.png" alt="Admin" className="h-12" />
                        <button className="md:hidden absolute right-4 text-gray-400" onClick={() => setIsMenuOpen(false)}>
                            <i className="fa-solid fa-xmark text-xl"></i>
                        </button>
                    </div>

                    <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const active = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
                            return (
                                <Link key={item.path} href={item.path} onClick={() => setIsMenuOpen(false)}>
                                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${active ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-primary'}`}>
                                        <i className={`${item.icon} w-5 text-center`}></i>
                                        {item.name}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-3 border-t border-gray-100 space-y-1">
                        <Link href="/">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                                <i className="fa-solid fa-store w-5 text-center"></i>
                                View Store
                            </div>
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm font-semibold">
                            <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </aside>


            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
                    <img src="/images/cc-Logo-01-1.png" alt="Admin" className="h-8" />
                    <button onClick={() => setIsMenuOpen(true)} className="text-gray-600">
                        <i className="fa-solid fa-bars text-xl"></i>
                    </button>
                </header>
                <main className="flex-1 p-5 md:p-8 overflow-y-auto">{children}</main>
            </div>

            {isMenuOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsMenuOpen(false)} />
            )}
        </div>
    );
}
