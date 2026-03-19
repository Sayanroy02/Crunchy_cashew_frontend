'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { logout } from '@/lib/store/features/authSlice';
import { usePathname } from 'next/navigation';
import PincodeSelector from '@/components/PincodeSelector';

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
    { label: 'Contact', href: '/contact' },
];

// Pages where the navbar starts transparent (has a full-bleed hero behind it)
const TRANSPARENT_PAGES = ['/'];

export default function Navbar() {
    const [annoIdx, setAnnoIdx] = useState(0);
    const [annoFade, setAnnoFade] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const dispatch = useDispatch();
    const pathname = usePathname();
    const cartQty = useSelector((state: RootState) => state.cart.totalQuantity);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    // Determines if this page has a transparent-start hero
    const isHeroPage = TRANSPARENT_PAGES.includes(pathname);

    /* ── Scroll listener ── */
    useEffect(() => {
        if (!isHeroPage) return;
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // run once on mount
        return () => window.removeEventListener('scroll', onScroll);
    }, [isHeroPage]);

    /* ── Announcement rotator ── */
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

    /* ── Close mobile menu on navigation ── */
    useEffect(() => setMobileOpen(false), [pathname]);

    if (pathname.startsWith('/admin')) return null;

    const isActive = (href: string) =>
        href === '/shop' ? pathname === href : pathname.startsWith(href);

    // Visual state derivation
    const isTransparent = isHeroPage && !scrolled;

    return (
        <>
            {/* ─── Announcement Bar ─── */}
            {/* Hide when transparent so it doesn't float over the hero */}
            <div
                className="bg-primary text-white text-xs py-2 text-center overflow-hidden select-none transition-all duration-300"
                style={{
                    opacity: isTransparent ? 0 : 1,
                    maxHeight: isTransparent ? '0px' : '40px',
                    padding: isTransparent ? '0' : undefined,
                    pointerEvents: isTransparent ? 'none' : 'auto',
                }}
            >
                <span
                    style={{
                        opacity: annoFade ? 1 : 0,
                        transform: annoFade ? 'translateY(0)' : 'translateY(-6px)',
                        transition: 'opacity 0.3s, transform 0.3s',
                    }}
                    className="inline-block font-medium tracking-wide"
                >
                    {ANNOUNCEMENTS[annoIdx]}
                    <Link href="/shop" className="ml-3 text-amber font-bold underline underline-offset-2">Shop →</Link>
                </span>
            </div>

            {/* ─── Main Navbar ─── */}
            <header
                className={`
                    ${isHeroPage ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50
                    transition-all duration-400 ease-out
                    ${isTransparent
                        ? 'bg-transparent border-transparent'
                        : 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'
                    }
                `}
            >
                {/* Desktop */}
                <div className="hidden md:flex items-stretch max-w-screen-xl mx-auto" style={{ minHeight: '72px' }}>

                    {/* LEFT — nav links */}
                    <nav className="flex flex-1 items-center gap-1 px-6">
                        {LEFT_LINKS.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-4 py-2 text-sm font-semibold tracking-wide rounded-lg transition-colors
                                    ${isActive(link.href)
                                        ? isTransparent ? 'text-amber' : 'text-primary'
                                        : isTransparent
                                            ? 'text-white/80 hover:text-white hover:bg-white/10'
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

                    {/* CENTER — Logo */}
                    <div className="flex-shrink-0 flex justify-center items-center px-4">
                        <Link href="/" className="group block">
                            <img
                                src="/images/cc-Logo-01-1.png"
                                alt="Crunchy Cashews"
                                className="h-14 lg:h-16 w-auto object-contain group-hover:scale-105 transition-all duration-300"
                                style={{ filter: isTransparent ? 'drop-shadow(0 0 8px rgba(0,0,0,0.6)) drop-shadow(0 2px 4px rgba(0,0,0,0.4))' : 'none' }}
                            />
                        </Link>
                    </div>

                    {/* RIGHT — icon actions */}
                    <div className="flex flex-1 items-center justify-end gap-1 px-6">
                        {/* Pincode */}
                        <div className="flex flex-col items-center">
                            <PincodeSelector />
                        </div>

                        {/* Profile */}
                        <Link
                            href={isAuthenticated ? '/profile' : '/login'}
                            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors group
                                ${isTransparent ? 'hover:bg-white/10' : 'hover:bg-gray-50'}`}
                        >
                            <i className={`text-lg ${isAuthenticated
                                ? isTransparent ? 'fa-solid fa-user text-white' : 'fa-solid fa-user text-primary'
                                : isTransparent ? 'fa-regular fa-user text-white/80 group-hover:text-white' : 'fa-regular fa-user text-gray-500 group-hover:text-primary'
                                }`} />
                            <span className={`text-[10px] font-semibold uppercase tracking-wide ${isTransparent ? 'text-white/70 group-hover:text-white' : 'text-gray-500 group-hover:text-primary'}`}>
                                {isAuthenticated ? 'Profile' : 'Login'}
                            </span>
                        </Link>

                        {/* Wishlist */}
                        <Link
                            href="/profile?tab=wishlist"
                            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors group
                                ${isTransparent ? 'hover:bg-white/10' : 'hover:bg-gray-50'}`}
                        >
                            <i className={`fa-regular fa-heart text-lg ${isTransparent ? 'text-white/80 group-hover:text-white' : 'text-gray-500 group-hover:text-primary'}`} />
                            <span className={`text-[10px] font-semibold uppercase tracking-wide ${isTransparent ? 'text-white/70 group-hover:text-white' : 'text-gray-500 group-hover:text-primary'}`}>
                                Wishlist
                            </span>
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
                            <span className={`text-[10px] font-semibold uppercase tracking-wide ${isTransparent ? 'text-white/70 group-hover:text-white' : 'text-gray-500 group-hover:text-primary'}`}>
                                Cart
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Mobile header */}
                <div className="md:hidden flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors
                            ${isTransparent ? 'hover:bg-white/15' : 'hover:bg-gray-100'}`}
                    >
                        <i className={`fa-solid fa-bars text-xl ${isTransparent ? 'text-white' : 'text-gray-700'}`} />
                    </button>

                    <Link href="/">
                        <img
                            src="/images/cc-Logo-01-1.png"
                            alt="Crunchy Cashews"
                            className="h-10 object-contain transition-all duration-300"
                            style={{ filter: isTransparent ? 'drop-shadow(0 0 6px rgba(0,0,0,0.6))' : 'none' }}
                        />
                    </Link>

                    <Link href="/cart" className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-amber hover:bg-yellow transition-colors">
                        <i className="fa-solid fa-cart-shopping text-[#2c1a0e] text-lg" />
                        {cartQty > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                                {cartQty}
                            </span>
                        )}
                    </Link>
                </div>
            </header>

            {/* ─── Mobile Slide-out Menu ─── */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[9999] flex">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />

                    {/* Menu panel */}
                    <nav className="relative mr-auto w-[80vw] max-w-[320px] h-full bg-white flex flex-col shadow-2xl overflow-hidden animate-slide-in-left">
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <img src="/images/cc-Logo-01-1.png" alt="Logo" className="h-10" />
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100"
                            >
                                <i className="fa-solid fa-xmark text-xl text-gray-500" />
                            </button>
                        </div>

                        {/* Links */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-1">
                            {[
                                { href: '/', label: 'Home', icon: 'fa-house' },
                                { href: '/shop', label: 'Shop', icon: 'fa-store' },
                                { href: '/bulk', label: 'Bulk', icon: 'fa-boxes-stacked' },
                                { href: '/about', label: 'About', icon: 'fa-building' },
                                { href: '/blogs', label: 'Blog', icon: 'fa-newspaper' },
                                { href: '/contact', label: 'Contact', icon: 'fa-envelope' },
                            ].map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-colors
                                        ${isActive(item.href) && item.href !== '/'
                                            ? 'bg-green-50 text-primary'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                                        }`}
                                >
                                    <i className={`fa-solid ${item.icon} w-4 text-primary text-sm`} />
                                    {item.label}
                                </Link>
                            ))}

                            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold text-sm"
                                        >
                                            <i className="fa-solid fa-user w-4 text-primary text-sm" /> My Profile
                                        </Link>
                                        <button
                                            onClick={() => dispatch(logout())}
                                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 font-semibold text-sm"
                                        >
                                            <i className="fa-solid fa-arrow-right-from-bracket w-4 text-sm" /> Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-primary text-white font-bold text-sm"
                                        >
                                            <i className="fa-solid fa-right-to-bracket" /> Sign In
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-primary text-primary font-bold text-sm"
                                        >
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