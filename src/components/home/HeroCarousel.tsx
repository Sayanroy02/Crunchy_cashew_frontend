'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

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
            <span className={`inline-block ${tc} bg-white/10 border border-white/20 text-xs font-bold px-4 py-1.5 rounded-full mb-3 tracking-widest`}>{BADGES[idx % BADGES.length]}</span>
            <h2 className={`text-3xl md:text-5xl font-black ${tc} leading-tight mb-2`}>{banner.title}</h2>
            <p className={`text-sm md:text-lg font-semibold ${tc} opacity-70`}>{SUBS[idx % SUBS.length]}</p>
        </div>
    );
}

export default function HeroCarousel() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8000/api/cms/banners')
            .then(r => r.json())
            .then(data => setBanners(data?.length > 0 ? data : DEFAULTS))
            .catch(() => setBanners(DEFAULTS));
    }, []);

    const navigate = useCallback((dir: number) => {
        if (animating || banners.length <= 1) return;
        setAnimating(true);
        setCurrent(c => (c + dir + banners.length) % banners.length);
        setTimeout(() => setAnimating(false), 600);
    }, [animating, banners.length]);

    const next = useCallback(() => navigate(1), [navigate]);
    const prev = useCallback(() => navigate(-1), [navigate]);

    useEffect(() => {
        if (banners.length <= 1) return;
        const t = setInterval(next, 5000);
        return () => clearInterval(t);
    }, [banners.length, next]);

    if (banners.length === 0) return <div className="w-full h-[420px] bg-gray-50 animate-pulse rounded-2xl" />;

    const prevIdx = (current - 1 + banners.length) % banners.length;
    const nextIdx = (current + 1) % banners.length;

    return (
        <section className="w-full bg-[#fffdf5] pt-4 pb-8 overflow-hidden">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <div
                    className="relative flex items-center gap-3 md:gap-5"
                    style={{ height: 'clamp(220px, 42vw, 480px)' }}
                >
                    {/* LEFT — Previous preview */}
                    <button
                        onClick={prev}
                        className="hidden sm:block flex-shrink-0 relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer group"
                        style={{ width: '14%', height: '70%' }}
                        aria-label="Previous"
                    >
                        {/* Blurred preview */}
                        <div className="absolute inset-0 scale-125 origin-center pointer-events-none">
                            <SlideContent banner={banners[prevIdx]} idx={prevIdx} />
                        </div>
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-chevron-left text-[#0c5c2b] text-sm" />
                            </div>
                        </div>
                    </button>

                    {/* CENTER — Main banner with smooth transition */}
                    <div className="flex-1 h-full relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl"
                        style={{ outline: '2px solid rgba(251,178,27,0.3)', outlineOffset: '2px' }}
                    >
                        {banners.map((banner, i) => (
                            <div
                                key={banner._id}
                                className="absolute inset-0"
                                style={{
                                    opacity: i === current ? 1 : 0,
                                    transform: `scale(${i === current ? 1 : 1.03})`,
                                    transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                    zIndex: i === current ? 2 : 1,
                                    pointerEvents: i === current ? 'auto' : 'none',
                                }}
                            >
                                <a href={banner.link || '/shop'} className="block w-full h-full">
                                    <SlideContent banner={banner} idx={i} />
                                </a>
                            </div>
                        ))}

                        {/* Dots */}
                        {banners.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                {banners.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => { e.preventDefault(); if (!animating) { setAnimating(true); setCurrent(i); setTimeout(() => setAnimating(false), 600); } }}
                                        className="h-1.5 rounded-full transition-all duration-500 ease-out"
                                        style={{
                                            width: i === current ? '2rem' : '0.5rem',
                                            background: i === current ? '#FBB21B' : 'rgba(255,255,255,0.6)',
                                        }}
                                        aria-label={`Slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Next preview */}
                    <button
                        onClick={next}
                        className="hidden sm:block flex-shrink-0 relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer group"
                        style={{ width: '14%', height: '70%' }}
                        aria-label="Next"
                    >
                        <div className="absolute inset-0 scale-125 origin-center pointer-events-none">
                            <SlideContent banner={banners[nextIdx]} idx={nextIdx} />
                        </div>
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-chevron-right text-[#0c5c2b] text-sm" />
                            </div>
                        </div>
                    </button>
                </div>

                {/* Slide indicator row */}
                <div className="flex items-center justify-center gap-2 mt-3">
                    {banners.map((b, i) => (
                        <span
                            key={b._id}
                            className="text-xs font-semibold transition-all duration-300"
                            style={{ color: i === current ? '#0c5c2b' : '#94a3b8', transform: i === current ? 'scale(1.1)' : 'scale(1)' }}
                        >
                            {i === current ? `● ${b.title}` : '○'}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
