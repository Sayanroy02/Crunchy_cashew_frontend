'use client';

import React, { useEffect, useRef, useState } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import { COLORS } from '@/constants/styles';

const platforms = [
    { name: 'Amazon', url: 'https://amazon.in', imgSrc: '/images/partners/amazon.jpg', containerBg: 'transparent', shadow: 'rgba(255,153,0,0.5)' },
    { name: 'Flipkart', url: 'https://flipkart.com', imgSrc: '/images/partners/flipkart.png', containerBg: '#2874F0', shadow: 'rgba(40,116,240,0.5)' },
    { name: 'blinkit', url: 'https://blinkit.com', imgSrc: '/images/partners/blinkit.png', containerBg: 'transparent', shadow: 'rgba(248,203,0,0.6)' },
    { name: 'Swiggy Instamart', url: 'https://swiggy.com/instamart', imgSrc: '/images/partners/swiggy-instamart.png', containerBg: '#0050FF', shadow: 'rgba(252,128,25,0.5)' },
];

type Phase = 'idle' | 'flying' | 'done';

export default function Affiliates() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [triggered, setTriggered] = useState(false);
    const [phase, setPhase] = useState<Phase>('idle');
    const [bannerVisible, setBannerVisible] = useState(false);
    const [logosVisible, setLogosVisible] = useState(false);
    const [productVisible, setProductVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        const timeouts: NodeJS.Timeout[] = [];
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !triggered) {
                setTriggered(true);
                setPhase('flying');
                // Banner & logos appear when plane is roughly mid-screen
                timeouts.push(setTimeout(() => setBannerVisible(true), 2200));
                timeouts.push(setTimeout(() => setLogosVisible(true), 2500));
                // Products reveal after plane exits (~5s)
                timeouts.push(setTimeout(() => setProductVisible(true), 4800));
                timeouts.push(setTimeout(() => setPhase('done'), 5200));
            }
        }, { threshold: 0.3 });
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => {
            obs.disconnect();
            timeouts.forEach(clearTimeout);
        };
    }, [triggered]);

    /* ── MOBILE: static ── */
    if (isMobile) {
        return (
            <div ref={sectionRef} style={{ padding: '20px 16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif' }}>We are also</p>
                        <SectionHeading text="Available" highlight="on" className="mb-0" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                        {platforms.map(p => (
                            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 54, height: 54, borderRadius: 12,
                                background: p.containerBg !== 'transparent' ? p.containerBg : 'rgba(255,255,255,0.7)',
                                border: '1px solid rgba(255,255,255,0.5)',
                                overflow: 'hidden', textDecoration: 'none',
                                boxShadow: `0 2px 10px ${p.shadow}`,
                            }}>
                                <img src={p.imgSrc} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    /* ── DESKTOP: continuous fly-through ── */
    return (
        <div ref={sectionRef} style={{ position: 'relative', width: '100%', height: 160, overflow: 'hidden' }}>
            <style>{`
                /* Plane flies from far left to far right in one smooth motion */
                @keyframes planeFly {
                    0%   { left: -18%; }
                    100% { left: 115%; }
                }

                /* Smoke puff particles trailing from plane */
                @keyframes smokePuff {
                    0%   { opacity: 0.7; transform: scale(0.4) translate(0, 0); }
                    100% { opacity: 0; transform: scale(2.2) translate(-28px, -14px); }
                }
                @keyframes smokePuff2 {
                    0%   { opacity: 0.55; transform: scale(0.3) translate(0, 0); }
                    100% { opacity: 0; transform: scale(1.8) translate(-22px, 10px); }
                }
                @keyframes smokePuff3 {
                    0%   { opacity: 0.4; transform: scale(0.5) translate(0, 0); }
                    100% { opacity: 0; transform: scale(2.5) translate(-34px, -4px); }
                }

                /* Banner / logos fade in */
                @keyframes bannerReveal {
                    from { opacity: 0; transform: translateY(8px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes logoPopIn {
                    0%   { opacity: 0; transform: scale(0.3) translateY(10px); }
                    65%  { transform: scale(1.12) translateY(-3px); }
                    85%  { transform: scale(0.96) translateY(1px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }

                /* Product image reveal */
                @keyframes productRevealLeft {
                    from { opacity: 0; transform: translateX(-24px) rotate(-2deg); }
                    to   { opacity: 0.92; transform: translateX(0px) rotate(-2deg); }
                }
                @keyframes productRevealRight {
                    from { opacity: 0; transform: scaleX(-1) translateX(-24px) rotate(3deg); }
                    to   { opacity: 0.88; transform: scaleX(-1) translateX(0px) rotate(3deg); }
                }

                .aff-logo:hover { transform: scale(1.1) translateY(-3px) !important; box-shadow: 0 8px 24px var(--sh) !important; }

                /* Smoke container tracks the plane position */
                .plane-wrapper {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-52%);
                    z-index: 5;
                    pointer-events: none;
                    will-change: left;
                }
                .plane-wrapper.is-flying {
                    animation: planeFly 5s cubic-bezier(0.25, 0.1, 0.55, 1) forwards;
                }

                .smoke-dot {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(200, 200, 200, 0.75);
                    pointer-events: none;
                }
                .smoke-dot.s1 {
                    width: 10px; height: 10px;
                    left: -6px; top: 52%;
                    animation: smokePuff 1.1s ease-out infinite;
                }
                .smoke-dot.s2 {
                    width: 7px; height: 7px;
                    left: -4px; top: 42%;
                    animation: smokePuff2 1.1s ease-out 0.28s infinite;
                }
                .smoke-dot.s3 {
                    width: 9px; height: 9px;
                    left: -10px; top: 58%;
                    animation: smokePuff3 1.1s ease-out 0.55s infinite;
                }
                .smoke-dot.s4 {
                    width: 6px; height: 6px;
                    left: -2px; top: 48%;
                    animation: smokePuff 1.4s ease-out 0.14s infinite;
                }
            `}</style>

            {/* ── Left product image ── */}
            <img
                src="/images/crunchy-cashews-product.png"
                alt="Crunchy Cashews"
                style={{
                    position: 'absolute',
                    left: 28,
                    bottom: 0,
                    height: 140,
                    width: 'auto',
                    objectFit: 'contain',
                    zIndex: 2,
                    opacity: productVisible ? 0.92 : 0,
                    transform: 'rotate(-2deg)',
                    transformOrigin: 'bottom center',
                    filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.12))',
                    animation: productVisible ? 'productRevealLeft 0.6s ease forwards' : 'none',
                    transition: 'opacity 0.3s',
                }}
            />

            {/* ── Right product image ── */}
            <img
                src="/images/crunchy-cashews-product.png"
                alt="Crunchy Cashews"
                style={{
                    position: 'absolute',
                    right: 28,
                    bottom: 0,
                    height: 150,
                    width: 'auto',
                    objectFit: 'contain',
                    zIndex: 2,
                    opacity: productVisible ? 0.88 : 0,
                    transformOrigin: 'bottom center',
                    filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.12))',
                    animation: productVisible ? 'productRevealRight 0.6s ease forwards' : 'none',
                    transition: 'opacity 0.3s',
                }}
            />

            {/* ── Plane with smoke trail ── */}
            <div className={`plane-wrapper${phase === 'flying' || phase === 'done' ? ' is-flying' : ''}`}>
                {/* Smoke dots (rendered left/behind the plane) */}
                <span className="smoke-dot s1" />
                <span className="smoke-dot s2" />
                <span className="smoke-dot s3" />
                <span className="smoke-dot s4" />

                <img
                    src="/images/Artboard-1-1000-copy-p-2000.png"
                    alt="Love at First Bite"
                    style={{
                        height: 108,
                        width: 'auto',
                        maxWidth: '80vw',
                        objectFit: 'contain',
                        display: 'block',
                        filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.16))',
                    }}
                />
            </div>

            {/* ── Centred content: label + logos ── */}
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
                zIndex: 3,
                pointerEvents: 'none',
            }}>
                {/* "Available on" text */}
                <div style={{
                    textAlign: 'center',
                    opacity: bannerVisible ? 1 : 0,
                    animation: bannerVisible ? 'bannerReveal 0.6s ease forwards' : 'none',
                    userSelect: 'none',
                }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif' }}>
                        We are also
                    </p>
                    <SectionHeading text="Available" highlight="on" className="mb-0" />
                </div>

                {/* Logo row */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    pointerEvents: 'auto',
                }}>
                    {platforms.map((p, i) => (
                        <a
                            key={p.name}
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Shop on ${p.name}`}
                            className="aff-logo"
                            style={{
                                '--sh': p.shadow,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 52,
                                height: 52,
                                borderRadius: 13,
                                flexShrink: 0,
                                background: p.containerBg !== 'transparent'
                                    ? p.containerBg
                                    : 'rgba(255,255,255,0.75)',
                                backdropFilter: p.containerBg === 'transparent' ? 'blur(10px)' : undefined,
                                border: '1.5px solid rgba(255,255,255,0.55)',
                                boxShadow: `0 4px 16px ${p.shadow}`,
                                overflow: 'hidden',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                opacity: logosVisible ? 1 : 0,
                                animation: logosVisible
                                    ? `logoPopIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.12}s both`
                                    : 'none',
                                transition: 'transform 0.22s ease, box-shadow 0.2s ease',
                            } as React.CSSProperties}
                        >
                            <img
                                src={p.imgSrc}
                                alt={p.name}
                                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                            />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}