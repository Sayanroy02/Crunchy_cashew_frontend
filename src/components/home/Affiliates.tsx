'use client';

import React, { useEffect, useRef, useState } from 'react';
import { API } from '@/constants/api';
/**
 * ANIMATION SEQUENCE
 * ─────────────────────────────────────────────────────────────────
 * 1. Banner background sweeps in (left → right clip-path)
 * 2. Delivery image enters from the LEFT edge and ROLLS across
 *    the banner to its final position on the FAR RIGHT.
 *    As it moves, it "uncovers" the content behind it:
 *      - Brand logo + text fade in from left
 *      - Platform logos pop in one by one (staggered)
 * 3. Delivery image settles on the right — no looping animation
 * ─────────────────────────────────────────────────────────────────
 */

const platforms = [
    {
        name: 'Amazon',
        url: 'https://amazon.in',
        shadow: 'rgba(255,153,0,0.55)',
        imgSrc: '/images/partners/amazon.jpg',
    },
    {
        name: 'Flipkart',
        url: 'https://flipkart.com',
        shadow: 'rgba(40,116,240,0.55)',
        imgSrc: '/images/partners/flipkart.png',
    },
    {
        name: 'blinkit',
        url: 'https://blinkit.com',
        shadow: 'rgba(248,203,0,0.65)',
        imgSrc: '/images/partners/blinkit.png',
    },
    {
        name: 'Swiggy Instamart',
        url: 'https://swiggy.com/instamart',
        shadow: 'rgba(252,128,25,0.55)',
        imgSrc: '/images/partners/swiggy-instamart.png',
    },
];

function Skel({ w, h, r = 10, delay = 0 }: { w: number | string; h: number; r?: number; delay?: number }) {
    return (
        <div style={{
            width: w, height: h, borderRadius: r, flexShrink: 0,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.15) 25%, rgba(255,255,255,0.42) 50%, rgba(255,255,255,0.15) 75%)',
            backgroundSize: '400% 100%',
            animation: `affSkel 1.6s ease infinite ${delay}s`,
        }} />
    );
}

type Platform = typeof platforms[0];

