'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';

export default function HeroVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const v = videoRef.current;
        if (v) {
            v.muted = true;
            v.play().catch(() => { });
        }
    }, []);

    return (
        <section
            className="relative w-full overflow-hidden bg-[#1a0a04]"
            style={{ height: 'clamp(600px, 100svh, 820px)' }}
        >
            {/* ── Video ── */}
            <video
                ref={videoRef}
                src="/videos/cashew-animation-hero.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'center center' }}
            />

            {/* ── Mobile overlay: uniform dark so text is always readable ── */}
            <div
                className="absolute inset-0 md:hidden"
                style={{ background: 'rgba(10,4,0,0.68)' }}
            />

            {/* ── Desktop overlay: gradient left-to-right ── */}
            <div
                className="absolute inset-0 hidden md:block"
                style={{
                    background: `linear-gradient(
                        to right,
                        rgba(10,4,0,0.88) 0%,
                        rgba(10,4,0,0.62) 40%,
                        rgba(10,4,0,0.12) 68%,
                        rgba(10,4,0,0.00) 100%
                    )`,
                }}
            />

            {/* ── Bottom fade ── */}
            <div
                className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(10,4,0,0.6) 0%, transparent 100%)' }}
            />

            {/* ── Content ── */}
            <div className="absolute inset-0 flex items-center">
                <div className="w-full max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
                    <div className="flex flex-col items-center text-center md:items-start md:text-left max-w-full md:max-w-[540px]">

                        {/* Eyebrow */}
                        <div className="flex items-center gap-2 mb-4 md:mb-5">
                            <span className="h-[2px] w-7 bg-amber rounded-full" />
                            <span className="text-amber text-[10px] md:text-xs font-black uppercase tracking-[.2em]">
                                Premium Cashews · Since 2018
                            </span>
                            <span className="h-[2px] w-7 bg-amber rounded-full md:hidden" />
                        </div>

                        {/* Brand name */}
                        <h1
                            className="text-white font-black leading-[1.0] tracking-tight mb-3 md:mb-4"
                            style={{ fontSize: 'clamp(3rem, 10vw, 5rem)' }}
                        >
                            Crunchy
                            <span className="block text-amber">Cashews</span>
                        </h1>

                        {/* Tagline */}
                        <p
                            className="text-white/75 font-medium leading-relaxed mb-6 md:mb-7"
                            style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.05rem)', maxWidth: '360px' }}
                        >
                            Hand-picked, roasted to perfection. Delivered
                            fresh from our factory in Siliguri to your door.
                        </p>

                        {/* Trust badges */}
                        <div className="flex items-center justify-center md:justify-start gap-5 mb-7 md:mb-8">
                            {[
                                { icon: 'fa-shield-halved', text: 'FSSAI' },
                                { icon: 'fa-truck-fast', text: 'Pan India' },
                                { icon: 'fa-leaf', text: 'Natural' },
                            ].map(b => (
                                <div key={b.text} className="flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-1.5">
                                    <i className={`fa-solid ${b.icon} text-amber text-sm`} />
                                    <span className="text-white/60 text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                                        {b.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* CTA buttons — full width stacked on mobile, inline on desktop */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                            <Link
                                href="/shop"
                                className="group inline-flex items-center justify-center gap-2.5
                                    bg-amber hover:bg-yellow active:scale-[0.97]
                                    text-[#1c0800] font-black text-sm md:text-base
                                    px-8 py-4 md:py-3.5 rounded-full
                                    shadow-lg shadow-amber/40 hover:shadow-amber/60
                                    transition-all duration-200 hover:scale-[1.02]"
                            >
                                <i className="fa-solid fa-store" />
                                Shop Now
                                <i className="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="/bulk"
                                className="group inline-flex items-center justify-center gap-2.5
                                    bg-white/10 hover:bg-white/20 active:scale-[0.97]
                                    text-white font-black text-sm md:text-base
                                    px-8 py-4 md:py-3.5 rounded-full
                                    border border-white/30 hover:border-white/55
                                    backdrop-blur-sm
                                    transition-all duration-200 hover:scale-[1.02]"
                            >
                                <i className="fa-solid fa-boxes-stacked" />
                                Bulk Order
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── Scroll hint — desktop only ── */}
            <div className="hidden md:flex absolute bottom-7 left-1/2 -translate-x-1/2 flex-col items-center opacity-40 pointer-events-none">
                <div
                    className="w-[1px] h-10 bg-white rounded-full"
                    style={{ animation: 'scrollPulse 2s ease-in-out infinite' }}
                />
            </div>

            <style>{`
                @keyframes scrollPulse {
                    0%, 100% { opacity: 0.3; transform: scaleY(0.6); transform-origin: top; }
                    50%       { opacity: 0.9; transform: scaleY(1);   transform-origin: top; }
                }
            `}</style>
        </section>
    );
}