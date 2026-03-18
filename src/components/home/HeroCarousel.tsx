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

// Per-slide content config for fallback slides
const SLIDE_CONFIG = [
    {
        badge: '🏆 Premium Grade',
        subtitle: 'Straight from Siliguri',
        cta: 'Shop Now',
        bg: 'from-amber-400 via-yellow-300 to-amber-200',
        textDark: true,
        accent: '#92400e',
        particle: '#fbbf24',
    },
    {
        badge: '🏭 Factory Direct',
        subtitle: 'Best Price Guaranteed',
        cta: 'Explore',
        bg: 'from-primary to-emerald-700',
        textDark: false,
        accent: '#a7f3d0',
        particle: '#34d399',
    },
    {
        badge: '🚚 Free Shipping',
        subtitle: 'On Orders Above ₹999',
        cta: 'Order Now',
        bg: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
        textDark: false,
        accent: '#818cf8',
        particle: '#6366f1',
    },
];

// Floating particle dots for the fallback slides
function Particles({ color }: { color: string }) {
    const dots = Array.from({ length: 18 }, (_, i) => ({
        cx: 10 + (i * 47) % 90,
        cy: 5 + (i * 31) % 90,
        r: 1 + (i % 3),
        dur: 2.5 + (i % 4) * 0.7,
        dy: -(6 + (i % 10)),
        delay: (i * 0.3) % 3,
    }));
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            {dots.map((d, i) => (
                <circle key={i} cx={`${d.cx}%`} cy={`${d.cy}%`} r={d.r} fill={color} opacity="0.35">
                    <animate attributeName="cy" from={`${d.cy}%`} to={`${d.cy + d.dy}%`} dur={`${d.dur}s`} begin={`${d.delay}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;0.35;0" dur={`${d.dur}s`} begin={`${d.delay}s`} repeatCount="indefinite" />
                </circle>
            ))}
        </svg>
    );
}

function FallbackSlide({ banner, idx }: { banner: Banner; idx: number }) {
    const cfg = SLIDE_CONFIG[idx % SLIDE_CONFIG.length];
    const tc = cfg.textDark ? 'text-[#1c0a00]' : 'text-white';
    const tcs = cfg.textDark ? 'text-[#3d1f00]/70' : 'text-white/70';
    return (
        <div className={`w-full h-full bg-gradient-to-br ${cfg.bg} relative overflow-hidden flex flex-col justify-center items-center text-center px-8 select-none`}>
            <Particles color={cfg.particle} />

            {/* Large blurred decorative circle — depth layer */}
            <div
                className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{
                    width: '60%', height: '140%', top: '-20%', right: '-15%',
                    background: cfg.particle,
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-3 md:gap-4">
                <span className={`inline-block ${tc} bg-white/15 border border-white/25 text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full tracking-[.18em] uppercase`}>
                    {cfg.badge}
                </span>

                <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black ${tc} leading-[1.05] tracking-tight max-w-2xl`}>
                    {banner.title}
                </h2>

                <p className={`text-sm md:text-base font-semibold ${tcs} max-w-md`}>
                    {cfg.subtitle}
                </p>

                <a
                    href={banner.link || '/shop'}
                    className={`mt-1 md:mt-2 inline-flex items-center gap-2 font-black text-xs md:text-sm px-6 md:px-8 py-2.5 md:py-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg`}
                    style={{ background: cfg.accent, color: cfg.textDark ? '#fff' : '#fff' }}
                    onClick={e => e.stopPropagation()}
                >
                    {cfg.cta}
                    <i className="fa-solid fa-arrow-right text-[10px]" />
                </a>
            </div>
        </div>
    );
}

function ImageSlide({ banner }: { banner: Banner }) {
    return (
        <img
            src={banner.image_url}
            alt={banner.title}
            className="w-full h-full object-cover"
            draggable={false}
        />
    );
}

export default function HeroCarousel() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [current, setCurrent] = useState(0);
    const [prev, setPrev] = useState<number | null>(null);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [animating, setAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const touchStartX = useRef<number>(0);
    const touchHoldTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        fetch(API.BANNERS)
            .then(r => r.json())
            .then(data => setBanners(data?.length > 0 ? data : DEFAULTS))
            .catch(() => setBanners(DEFAULTS))
            .finally(() => setTimeout(() => setLoaded(true), 80));
    }, []);

    const navigate = useCallback((dir: 'next' | 'prev') => {
        if (animating || banners.length <= 1) return;
        setAnimating(true);
        setDirection(dir);
        setPrev(current);
        setCurrent(c => dir === 'next'
            ? (c + 1) % banners.length
            : (c - 1 + banners.length) % banners.length
        );
        setTimeout(() => { setAnimating(false); setPrev(null); }, 680);
    }, [animating, banners.length, current]);

    const goTo = useCallback((idx: number) => {
        if (animating || idx === current || banners.length <= 1) return;
        setAnimating(true);
        setDirection(idx > current ? 'next' : 'prev');
        setPrev(current);
        setCurrent(idx);
        setTimeout(() => { setAnimating(false); setPrev(null); }, 680);
    }, [animating, current, banners.length]);

    // Auto-play
    useEffect(() => {
        if (banners.length <= 1 || isPaused) return;
        const t = setInterval(() => navigate('next'), 5500);
        return () => clearInterval(t);
    }, [banners.length, isPaused, navigate]);

    // Touch / swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchHoldTimer.current = setTimeout(() => setIsPaused(true), 300);
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchHoldTimer.current) clearTimeout(touchHoldTimer.current);
        setIsPaused(false);
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 44) navigate(diff > 0 ? 'next' : 'prev');
    };

    // ── Loading skeleton ──
    if (banners.length === 0) return (
        <section className="w-full bg-bg py-4 sm:py-5">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
                <div className="w-full rounded-2xl md:rounded-3xl bg-gray-100 animate-pulse"
                    style={{ height: 'clamp(200px, 42vw, 560px)' }} />
            </div>
        </section>
    );

    // Slide transition keyframe values
    // Outgoing: slides out in the opposite direction
    // Incoming: enters from the direction of travel
    const ENTER_TRANSLATE = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
    const EXIT_TRANSLATE = direction === 'next' ? 'translateX(-12%)' : 'translateX(12%)';

    return (
        <section className="w-full bg-bg py-4 sm:py-5">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
                <div
                    className={`relative w-full overflow-hidden rounded-2xl md:rounded-3xl transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        height: 'clamp(200px, 42vw, 560px)',
                        // Subtle amber ring matching brand
                        boxShadow: '0 0 0 1.5px rgba(251,178,27,0.30), 0 24px 48px -12px rgba(0,0,0,0.18)',
                    }}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={() => { setIsPaused(false); if (touchHoldTimer.current) clearTimeout(touchHoldTimer.current); }}
                >

                    {/* ── Slides ── */}
                    {banners.map((banner, i) => {
                        const isActive = i === current;
                        const isLeaving = i === prev;

                        let transform = 'translateX(100%)';
                        let opacity = 0;
                        let scale = 1.02;
                        let zIndex = 0;
                        let transition = 'transform 0.68s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.68s ease, scale 0.68s ease';

                        if (isActive) {
                            transform = 'translateX(0%)';
                            opacity = 1;
                            scale = 1;
                            zIndex = 2;
                        } else if (isLeaving) {
                            transform = EXIT_TRANSLATE;
                            opacity = 0;
                            scale = 0.98;
                            zIndex = 1;
                        } else {
                            transform = ENTER_TRANSLATE;
                            transition = 'none';
                        }

                        return (
                            <div
                                key={banner._id}
                                className="absolute inset-0"
                                style={{ transform, opacity, scale, zIndex, transition, willChange: 'transform, opacity' }}
                            >
                                <a href={banner.link || '/shop'} className="block w-full h-full" draggable={false}>
                                    {banner.image_url
                                        ? <ImageSlide banner={banner} />
                                        : <FallbackSlide banner={banner} idx={i} />
                                    }
                                </a>
                            </div>
                        );
                    })}

                    {/* ── Prev Arrow ── */}
                    {banners.length > 1 && (
                        <button
                            onClick={e => { e.preventDefault(); navigate('prev'); }}
                            aria-label="Previous"
                            className="group absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-10
                                w-9 h-9 md:w-11 md:h-11
                                bg-white/20 hover:bg-white/90
                                backdrop-blur-md
                                rounded-full
                                flex items-center justify-center
                                border border-white/30 hover:border-transparent
                                shadow-lg hover:shadow-xl
                                transition-all duration-200
                                hover:scale-110 active:scale-95"
                        >
                            <i className="fa-solid fa-chevron-left text-white group-hover:text-primary text-sm transition-colors duration-200" />
                        </button>
                    )}

                    {/* ── Next Arrow ── */}
                    {banners.length > 1 && (
                        <button
                            onClick={e => { e.preventDefault(); navigate('next'); }}
                            aria-label="Next"
                            className="group absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-10
                                w-9 h-9 md:w-11 md:h-11
                                bg-white/20 hover:bg-white/90
                                backdrop-blur-md
                                rounded-full
                                flex items-center justify-center
                                border border-white/30 hover:border-transparent
                                shadow-lg hover:shadow-xl
                                transition-all duration-200
                                hover:scale-110 active:scale-95"
                        >
                            <i className="fa-solid fa-chevron-right text-white group-hover:text-primary text-sm transition-colors duration-200" />
                        </button>
                    )}

                    {/* ── Pause indicator ── */}
                    <div
                        className="absolute top-3 right-14 md:right-20 z-20 flex items-center gap-1.5
                            bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold
                            px-2.5 py-1 rounded-full pointer-events-none uppercase tracking-widest"
                        style={{
                            opacity: isPaused ? 1 : 0,
                            transform: isPaused ? 'translateY(0)' : 'translateY(-8px)',
                            transition: 'opacity 0.25s ease, transform 0.25s ease',
                        }}
                    >
                        <span className="flex gap-[3px] items-center h-3">
                            <span className="w-[2.5px] h-[10px] bg-white rounded-sm" />
                            <span className="w-[2.5px] h-[10px] bg-white rounded-sm" />
                        </span>
                        Paused
                    </div>

                    {/* ── Dot indicators ── */}
                    {banners.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 items-center">
                            {banners.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={e => { e.preventDefault(); goTo(i); }}
                                    aria-label={`Slide ${i + 1}`}
                                    className="rounded-full transition-all duration-500 ease-out hover:opacity-100"
                                    style={{
                                        height: '5px',
                                        width: i === current ? '28px' : '5px',
                                        background: i === current
                                            ? 'var(--color-amber, #FBB21B)'
                                            : 'rgba(255,255,255,0.55)',
                                        boxShadow: i === current ? '0 0 8px 1px rgba(251,178,27,0.55)' : 'none',
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* ── Progress bar (auto-play timer) ── */}
                    {banners.length > 1 && !isPaused && (
                        <div
                            key={`progress-${current}`}
                            className="absolute bottom-0 left-0 h-[3px] z-10 rounded-br-full"
                            style={{
                                background: 'linear-gradient(90deg, rgba(251,178,27,0.9), rgba(251,178,27,0.55))',
                                animation: 'heroProgress 5.5s linear forwards',
                            }}
                        />
                    )}
                </div>


            </div>

            {/* Progress bar keyframe — injected once globally */}
            <style>{`
                @keyframes heroProgress {
                    from { width: 0%; }
                    to   { width: 100%; }
                }
            `}</style>
        </section>
    );
}