function LogoIcon({ p, index, show, size }: { p: Platform; index: number; show: boolean; size: number }) {
    const [hov, setHov] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Shop on ${p.name}`}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: size, height: size, flexShrink: 0, borderRadius: size * 0.22,
                textDecoration: 'none', cursor: 'pointer',
                overflow: 'hidden',
                opacity: show ? 1 : 0,
                transform: show
                    ? (hov ? 'translateY(-6px) scale(1.14)' : 'translateY(0) scale(1)')
                    : 'scale(0.55) translateY(10px)',
                filter: hov
                    ? `drop-shadow(0 8px 22px ${p.shadow})`
                    : `drop-shadow(0 2px 8px ${p.shadow})`,
                transition: [
                    `opacity 0.4s cubic-bezier(0.22,1,0.36,1) ${show ? index * 0.11 : 0}s`,
                    `transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${show ? index * 0.11 : 0}s`,
                    'filter 0.3s ease',
                ].join(', '),
            }}
        >
            {!imgLoaded && (
                <div style={{
                    position: 'absolute', inset: 0, borderRadius: size * 0.22,
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.2) 75%)',
                    backgroundSize: '400% 100%',
                    animation: `affSkel 1.5s ease infinite ${index * 0.12}s`,
                }} />
            )}
            <img
                src={p.imgSrc}
                alt={p.name}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgLoaded(true)}
                style={{
                    width: size, height: size, objectFit: 'contain', display: 'block',
                    opacity: imgLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                }}
            />
        </a>
    );
}

export default function Affiliates() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [triggered, setTriggered] = useState(false);
    const [phase, setPhase] = useState(0);
    const [bgReady, setBgReady] = useState(false);
    const [deliveryReady, setDeliveryReady] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        const load = (src: string, cb: () => void) => {
            const img = new Image(); img.src = src;
            img.onload = cb; img.onerror = cb;
        };
        load('/images/Frame.png', () => setBgReady(true));
        load('/images/online-order.png', () => setDeliveryReady(true));
        const t1 = setTimeout(() => setBgReady(true), 3000);
        const t2 = setTimeout(() => setDeliveryReady(true), 3000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !triggered) {
                setTriggered(true);
                // Phase 1: background banner sweeps in
                setTimeout(() => setPhase(1), 0);
                // Phase 2: delivery image starts rolling from left
                setTimeout(() => setPhase(2), 300);
                // Phase 3: brand logo + text appear (mid-roll)
                setTimeout(() => setPhase(3), 700);
                // Phase 4: platform logos pop in (delivery still rolling)
                setTimeout(() => setPhase(4), 950);
                // Phase 5: delivery settles on far right
                setTimeout(() => setPhase(5), 1300);
            }
        }, { threshold: 0.15 });
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, [triggered]);

    const logoSize = isMobile ? 60 : 68;

    return (
        <>
            <style>{`
                @keyframes affSkel {
                    0%   { background-position: 400% 0; }
                    100% { background-position: -400% 0; }
                }
                @keyframes affBannerSweep {
                    from { clip-path: inset(0 100% 0 0); }
                    to   { clip-path: inset(0 0% 0 0); }
                }
                @keyframes affBgReveal {
                    from { clip-path: inset(0 100% 0 0); }
                    to   { clip-path: inset(0 0% 0 0); }
                }
                /* Delivery rolls from left edge all the way to the right */
                @keyframes affDeliveryRoll {
                    0%   { transform: translateX(calc(-100vw)); opacity: 0.6; }
                    15%  { opacity: 1; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                @keyframes affFadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes affLogoPulse {
                    0%, 100% { filter: drop-shadow(0 2px 6px rgba(0,0,0,0.08)); }
                    50%      { filter: drop-shadow(0 4px 18px rgba(251,178,27,0.4)); }
                }
            `}</style>

            <div ref={sectionRef} style={{ width: '100%' }}>
                {/* ── Banner shell ── */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #fde8e2 0%, #fcd3c8 45%, #f8c0cc 100%)',
                    minHeight: isMobile ? 'auto' : 90,
                    clipPath: phase >= 1 ? undefined : 'inset(0 100% 0 0)',
                    animation: phase >= 1 ? 'affBannerSweep 0.55s cubic-bezier(0.22,1,0.36,1) forwards' : 'none',
                }}>

                    {/* Frame.png bg */}
                    {bgReady && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: 'url(/images/Frame.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            clipPath: phase >= 1 ? undefined : 'inset(0 100% 0 0)',
                            animation: phase >= 1 ? 'affBgReveal 0.7s cubic-bezier(0.22,1,0.36,1) forwards' : 'none',
                        }} />
                    )}

                    {/* Shimmer overlay while bg loads */}
                    {!bgReady && phase >= 1 && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.04) 75%)',
                            backgroundSize: '400% 100%',
                            animation: 'affSkel 1.8s ease infinite',
                        }} />
                    )}

                    {/* ══════════════════════════════════════
                        DESKTOP (≥640px)
                    ══════════════════════════════════════ */}
                    {!isMobile && (
                        <div style={{
                            position: 'relative', zIndex: 2,
                            display: 'flex', alignItems: 'center',
                            padding: '10px 20px 10px 20px',
                            gap: 12,
                            minHeight: 90,
                        }}>

                            {/* ── Brand logo + text — LEFT ── */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
                                opacity: phase >= 3 ? 1 : 0,
                                animation: phase >= 3 ? 'affFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards' : 'none',
                            }}>
                                {phase < 3
                                    ? <Skel w={58} h={58} r={29} />
                                    : (
                                        <img
                                            src="/images/cc-Logo-01-1.png"
                                            alt="Crunchy Cashews"
                                            style={{
                                                width: 80, height: 80, objectFit: 'contain', flexShrink: 0,
                                                animation: 'affLogoPulse 3s ease-in-out infinite',
                                            }}
                                        />
                                    )
                                }
                                {phase < 3
                                    ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <Skel w={90} h={11} delay={0.06} />
                                            <Skel w={115} h={18} delay={0.13} />
                                        </div>
                                    )
                                    : (
                                        <div>
                                            <p style={{
                                                margin: 0, lineHeight: 1.25,
                                                fontSize: 18, fontWeight: 400,
                                                color: '#6b3010',
                                            }}>
                                                We are also
                                            </p>
                                            <p style={{
                                                margin: 0, lineHeight: 1.1,
                                                fontSize: 28, fontWeight: 900,
                                                color: '#2d1200',
                                            }}>
                                                Available on
                                            </p>
                                        </div>
                                    )
                                }
                            </div>

                            {/* ── Spacer ── */}
                            <div style={{ flex: 1 }} />

                            {/* ── Platform logos — RIGHT ── */}
                            <div style={{
                                display: 'flex', alignItems: 'center',
                                gap: 10, flexShrink: 0,
                            }}>
                                {phase < 4
                                    ? platforms.map((_, i) => (
                                        <Skel key={i} w={logoSize} h={logoSize} r={logoSize * 0.22} delay={i * 0.1} />
                                    ))
                                    : platforms.map((p, i) => (
                                        <LogoIcon key={p.name} p={p} index={i} show={phase >= 4} size={logoSize} />
                                    ))
                                }
                            </div>

                            {/* ── Delivery image — FAR RIGHT, rolls in from left ── */}
                            <div style={{
                                flexShrink: 0,
                                marginLeft: 10,
                                height: 90,
                                display: 'flex', alignItems: 'center',
                                opacity: phase >= 2 ? 1 : 0,
                                animation: phase >= 2 && phase < 5
                                    ? 'affDeliveryRoll 1.1s cubic-bezier(0.25,0.8,0.35,1) forwards'
                                    : 'none',
                                transform: phase >= 5 ? 'translateX(0)' : undefined,
                            }}>
                                {!deliveryReady
                                    ? <Skel w={100} h={90} r={10} />
                                    : (
                                        <img
                                            src="/images/online-order.png"
                                            alt="Order Delivery"
                                            style={{
                                                height: 90, width: 'auto',
                                                objectFit: 'contain',
                                                filter: 'drop-shadow(0 3px 12px rgba(0,0,0,0.15))',
                                                display: 'block',
                                            }}
                                        />
                                    )
                                }
                            </div>

                        </div>
                    )}

                    {/* ══════════════════════════════════════
                        MOBILE (<640px) — stacked, matches reference image
                    ══════════════════════════════════════ */}
                    {isMobile && (
                        <div style={{
                            position: 'relative', zIndex: 2,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center',
                            padding: '28px 16px 24px',
                            gap: 10,
                        }}>
                            {/* Brand logo — top center */}
                            <div style={{
                                opacity: phase >= 3 ? 1 : 0,
                                animation: phase >= 3 ? 'affFadeUp 0.5s ease forwards' : 'none',
                            }}>
                                {phase < 3
                                    ? <Skel w={88} h={88} r={44} />
                                    : (
                                        <img
                                            src="/images/cc-Logo-01-1.png"
                                            alt="Crunchy Cashews"
                                            style={{
                                                width: 88, height: 88, objectFit: 'contain',
                                                animation: 'affLogoPulse 3s ease-in-out infinite',
                                            }}
                                        />
                                    )
                                }
                            </div>

                            {/* Text */}
                            <div style={{
                                textAlign: 'center',
                                opacity: phase >= 3 ? 1 : 0,
                                animation: phase >= 3 ? 'affFadeUp 0.5s ease 0.1s forwards' : 'none',
                            }}>
                                {phase < 3
                                    ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                            <Skel w={120} h={14} delay={0.05} />
                                            <Skel w={160} h={26} delay={0.12} />
                                        </div>
                                    )
                                    : (
                                        <>
                                            <p style={{ margin: 0, fontSize: 18, fontWeight: 400, color: '#6b3010', }}>
                                                We are also
                                            </p>
                                            <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: '#2d1200', letterSpacing: '0.03em' }}>
                                                AVAILABLE ON
                                            </p>
                                        </>
                                    )
                                }
                            </div>

                            {/* Platform logos — single row */}
                            <div style={{
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center',
                                gap: 12, flexWrap: 'wrap',
                                marginTop: 6,
                            }}>
                                {phase < 4
                                    ? platforms.map((_, i) => <Skel key={i} w={logoSize} h={logoSize} r={logoSize * 0.22} delay={i * 0.1} />)
                                    : platforms.map((p, i) => (
                                        <LogoIcon key={p.name} p={p} index={i} show={phase >= 4} size={logoSize} />
                                    ))
                                }
                            </div>

                            {/* Delivery image — bottom, rolls in from left */}
                            <div style={{
                                marginTop: 8,
                                opacity: phase >= 2 ? 1 : 0,
                                animation: phase >= 2 && phase < 5
                                    ? 'affDeliveryRoll 1.1s cubic-bezier(0.25,0.8,0.35,1) forwards'
                                    : 'none',
                                transform: phase >= 5 ? 'translateX(0)' : undefined,
                            }}>
                                {!deliveryReady
                                    ? <Skel w={160} h={130} r={10} />
                                    : (
                                        <img
                                            src="/images/online-order.png"
                                            alt="Order Delivery"
                                            style={{
                                                height: 130, width: 'auto',
                                                objectFit: 'contain',
                                                filter: 'drop-shadow(0 3px 12px rgba(0,0,0,0.15))',
                                                display: 'block',
                                            }}
                                        />
                                    )
                                }
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}