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
            aria-label="Crunchy Cashews – Premium Cashew Nuts from Factory to Doorstep"
            className="relative w-full overflow-hidden bg-[#1a0a04]"
            style={{ height: 'clamp(600px, 100svh, 820px)' }}
        >
            {/* ── Video ── */}
            <video
                ref={videoRef}
                src="https://res.cloudinary.com/dvhgznmk5/video/upload/v1774628557/cc-main-video_gk6uwc.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'clamp(20%, 35%, 50%) center' }}
            />

            {/* ── Mobile overlay ── */}
            <div
                className="absolute inset-0 md:hidden"
                style={{ background: 'rgba(10,4,0,0.72)' }}
            />

            {/* ── Desktop overlay ── */}
            <div
                className="absolute inset-0 hidden md:block"
                style={{
                    background: `linear-gradient(
                        to right,
                        rgba(10,4,0,0.90) 0%,
                        rgba(10,4,0,0.65) 42%,
                        rgba(10,4,0,0.14) 68%,
                        rgba(10,4,0,0.00) 100%
                    )`,
                }}
            />

            {/* ── Bottom fade ── */}
            <div
                className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(10,4,0,0.65) 0%, transparent 100%)' }}
            />

            {/* ── Content ── */}
            <div className="absolute inset-0 flex items-center">
                <div className="w-full max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16">
                    <div className="flex flex-col items-center text-center md:items-start md:text-left max-w-full md:max-w-[580px]">

                        {/* Eyebrow */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-[2px] w-5 bg-amber rounded-full" />
                            <span className="text-amber text-[10px] font-black uppercase tracking-[.18em]">
                                Premium Cashews · Since 2018
                            </span>
                            <span className="h-[2px] w-5 bg-amber rounded-full md:hidden" />
                        </div>

                        {/* H1 */}
                        <h1
                            className="text-white font-black leading-[1.0] tracking-tight mb-4"
                            style={{ fontSize: 'clamp(2.8rem, 9.5vw, 5rem)' }}
                        >
                            Crunchy
                            <span className="block text-amber">Cashews</span>
                        </h1>

                        {/* Tagline — matches image 2 style */}
                        <p
                            className="text-white/80 font-medium leading-relaxed mb-5"
                            style={{ fontSize: 'clamp(0.88rem, 2.2vw, 1rem)', maxWidth: '360px' }}
                        >
                            Hand-picked, roasted to perfection.<br />
                            Delivered fresh from our factory in Siliguri
                            to your door.
                        </p>

                        {/* Trust badges — 3 only, single row like image 2 */}
                        <div className="flex items-center justify-center md:justify-start gap-5 mb-6">
                            {[
                                { icon: 'fa-shield-halved', text: 'FSSAI' },
                                { icon: 'fa-truck-fast', text: 'Pan India' },
                                { icon: 'fa-leaf', text: 'Natural' },
                            ].map(b => (
                                <div key={b.text} className="flex items-center gap-1.5">
                                    <i className={`fa-solid ${b.icon} text-amber text-xs`} />
                                    <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">
                                        {b.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* CTA buttons — auto width, no stretching */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/shop"
                                aria-label="Shop premium cashews online"
                                className="group inline-flex items-center gap-2
                                    bg-amber hover:bg-yellow active:scale-[0.97]
                                    text-[#1c0800] font-black text-sm
                                    px-6 py-3 rounded-full
                                    shadow-lg shadow-amber/40
                                    transition-all duration-200 hover:scale-[1.02]
                                    whitespace-nowrap"
                            >
                                <i className="fa-solid fa-store text-xs" />
                                Shop Now
                                <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform" />
                            </Link>

                            <Link
                                href="/bulk"
                                aria-label="Place a bulk or wholesale cashew order"
                                className="group inline-flex items-center gap-2
                                    bg-white/10 hover:bg-white/20 active:scale-[0.97]
                                    text-white font-black text-sm
                                    px-6 py-3 rounded-full
                                    border border-white/30 hover:border-white/55
                                    backdrop-blur-sm
                                    transition-all duration-200 hover:scale-[1.02]
                                    whitespace-nowrap"
                            >
                                <i className="fa-solid fa-boxes-stacked text-xs" />
                                Bulk Order
                                <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform" />
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