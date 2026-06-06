'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { API } from '@/constants/api';

// ─── Types ────────────────────────────────────────────────────────
interface Banner {
    _id: string;
    title: string;
    image_url: string;
    link?: string;
}

// ─── Fallback banners (same as original) ─────────────────────────
const DEFAULTS: Banner[] = [
    { _id: 'd1', title: 'Premium Quality Tea', image_url: '', link: '/our-product' },
    { _id: 'd2', title: 'Factory Direct Prices', image_url: '', link: '/our-product' },
    { _id: 'd3', title: '🚚 Free Shipping on Orders Above ₹999', image_url: '', link: '/our-product' },
    { _id: 'd4', title: 'Best Deals Today', image_url: '', link: '/our-product' },
];

// ─── Card fallback configs ────────────────────────────────────────
const CARD_CONFIG = [
    {
        badge: 'Min. 30% Off',
        label: 'PREMIUM',
        bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        accentColor: '#4ade80',
        logoColor: '#00d084',
        subtitle: 'Straight from Siliguri',
    },
    {
        badge: 'Up to 50% Off',
        label: 'DIRECT',
        bg: 'linear-gradient(135deg, #2d1a0e 0%, #3d2010 60%, #6b3a1f 100%)',
        accentColor: '#fb923c',
        logoColor: '#f97316',
        subtitle: 'Factory Direct Prices',
    },
    {
        badge: 'Free Shipping',
        label: 'OFFER',
        bg: 'linear-gradient(135deg, #0d1117 0%, #161b22 60%, #1c2432 100%)',
        accentColor: '#38bdf8',
        logoColor: '#0ea5e9',
        subtitle: 'Orders Above ₹999',
    },
    {
        badge: 'Best Price',
        label: 'DEALS',
        bg: 'linear-gradient(135deg, #1a0a2e 0%, #2d1454 60%, #3d1a6b 100%)',
        accentColor: '#e879f9',
        logoColor: '#a855f7',
        subtitle: "Today's Top Picks",
    },
];

// ─── Single card ──────────────────────────────────────────────────
function BannerCard({ banner, idx }: { banner: Banner; idx: number }) {
    const cfg = CARD_CONFIG[idx % CARD_CONFIG.length];

    return (
        <a
            href={banner.link || '/our-product'}
            draggable={false}
            className="relative w-full h-full overflow-hidden rounded-xl block group select-none"
        >
            {banner.image_url ? (
                <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    draggable={false}
                />
            ) : (
                <div
                    className="w-full h-full flex flex-col justify-between p-3 md:p-4 relative overflow-hidden"
                    style={{ background: cfg.bg }}
                >
                    {/* Glow */}
                    <div
                        className="absolute top-0 right-0 pointer-events-none"
                        style={{
                            width: '50%',
                            height: '100%',
                            background: `radial-gradient(ellipse at 80% 20%, ${cfg.accentColor}1a 0%, transparent 70%)`,
                        }}
                    />
                    {/* Top: brand + AD */}
                    <div className="relative z-10 flex items-center justify-between">
                        <div
                            className="px-2 py-0.5 rounded-md text-[9px] md:text-[10px] font-black tracking-widest uppercase"
                            style={{ background: cfg.logoColor, color: '#fff' }}
                        >
                            {cfg.label}
                        </div>
                        <span
                            className="text-[8px] font-semibold px-1.5 py-0.5 rounded"
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.45)',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                        >
                            AD
                        </span>
                    </div>
                    {/* Bottom: subtitle + title + badge */}
                    <div className="relative z-10">
                        <p className="text-[9px] mb-0.5 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            {cfg.subtitle}
                        </p>
                        <h3
                            className="text-sm md:text-base font-bold leading-snug mb-2"
                            style={{
                                color: '#fff',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            {banner.title}
                        </h3>
                        <span
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] md:text-[10px] font-bold"
                            style={{ background: cfg.accentColor, color: '#000' }}
                        >
                            {cfg.badge}
                        </span>
                    </div>
                </div>
            )}
        </a>
    );
}

