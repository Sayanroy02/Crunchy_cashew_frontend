'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroVideo() {
    const desktopVideoRef = useRef<HTMLVideoElement>(null);

    // Desktop: always visible. Mobile: visible immediately now that it's a static image.
    const [mobileContentVisible, setMobileContentVisible] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [videoError, setVideoError] = useState(false);

    useEffect(() => {
        // Play video immediately on desktop
        const desktopV = desktopVideoRef.current;
        if (desktopV) {
            desktopV.muted = true;
            desktopV.play().catch(() => { });
        }

        setMobileContentVisible(true);
    }, []);

    // Shared stagger style helper
    const stagger = (delay: number, visible: boolean): React.CSSProperties => ({
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(18px)',
        transition: `opacity 0.7s ${delay}s ease, transform 0.7s ${delay}s cubic-bezier(0.22,1,0.36,1)`,
    });

    return (
        <section
            aria-label="Crunchy Cashews – Premium Cashew Nuts from Factory to Doorstep"
            className="relative w-full overflow-hidden bg-[#1a0a04] h-[calc(100svh-var(--navbar-h,72px))] md:h-auto md:aspect-video"
        >
            {/* Fallback image shown behind/instead of video if it fails or while loading */}
            <img
                src="/images/animation-photo.png"
                alt="Crunchy Cashews Premium Nuts"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'
                    }`}
                style={{ objectPosition: 'center center' }}
            />

            {/* ── Desktop Video ── */}
            <video
                ref={desktopVideoRef}
                src="https://res.cloudinary.com/da1acfqsn/video/upload/f_auto,q_auto,vc_auto/v1776770965/Crunchy_Cashew_Product_Animation_Updated_V2_tskkbx.mp4"
                muted
                loop
                playsInline
                preload="metadata"
                onPlay={() => setVideoLoaded(true)}
                onError={() => setVideoError(true)}
                className="absolute inset-0 w-full h-full object-cover hidden md:block"
            />

            {/* ── Mobile Background Image ── */}
            <div className="absolute inset-0 md:hidden">
                <Image
                    src="https://res.cloudinary.com/da1acfqsn/image/upload/v1780641655/ChatGPT_Image_Jun_5_2026_12_10_35_PM_tkpnj7.png"
                    alt="Crunchy Cashews Premium Nuts Mobile Hero"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                />
            </div>

            {/* ── Mobile overlay ── */}
            <div
                className="absolute inset-0 md:hidden pointer-events-none"
                style={{ background: 'rgba(10,4,0,0.40)' }}
            />

            {/* ── Desktop overlay ── */}
            <div
                className="absolute inset-0 hidden md:block pointer-events-none"
                style={{
                    background: `linear-gradient(
                        to right,
                        rgba(10, 4, 0, 0.8) 0%,
                        rgba(10,4,0,0.65) 42%,
                        rgba(10,4,0,0.14) 68%,
                        rgba(10,4,0,0.00) 100%
                    )`,
                }}
            />

            {/* ── Bottom fade ── */}
            <div
                className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(10,4,0,0.75) 0%, transparent 100%)' }}
            />

            {/* ════════════════════
                MOBILE: Top block
                Eyebrow + H1 pinned below the transparent navbar (~navbar height + some gap)
            ════════════════════ */}
            <div
                className="md:hidden absolute left-0 right-0 flex flex-col items-center text-center px-6"
                style={{ top: '48px' }}
            >
                {/* Eyebrow */}
                <div
                    className="flex items-center gap-2 mb-2"
                    style={stagger(0.05, mobileContentVisible)}
                >
                    <span className="h-[2px] w-4 bg-amber rounded-full" />
                    <span className="text-amber text-[9px] min-[360px]:text-[10px] font-black uppercase tracking-[.18em]">
                        Premium Cashews · Since 2018
                    </span>
                    <span className="h-[2px] w-4 bg-amber rounded-full" />
                </div>

                {/* H1 */}
                <h1
                    className="text-white font-black leading-[1.0] tracking-tight"
                    style={{
                        fontSize: 'clamp(1.4rem, 8.5vw, 2.4rem)',
                        ...stagger(0.14, mobileContentVisible),
                    }}
                >
                    Factory Fresh
                    <span className="block text-amber">Premium Cashews</span>
                </h1>
            </div>

            {/* ════════════════════
                MOBILE: Bottom block
                Buttons pinned below the packet (~bottom 5%)
            ════════════════════ */}
            <div
                className="md:hidden absolute left-0 right-0 flex flex-col items-center text-center px-6"
                style={{ bottom: '5%' }}
            >
                {/* CTA buttons */}
                <div
                    className="flex items-center justify-center w-full"
                    style={{
                        opacity: mobileContentVisible ? 1 : 0,
                        transform: mobileContentVisible ? 'translateY(0px) scale(1)' : 'translateY(12px) scale(0.95)',
                        transition: 'opacity 0.7s 0.22s ease, transform 0.7s 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                >
                    <Link
                        href="/our-product"
                        aria-label="Shop premium cashews online"
                        className="group inline-flex items-center justify-center gap-2
                            bg-amber hover:bg-yellow active:scale-[0.97]
                            text-[#1c0800] font-black text-sm
                            p-4 px-8 py-3.5 rounded-2xl
                            shadow-lg shadow-amber/40
                            transition-all duration-200 hover:scale-105
                            whitespace-nowrap"
                    >
                        <i className="fa-solid fa-store text-xs" />
                        Shop Now
                        <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* ════════════════════
                DESKTOP LAYOUT
                Original left-aligned, always visible (no delay)
            ════════════════════ */}
            {/* Desktop: hero already starts below navbar, no extra padding needed */}
            <div className="hidden md:flex absolute inset-0 items-center transform md:-translate-y-8 lg:-translate-y-14">
                <div className="w-full max-w-screen-xl mx-auto px-10 lg:px-16">
                    <div className="flex flex-col items-start text-left max-w-[580px]">

                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-[2px] w-5 bg-amber rounded-full" />
                            <span className="text-amber text-[10px] font-black uppercase tracking-[.18em]">
                                Premium Cashews · Since 2018
                            </span>
                        </div>

                        <h1
                            className="text-white font-black leading-[1.0] tracking-tight mb-4"
                            style={{ fontSize: 'clamp(2.0rem, 4vw, 4rem)' }}
                        >
                            Factory Fresh
                            <span className="block text-amber">Premium Cashews</span>
                        </h1>

                        <p
                            className="text-white/80 font-medium leading-relaxed mb-5"
                            style={{ fontSize: 'clamp(0.88rem, 1.2vw, 1rem)', maxWidth: '360px' }}
                        >
                            Hand-picked, roasted to perfection.<br />
                            Delivered fresh from our factory in Siliguri to your door.
                        </p>

                        <div className="flex items-center gap-5 mb-6">
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

                        <div className="flex items-center gap-3">
                            <Link
                                href="/our-product"
                                aria-label="Shop premium cashews online"
                                className="group inline-flex items-center justify-center gap-2
                                    bg-amber hover:bg-yellow active:scale-[0.97]
                                    text-[#1c0800] font-black text-sm
                                    p-4 px-8 py-3.5 rounded-2xl
                                    shadow-lg shadow-amber/40
                                    transition-all duration-200 hover:scale-105
                                    whitespace-nowrap"
                            >
                                <i className="fa-solid fa-store text-xs" />
                                Shop Now
                                <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Scroll hint — desktop only ──
            <div className="hidden md:flex absolute bottom-7 left-1/2 -translate-x-1/2 flex-col items-center opacity-40 pointer-events-none">
                <div
                    className="w-[1px] h-10 bg-white rounded-full"
                    style={{ animation: 'scrollPulse 2s ease-in-out infinite' }}
                />
            </div> */}

            {/* ── Parachute decorations (desktop only, pointer-events-none) ── */}
            {/* <div
                className="pointer-events-none absolute top-[6%] right-[6%] hidden md:block"
                style={{ animation: 'parachuteDrift 9s ease-in-out infinite' }}
            >
                <Image
                    src="/images/Cashew-parachute-1-03-03.png"
                    alt=""
                    width={160}
                    height={200}
                    className="w-[clamp(70px,8vw,140px)] h-auto object-contain opacity-75 drop-shadow-md hover:scale-110 hover:-rotate-3 transition-transform duration-500"
                    priority={false}
                />
            </div>

            <div
                className="pointer-events-none absolute top-[40%] right-[18%] hidden md:block"
                style={{ animation: 'parachuteDrift2 12s ease-in-out infinite', animationDelay: '2s' }}
            >
                <Image
                    src="/images/Cashew-parachute-03.png"
                    alt=""
                    width={120}
                    height={150}
                    className="w-[clamp(50px,5.5vw,100px)] h-auto object-contain opacity-65 drop-shadow-md hover:scale-110 hover:rotate-3 transition-transform duration-500"
                    priority={false}
                />
            </div> */}

            <style>{`
                @keyframes scrollPulse {
                    0%, 100% { opacity: 0.3; transform: scaleY(0.6); transform-origin: top; }
                    50%       { opacity: 0.9; transform: scaleY(1);   transform-origin: top; }
                }
                @keyframes parachuteDrift {
                    0%,100% { transform: translateY(0px) translateX(0px); }
                    25%     { transform: translateY(-16px) translateX(5px); }
                    75%     { transform: translateY(10px) translateX(-4px); }
                }
                @keyframes parachuteDrift2 {
                    0%,100% { transform: translateY(0px) translateX(0px); }
                    30%     { transform: translateY(-12px) translateX(-6px); }
                    70%     { transform: translateY(14px) translateX(4px); }
                }
            `}</style>
        </section>
    );
}