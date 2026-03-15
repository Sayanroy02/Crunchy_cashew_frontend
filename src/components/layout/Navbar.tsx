'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { logout } from '@/lib/store/features/authSlice';
import { usePathname } from 'next/navigation';
import PincodeSelector from '@/components/PincodeSelector';
import { COLORS } from '@/constants/styles';

const ANNOUNCEMENTS = [
    '🚚 Free Shipping on orders above ₹999',
    '🎉 10% OFF your first order · Code: CRUNCHY10',
    '⚡ Extra 5% OFF on orders above ₹1,599',
    '🌟 Delivered in 5–7 Business Days Pan India',
];

const LEFT_LINKS = [
    { label: 'Shop', href: '/shop' },
    { label: 'Bulk', href: '/bulk' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blogs' },
];

export default function Navbar() {
    const [annoIdx, setAnnoIdx] = useState(0);
    const [annoFade, setAnnoFade] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    const dispatch = useDispatch();
    const pathname = usePathname();
    const cartQty = useSelector((state: RootState) => state.cart.totalQuantity);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    /* Announcement rotator */
    useEffect(() => {
        const t = setInterval(() => {
            setAnnoFade(false);
            setTimeout(() => {
                setAnnoIdx(i => (i + 1) % ANNOUNCEMENTS.length);
                setAnnoFade(true);
            }, 350);
        }, 3500);
        return () => clearInterval(t);
    }, []);

    /* Close mobile menu on navigation */
    useEffect(() => setMobileOpen(false), [pathname]);

    if (pathname.startsWith('/admin')) return null;

    const isActive = (href: string) =>
        href === '/shop' ? pathname === href : pathname.startsWith(href);

    return (
        <>
            {/* ─── Announcement Bar ─── */}
            <div className="bg-primary text-white text-xs py-2 text-center overflow-hidden select-none">
                <span
                    style={{ opacity: annoFade ? 1 : 0, transform: annoFade ? 'translateY(0)' : 'translateY(-6px)', transition: 'opacity 0.3s, transform 0.3s' }}
                    className="inline-block font-medium tracking-wide"
                >
                    {ANNOUNCEMENTS[annoIdx]}
                    <Link href="/shop" className="ml-3 text-amber font-bold underline underline-offset-2">Shop →</Link>
                </span>
            </div>

            {/* ─── Main Navbar ─── */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
                {/* Desktop — perfect 3-col equal layout */}
                <div className="hidden md:flex items-stretch max-w-screen-xl mx-auto" style={{ minHeight: '72px' }}>

                    {/* LEFT — 4 nav text links, equal flex basis */}
                    <nav className="flex flex-1 items-center gap-1 px-6">
                        {LEFT_LINKS.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-4 py-2 text-sm font-semibold tracking-wide rounded-lg transition-colors
                                    ${isActive(link.href)
                                        ? 'text-primary'
                                        : 'text-gray-600 hover:text-primary hover:bg-green-50'
                                    }`}
                            >
                                {link.label}
                                {isActive(link.href) && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber rounded-full" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* CENTER — Flat logo */}
                    <div className="flex-shrink-0 flex justify-center items-center px-4">
                        <Link href="/" className="group block">
                            <img
                                src="/images/cc-Logo-01-1.png"
                                alt="Crunchy Cashews"
                                className="h-14 lg:h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                        </Link>
                    </div>


                    {/* RIGHT — 4 icon actions, equal flex basis, right-aligned */}
                    <div className="flex flex-1 items-center justify-end gap-1 px-6">
                        {/* Pincode */}
                        <div className="flex flex-col items-center">
                            <PincodeSelector />
                        </div>

                        {/* Profile */}
                        <Link
                            href={isAuthenticated ? '/profile' : '/login'}
                            className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                            <i className={`text-lg ${isAuthenticated ? 'fa-solid fa-user text-primary' : 'fa-regular fa-user text-gray-500 group-hover:text-primary'}`} />
                            <span className="text-[10px] font-semibold text-gray-500 group-hover:text-primary uppercase tracking-wide">
                                {isAuthenticated ? 'Profile' : 'Login'}
                            </span>
                        </Link>

                        {/* Wishlist */}
                        <Link href="/profile?tab=wishlist" className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group">
                            <i className="fa-regular fa-heart text-lg text-gray-500 group-hover:text-primary" />
                            <span className="text-[10px] font-semibold text-gray-500 group-hover:text-primary uppercase tracking-wide">Wishlist</span>
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg group">
                            <div className="relative bg-amber group-hover:bg-yellow text-[#2c1a0e] w-10 h-10 flex items-center justify-center rounded-xl shadow-sm group-hover:shadow-md transition-all">
                                <i className="fa-solid fa-cart-shopping text-base" />
                                {cartQty > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-black w-[18px] h-[18px] flex items-center justify-center rounded-full shadow">
                                        {cartQty > 9 ? '9+' : cartQty}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-semibold text-gray-500 group-hover:text-primary uppercase tracking-wide">Cart</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile header */}
                <div className="md:hidden flex items-center justify-between px-4 py-3">
                    <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                        <i className="fa-solid fa-bars text-xl text-gray-700" />
                    </button>
                    <Link href="/">
                        <img src="/images/cc-Logo-01-1.png" alt="Crunchy Cashews" className="h-10 object-contain" />
                    </Link>
                    <Link href="/cart" className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-amber hover:bg-yellow transition-colors">
                        <i className="fa-solid fa-cart-shopping text-[#2c1a0e] text-lg" />
                        {cartQty > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">{cartQty}</span>
                        )}
                    </Link>
                </div>
            </header>

            {/* ─── Mobile Slide-out Menu ─── */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[9999] flex">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

                    {/* Menu panel */}
                    <nav className="relative ml-auto w-[80vw] max-w-[320px] h-full bg-white flex flex-col shadow-2xl overflow-hidden animate-slide-in-right">
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <img src="/images/cc-Logo-01-1.png" alt="Logo" className="h-10" />
                            <button onClick={() => setMobileOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100">
                                <i className="fa-solid fa-xmark text-xl text-gray-500" />
                            </button>
                        </div>

                        {/* Links */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-1">
                            {[
                                { href: '/', label: 'Home', icon: 'fa-house' },
                                ...LEFT_LINKS.map(l => ({ href: l.href, label: l.label, icon: l.label === 'Shop' ? 'fa-store' : l.label === 'Bulk' ? 'fa-boxes-stacked' : l.label === 'About' ? 'fa-building' : 'fa-newspaper' })),
                                { href: '/contact', label: 'Contact', icon: 'fa-envelope' },
                            ].map(item => (
                                <Link key={item.href} href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-colors
                                        ${isActive(item.href) && item.href !== '/'
                                            ? 'bg-green-50 text-primary'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-primary'}`
                                    }
                                >
                                    <i className={`fa-solid ${item.icon} w-4 text-primary text-sm`} />
                                    {item.label}
                                </Link>
                            ))}

                            <div className="border-t border-gray-100 mt-4 pt-4 space-y-1">
                                {isAuthenticated ? (
                                    <>
                                        <Link href="/profile" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold text-sm">
                                            <i className="fa-solid fa-user w-4 text-primary text-sm" /> My Profile
                                        </Link>
                                        <button onClick={() => dispatch(logout())}
                                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 font-semibold text-sm">
                                            <i className="fa-solid fa-arrow-right-from-bracket w-4 text-sm" /> Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-primary text-white font-bold text-sm">
                                            <i className="fa-solid fa-right-to-bracket" /> Sign In
                                        </Link>
                                        <Link href="/register" className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-primary text-primary font-bold text-sm">
                                            <i className="fa-solid fa-user-plus" /> Create Account
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
}