// ─── Main component ───────────────────────────────────────────────
export default function OfferStripCarousel() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loaded, setLoaded] = useState(false);

    // ── Original fetch logic ──
    useEffect(() => {
        fetch(API.BANNERS)
            .then(r => r.json())
            .then(data => setBanners(data?.length > 0 ? data : DEFAULTS))
            .catch(() => setBanners(DEFAULTS))
            .finally(() => setTimeout(() => setLoaded(true), 80));
    }, []);

    // ── Desktop: page through pairs (0-1, 2-3, 4-5 …) ──
    const [page, setPage] = useState(0);
    const [animDir, setAnimDir] = useState<'left' | 'right'>('right');
    const [animating, setAnimating] = useState(false);

    // How many pages of 2
    const totalPages = Math.ceil(banners.length / 2);

    const goPage = useCallback((dir: 'left' | 'right') => {
        if (animating) return;
        setAnimating(true);
        setAnimDir(dir);
        setPage(p => dir === 'right'
            ? (p + 1) % totalPages
            : (p - 1 + totalPages) % totalPages
        );
        setTimeout(() => setAnimating(false), 350);
    }, [animating, totalPages]);

    // ── Mobile: raw horizontal scroll ──
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 8);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener('scroll', updateScroll, { passive: true });
        const t = setTimeout(updateScroll, 120);
        return () => { el.removeEventListener('scroll', updateScroll); clearTimeout(t); };
    }, [banners, updateScroll]);

    const mobileScroll = (dir: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        const card = el.querySelector<HTMLElement>('.m-banner-card');
        const amount = card ? card.offsetWidth + 12 : 260;
        el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
    };

    // ── Skeleton ──
    if (banners.length === 0) {
        return (
            <div className="w-full px-4 md:px-5">
                <div className="flex gap-3">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex-1 rounded-xl bg-gray-100 animate-pulse" style={{ height: '170px' }} />
                    ))}
                </div>
            </div>
        );
    }

    // Current pair for desktop
    const pairStart = page * 2;
    const pair = [banners[pairStart], banners[pairStart + 1]].filter(Boolean);

    return (
        <section
            className="w-full py-2"
            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
        >
            <div className="px-4 md:px-5">

                {/* ════════════════════════════════════════════
                    DESKTOP  ≥ 768px
                    Outer rounded rectangle → 2 equal inner cards
                    Page through pairs with arrow buttons
                ════════════════════════════════════════════ */}
                <div
                    className="hidden md:flex items-center gap-3 relative"
                    style={{
                        background: '#f1f3f6',          // Flipkart-style light grey outer bg
                        borderRadius: '16px',
                        padding: '10px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    }}
                >
                    {/* Left arrow */}
                    {totalPages > 1 && (
                        <button
                            onClick={() => goPage('left')}
                            aria-label="Previous"
                            disabled={animating}
                            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20
                                w-8 h-8 rounded-full bg-white
                                flex items-center justify-center
                                border border-gray-200 shadow-md
                                transition-transform duration-150 hover:scale-110 active:scale-95 disabled:opacity-50"
                        >
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M6.5 2L3.5 5l3 3" stroke="#111" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}

                    {/* 2 equal cards side by side */}
                    <div
                        className="flex gap-3 w-full overflow-hidden"
                        style={{ height: '180px' }}
                    >
                        {pair.map((banner, i) => (
                            <div
                                key={banner._id}
                                className="flex-1"
                                style={{
                                    // slide-in animation on page change
                                    animation: animating
                                        ? `slideIn-${animDir} 0.35s cubic-bezier(0.4,0,0.2,1) forwards`
                                        : undefined,
                                }}
                            >
                                <BannerCard banner={banner} idx={pairStart + i} />
                            </div>
                        ))}

                        {/* If odd number of banners, fill last slot with empty */}
                        {pair.length === 1 && (
                            <div className="flex-1 rounded-xl bg-gray-200/60" />
                        )}
                    </div>

                    {/* Right arrow */}
                    {totalPages > 1 && (
                        <button
                            onClick={() => goPage('right')}
                            aria-label="Next"
                            disabled={animating}
                            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20
                                w-8 h-8 rounded-full bg-white
                                flex items-center justify-center
                                border border-gray-200 shadow-md
                                transition-transform duration-150 hover:scale-110 active:scale-95 disabled:opacity-50"
                        >
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M3.5 2L6.5 5l-3 3" stroke="#111" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Page dots — desktop */}
                {totalPages > 1 && (
                    <div className="hidden md:flex justify-center gap-1.5 mt-2.5">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { if (!animating && i !== page) { setAnimDir(i > page ? 'right' : 'left'); setPage(i); } }}
                                className="rounded-full transition-all duration-300"
                                style={{
                                    height: '4px',
                                    width: i === page ? '16px' : '4px',
                                    background: i === page ? '#2874f0' : '#d1d5db',
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* ════════════════════════════════════════════
                    MOBILE  < 768px
                    1 card visible + peek of next, swipe/scroll
                ════════════════════════════════════════════ */}
                <div className="md:hidden relative">
                    {/* Left arrow */}
                    {canScrollLeft && (
                        <button
                            onClick={() => mobileScroll('left')}
                            aria-label="Scroll left"
                            className="absolute -left-1 top-1/2 -translate-y-1/2 z-20
                                w-7 h-7 rounded-full bg-white shadow-md
                                flex items-center justify-center border border-gray-100
                                active:scale-95"
                        >
                            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                                <path d="M6.5 2L3.5 5l3 3" stroke="#111" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}

                    {/* Scroll row */}
                    <div
                        ref={scrollRef}
                        className="flex gap-3 overflow-x-auto"
                        style={{
                            scrollSnapType: 'x mandatory',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch',
                        }}
                    >
                        {banners.map((banner, i) => (
                            <div
                                key={banner._id}
                                className="m-banner-card flex-shrink-0"
                                style={{
                                    width: 'calc(88% - 6px)',   // 1 card + peek
                                    height: '160px',
                                    scrollSnapAlign: 'start',
                                }}
                            >
                                <BannerCard banner={banner} idx={i} />
                            </div>
                        ))}
                    </div>

                    {/* Right arrow */}
                    {canScrollRight && (
                        <button
                            onClick={() => mobileScroll('right')}
                            aria-label="Scroll right"
                            className="absolute -right-1 top-1/2 -translate-y-1/2 z-20
                                w-7 h-7 rounded-full bg-white shadow-md
                                flex items-center justify-center border border-gray-100
                                active:scale-95"
                        >
                            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                                <path d="M3.5 2L6.5 5l-3 3" stroke="#111" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes slideIn-right {
                    from { opacity: 0; transform: translateX(40px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideIn-left {
                    from { opacity: 0; transform: translateX(-40px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                /* hide webkit scrollbar on mobile row */
                .m-banner-card::-webkit-scrollbar { display: none; }
            `}</style>
        </section>
    );
}