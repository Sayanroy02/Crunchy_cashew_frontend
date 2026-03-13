'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { API } from '@/constants/api';

interface Banner {
    _id: string;
    title: string;
    image_url: string;
    link?: string;
}

const DEFAULTS: Banner[] = [
    { _id: 'd1', title: 'Premium Quality', image_url: '', link: '/shop' },
    { _id: 'd2', title: 'Factory Direct', image_url: '', link: '/shop' },
    { _id: 'd3', title: 'Free Shipping ₹999+', image_url: '', link: '/shop' },
];

const GRADIENTS = [
    'from-[#FBB21B] via-[#f0a500] to-[#e09000]',
    'from-[#0c5c2b] to-[#1a8c44]',
    'from-[#1a1a2e] to-[#2d3561]',
];
const TEXT_COLORS = ['text-[#2c1a0e]', 'text-white', 'text-white'];
const BADGES = ['🏆 Premium Grade', '🏭 Factory Direct', '🚚 Free Shipping'];
const SUBS = ['Straight from Siliguri', 'Best Price Guaranteed', 'On Orders Above ₹999'];

function SlideContent({ banner, idx }: { banner: Banner; idx: number }) {
    const g = GRADIENTS[idx % GRADIENTS.length];
    const tc = TEXT_COLORS[idx % TEXT_COLORS.length];
    if (banner.image_url) {
        return <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />;
    }
    return (
        <div className={`w-full h-full bg-gradient-to-br ${g} flex flex-col justify-center items-center text-center p-8`}>
            <span className={`inline-block ${tc} bg-white/10 border border-white/20 text-xs font-bold px-4 py-1.5 rounded-full mb-3 tracking-widest`}>
                {BADGES[idx % BADGES.length]}
            </span>
            <h2 className={`text-3xl md:text-5xl font-black ${tc} leading-tight mb-2`}>{banner.title}</h2>
            <p className={`text-sm md:text-lg font-semibold ${tc} opacity-70`}>{SUBS[idx % SUBS.length]}</p>
        </div>
    );
}

export default function HeroCarousel() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const touchHoldTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const touchStartX = useRef<number>(0);

    useEffect(() => {
        fetch(API.BANNERS)
            .then(r => r.json())
            .then(data => setBanners(data?.length > 0 ? data : DEFAULTS))
            .catch(() => setBanners(DEFAULTS));
    }, []);

    const navigate = useCallback((dir: number) => {
        if (animating || banners.length <= 1) return;
        setAnimating(true);
        setCurrent(c => (c + dir + banners.length) % banners.length);
        setTimeout(() => setAnimating(false), 500);
    }, [animating, banners.length]);

    const next = useCallback(() => navigate(1), [navigate]);
    const prev = useCallback(() => navigate(-1), [navigate]);

    // Auto-play
    useEffect(() => {
        if (banners.length <= 1 || isPaused) return;
        const t = setInterval(next, 5000);
        return () => clearInterval(t);
    }, [banners.length, next, isPaused]);

    // Swipe support
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchHoldTimer.current = setTimeout(() => setIsPaused(true), 300);
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchHoldTimer.current) clearTimeout(touchHoldTimer.current);
        setIsPaused(false);
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    };

    if (banners.length === 0) {
        return <div className="w-full mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-10 py-4">
            <div className="w-full h-[200px] sm:h-[280px] lg:h-[360px] bg-gray-100 animate-pulse rounded-2xl" />
        </div>;
    }

    return (
        <section className="w-full bg-[#fffdf5] py-4 sm:py-5">
            {/* Constrained + padded wrapper — this gives the left/right margin */}
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">

                {/* Single banner container */}
                <div
                    className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-lg"
                    style={{
                        height: 'clamp(160px, 28vw, 380px)',
                        outline: '2px solid rgba(251,178,27,0.25)',
                        outlineOffset: '2px',
                    }}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={() => { setIsPaused(false); if (touchHoldTimer.current) clearTimeout(touchHoldTimer.current); }}
                >
                    {/* Slides */}
                    {banners.map((banner, i) => (
                        <div
                            key={banner._id}
                            className="absolute inset-0"
                            style={{
                                opacity: i === current ? 1 : 0,
                                transform: `scale(${i === current ? 1 : 1.03})`,
                                transition: 'opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)',
                                zIndex: i === current ? 2 : 1,
                                pointerEvents: i === current ? 'auto' : 'none',
                            }}
                        >
                            <a href={banner.link || '/shop'} className="block w-full h-full">
                                <SlideContent banner={banner} idx={i} />
                            </a>
                        </div>
                    ))}

                    {/* LEFT arrow */}
                    {banners.length > 1 && (
                        <button
                            onClick={prev}
                            aria-label="Previous"
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-10
                                w-9 h-9 sm:w-10 sm:h-10
                                bg-white/90 hover:bg-white
                                rounded-full shadow-md hover:shadow-lg
                                flex items-center justify-center
                                transition-all duration-200 hover:scale-110 active:scale-95"
                        >
                            <i className="fa-solid fa-chevron-left text-[#0c5c2b] text-sm" />
                        </button>
                    )}

                    {/* RIGHT arrow */}
                    {banners.length > 1 && (
                        <button
                            onClick={next}
                            aria-label="Next"
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-10
                                w-9 h-9 sm:w-10 sm:h-10
                                bg-white/90 hover:bg-white
                                rounded-full shadow-md hover:shadow-lg
                                flex items-center justify-center
                                transition-all duration-200 hover:scale-110 active:scale-95"
                        >
                            <i className="fa-solid fa-chevron-right text-[#0c5c2b] text-sm" />
                        </button>
                    )}

                    {/* Paused badge */}
                    <div
                        className="absolute top-3 right-3 z-20 flex items-center gap-1.5
                            bg-black/50 backdrop-blur-sm text-white text-xs font-semibold
                            px-3 py-1.5 rounded-full pointer-events-none"
                        style={{
                            opacity: isPaused ? 1 : 0,
                            transform: isPaused ? 'translateY(0)' : 'translateY(-6px)',
                            transition: 'opacity 0.2s ease, transform 0.2s ease',
                        }}
                    >
                        <span className="flex gap-[3px] items-center">
                            <span className="inline-block w-[3px] h-3 bg-white rounded-sm" />
                            <span className="inline-block w-[3px] h-3 bg-white rounded-sm" />
                        </span>
                        Paused
                    </div>

                    {/* Dot indicators — inside the banner, bottom centre */}
                    {banners.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 items-center">
                            {banners.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={e => {
                                        e.preventDefault();
                                        if (!animating) {
                                            setAnimating(true);
                                            setCurrent(i);
                                            setTimeout(() => setAnimating(false), 500);
                                        }
                                    }}
                                    aria-label={`Slide ${i + 1}`}
                                    className="h-1.5 rounded-full transition-all duration-400 ease-out"
                                    style={{
                                        width: i === current ? '2rem' : '0.5rem',
                                        background: i === current ? '#FBB21B' : 'rgba(255,255,255,0.65)',
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Slide title row below banner */}
                {banners.length > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-2">
                        {banners.map((b, i) => (
                            <span
                                key={b._id}
                                className="text-xs font-semibold transition-all duration-300 cursor-pointer"
                                style={{
                                    color: i === current ? '#0c5c2b' : '#94a3b8',
                                    transform: i === current ? 'scale(1.1)' : 'scale(1)',
                                }}
                                onClick={() => {
                                    if (!animating) { setAnimating(true); setCurrent(i); setTimeout(() => setAnimating(false), 500); }
                                }}
                            >
                                {i === current ? `● ${b.title}` : '○'}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}