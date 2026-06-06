'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { logout } from '@/lib/store/features/authSlice';
import { usePathname } from 'next/navigation';
import { COLORS } from '@/constants/styles';


const ANNOUNCEMENTS = [
    '🚚 Free Shipping on orders above ₹599',
    '🌟 Delivered in 5–7 Business Days Pan India',
];

const LEFT_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/our-product' },
    { label: 'B2B', href: '/bulk' },
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blogs' },
    { label: 'Contact', href: '/contact-us' },
];

export default function Navbar() {
    const [annoIdx, setAnnoIdx] = useState(0);
    const [annoFade, setAnnoFade] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    // true once user has scrolled past 100vh (1 screen height)
    const [scrolledPast, setScrolledPast] = useState(false);

    const dispatch = useDispatch();
    const pathname = usePathname();
    const cartQty = useSelector((state: RootState) => state.cart.totalQuantity);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    /* ── Only the home page gets the transparent / reveal behaviour ── */
    const isHomePage = pathname === '/';

    /* ── Mount guard for portal ── */
    useEffect(() => setMounted(true), []);

    /* ── Scroll listener: reveal announcement + solidify mobile after 100vh ── */
    useEffect(() => {
        if (!isHomePage) {
            setScrolledPast(true); // always show on non-home pages
            return;
        }
        setScrolledPast(false); // reset when navigating back to home
        const onScroll = () => {
            setScrolledPast(window.scrollY > window.innerHeight * 0.85);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, [isHomePage, pathname]);

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

    if (pathname.startsWith('/admin') || pathname === '/cc/qr-offer' || pathname === '/maintenance') return null;

    const isActive = (href: string) =>
        href === '/' || href === '/our-product' ? pathname === href : pathname.startsWith(href);

    /*
     * showAnnouncement:
     *   - homepage: shows after user scrolls past ~85% of viewport height
     *   - all other pages: always visible
     */
    const showAnnouncement = scrolledPast;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] flex flex-col bg-white/95 backdrop-blur-md shadow-sm transition-all duration-500 ease-out">

            {/* ─── Announcement Bar ─── */}
            <div
                className="text-white text-xs py-2 text-center overflow-hidden select-none"
                style={{
                    backgroundColor: COLORS.heading,
                    opacity: showAnnouncement ? 1 : 0,
                    maxHeight: showAnnouncement ? '40px' : '0px',
                    padding: showAnnouncement ? undefined : '0',
                    pointerEvents: showAnnouncement ? 'auto' : 'none',
                    transition: 'opacity 0.5s ease, max-height 0.5s ease, padding 0.5s ease',
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
                    <Link href="/our-product" className="ml-3 text-amber font-bold underline underline-offset-2">Shop →</Link>
                </span>
            </div>

            {/* ─── Main Navbar ─── */}
            <header className="relative w-full">

                {/* Desktop */}
                <div className="hidden md:flex items-stretch max-w-screen-xl mx-auto" style={{ minHeight: '72px', color: '#1a1a1a' }}>

                    {/* LEFT — nav links */}
                    <nav className="flex flex-1 items-center gap-1 px-6">
                        {LEFT_LINKS.map(link => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative px-4 py-2 text-sm font-semibold tracking-wide rounded-lg transition-colors hover:bg-gray-50"
                                    style={{
                                        color: active ? COLORS.heading : '#4b5563',
                                    }}
                                >
                                    {link.label}
                                    {active && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* CENTER — Logo */}
                    <div className="flex-shrink-0 flex justify-center items-center px-4">
                        <Link href="/" className="group block">
                            <img
                                src="/images/cc-Logo-01-1.png"
                                alt="Crunchy Cashews"
                                className="h-14 lg:h-16 w-auto object-contain group-hover:scale-105 transition-all duration-300"
                                style={{ filter: 'none' }}
                            />
                        </Link>
                    </div>

                    {/* RIGHT — icon actions */}
                    <div className="flex flex-1 items-center justify-end gap-1 px-6">

                        {/* Profile */}
                        <Link
                            href={isAuthenticated ? '/profile' : '/login'}
                            className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors group hover:bg-gray-50"
                        >
                            <i
                                className={`text-lg ${isAuthenticated ? 'fa-solid fa-user' : 'fa-regular fa-user'}`}
                                style={{ color: COLORS.heading }}
                            />
                            <span
                                className="text-[10px] font-semibold uppercase tracking-wide"
                                style={{ color: COLORS.heading }}
                            >
                                {isAuthenticated ? 'Profile' : 'Login'}
                            </span>
                        </Link>

                        {/* Wishlist */}
                        <Link
                            href="/profile?tab=wishlist"
                            className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors group hover:bg-gray-50"
                        >
                            <i className="fa-regular fa-heart text-lg" style={{ color: COLORS.heading }} />
                            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: COLORS.heading }}>
                                Wishlist
                            </span>
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors group hover:bg-gray-50">
                            <i className="fa-solid fa-cart-shopping text-lg" style={{ color: COLORS.heading }} />
                            {cartQty > 0 && (
                                <span className="absolute top-1 right-2 bg-[#F6B000] text-white text-[9px] font-black w-[16px] h-[16px] flex items-center justify-center rounded-full shadow">
                                    {cartQty > 9 ? '9+' : cartQty}
                                </span>
                            )}
                            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: COLORS.heading }}>Cart</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile header — always white, black icons */}
                <div className="md:hidden flex items-center justify-between px-4 py-1.5">
                    {/* Hamburger */}
                    <button
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <i className="fa-solid fa-bars text-xl text-gray-800" />
                    </button>

                    {/* Logo */}
                    <Link href="/">
                        <img
                            src="/images/cc-Logo-01-1.png"
                            alt="Crunchy Cashews"
                            className="h-[50px] object-contain"
                        />
                    </Link>

                    {/* Cart */}
                    <Link href="/cart" className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                        <i className="fa-solid fa-cart-shopping text-xl text-gray-800" />
                        {cartQty > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 bg-[#F6B000] text-white text-[9px] font-black w-[16px] h-[16px] flex items-center justify-center rounded-full shadow">
                                {cartQty > 9 ? '9+' : cartQty}
                            </span>
                        )}
                    </Link>
                </div>
            </header>

            {/* ─── Mobile Slide-out Menu (Portal) ─── */}
            {mounted && mobileOpen && createPortal(
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
                                { href: '/our-product', label: 'Shop', icon: 'fa-store' },
                                { href: '/bulk', label: 'B2B', icon: 'fa-boxes-stacked' },
                                { href: '/about', label: 'About Us', icon: 'fa-building' },
                                { href: '/blogs', label: 'Blog', icon: 'fa-newspaper' },
                                { href: '/contact-us', label: 'Contact', icon: 'fa-envelope' },
                            ].map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-colors
                                        ${isActive(item.href)
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                                        }`}
                                >
                                    <i className={`fa-solid ${item.icon} w-4 text-sm`} style={{ color: COLORS.heading }} />
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
                                            <i className="fa-solid fa-user w-4 text-sm" style={{ color: COLORS.heading }} /> My Profile
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
                                            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-white font-bold text-sm"
                                            style={{ backgroundColor: COLORS.heading }}
                                        >
                                            <i className="fa-solid fa-right-to-bracket" /> Sign In
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 font-bold text-sm"
                                            style={{ borderColor: COLORS.heading, color: COLORS.heading }}
                                        >
                                            <i className="fa-solid fa-user-plus" /> Create Account
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </nav>
                </div>,
                document.body
            )}
        </div>
    );
}