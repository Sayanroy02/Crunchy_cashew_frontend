'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Brand colors from global CSS:
 * --color-yellow: #f6d70f
 * --color-amber:  #FBB21B
 * Gradient: #f6d70f → #FBB21B → #f97316 (yellow → amber → orange)
 */

const platforms = [
    {
        name: 'Amazon',
        url: 'https://amazon.in',
        shadow: 'rgba(255,153,0,0.5)',
        imgSrc: '/images/partners/amazon.jpg',
        containerBg: 'transparent',
        imgScale: '100%',
    },
    {
        name: 'Flipkart',
        url: 'https://flipkart.com',
        shadow: 'rgba(40,116,240,0.5)',
        imgSrc: '/images/partners/flipkart.png',
        containerBg: '#2874F0',
        imgScale: '75%',
    },
    {
        name: 'blinkit',
        url: 'https://blinkit.com',
        shadow: 'rgba(248,203,0,0.6)',
        imgSrc: '/images/partners/blinkit.png',
        containerBg: 'transparent',
        imgScale: '100%',
    },
    {
        name: 'Swiggy Instamart',
        url: 'https://swiggy.com/instamart',
        shadow: 'rgba(252,128,25,0.5)',
        imgSrc: '/images/partners/swiggy-instamart.png',
        containerBg: '#0050FF',
        imgScale: '78%',
    },
];

function Skel({ w, h, r = 8, delay = 0 }: { w: number | string; h: number; r?: number; delay?: number }) {
    return (
        <div style={{
            width: w, height: h, borderRadius: r, flexShrink: 0,
            background: 'linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.14) 50%, rgba(0,0,0,0.06) 75%)',
            backgroundSize: '400% 100%',
            animation: `affSkel 1.6s ease infinite ${delay}s`,
        }} />
    );
}

type Platform = typeof platforms[0];

function LogoIcon({ p, index, show, size }: { p: Platform; index: number; show: boolean; size: number }) {
    const [hov, setHov] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const r = size * 0.18;

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
                width: size, height: size, flexShrink: 0,
                borderRadius: r,
                background: p.containerBg !== 'transparent' ? p.containerBg : undefined,
                textDecoration: 'none', cursor: 'pointer',
                overflow: 'hidden',
                opacity: show ? 1 : 0,
                transform: show
                    ? (hov ? 'translateY(-5px) scale(1.12)' : 'translateY(0) scale(1)')
                    : 'scale(0.6) translateY(8px)',
                filter: hov
                    ? `drop-shadow(0 6px 18px ${p.shadow})`
                    : `drop-shadow(0 2px 6px ${p.shadow})`,
                transition: [
                    `opacity 0.4s cubic-bezier(0.22,1,0.36,1) ${show ? index * 0.1 : 0}s`,
                    `transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${show ? index * 0.1 : 0}s`,
                    'filter 0.25s ease',
                ].join(', '),
            }}
        >
            {!imgLoaded && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(90deg, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.05) 75%)',
                    backgroundSize: '400% 100%',
                    animation: `affSkel 1.5s ease infinite ${index * 0.1}s`,
                }} />
            )}
            <img
                src={p.imgSrc}
                alt={p.name}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgLoaded(true)}
                style={{
                    width: p.imgScale,
                    height: p.imgScale,
                    objectFit: 'contain',
                    display: 'block',
                    opacity: imgLoaded ? 1 : 0,
                    transition: 'opacity 0.25s ease',
                }}
            />
        </a>
    );
}

/**
 * SVG bg — yellow #f6d70f → amber #FBB21B → orange #f97316 gradient (left to right)
 * Green (#0A5246) organic accents at low opacity for brand tie-in
 */
const DesktopBg = () => (
    <svg
        aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 90"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <linearGradient id="bannerGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f6d70f" />
                <stop offset="50%" stopColor="#FBB21B" />
                <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
        </defs>

        {/* Gradient base */}
        <rect width="1200" height="90" fill="url(#bannerGrad)" />

        {/* Green organic blobs — tie back to brand primary */}
        <path d="M-10 0 Q55 -8 82 32 Q102 58 68 90 L0 90Z" fill="#0A5246" opacity="0.12" />
        <path d="M1125 0 Q1185 12 1210 52 Q1228 78 1200 90 L1118 90Z" fill="#0A5246" opacity="0.12" />

        {/* Subtle wave overlay for depth */}
        <path d="M0 60 Q300 30 600 55 Q900 80 1200 45 L1200 90 L0 90Z" fill="#ffffff" opacity="0.06" />

        {/* Green accent arcs */}
        <path d="M0 72 Q130 42 250 68" fill="none" stroke="#0A5246" strokeWidth="1.2" strokeLinecap="round" opacity="0.15" />
        <path d="M955 18 Q1075 42 1200 22" fill="none" stroke="#0A5246" strokeWidth="1.2" strokeLinecap="round" opacity="0.12" />

        {/* Dot grid */}
        {[80, 280, 480, 680, 880, 1080].map(x =>
            [20, 45, 70].map(y => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill="#0A5246" opacity="0.1" />
            ))
        )}

        {/* Cashew ellipse accents */}
        <ellipse cx="190" cy="45" rx="22" ry="13" transform="rotate(28 190 45)" fill="none" stroke="#0A5246" strokeWidth="1" opacity="0.08" />
        <ellipse cx="960" cy="30" rx="18" ry="11" transform="rotate(-22 960 30)" fill="none" stroke="#0A5246" strokeWidth="1" opacity="0.08" />

        {/* Bottom rule */}
        <line x1="0" y1="88" x2="1200" y2="88" stroke="#0A5246" strokeWidth="1.5" opacity="0.18" />
    </svg>
);

const MobileBg = () => (
    <svg
        aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 390 460"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            {/* Vertical gradient for mobile (top → bottom) */}
            <linearGradient id="bannerGradMob" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f6d70f" />
                <stop offset="55%" stopColor="#FBB21B" />
                <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
        </defs>

        <rect width="390" height="460" fill="url(#bannerGradMob)" />
        <path d="M-20 180 Q50 80 150 130 Q210 165 175 260 Q145 345 60 320 Q-15 295 -20 180Z" fill="#0A5246" opacity="0.1" />
        <path d="M240 -15 Q345 35 385 150 Q410 245 340 295 Q275 335 230 260 Q195 185 240 -15Z" fill="#0A5246" opacity="0.1" />

        {/* Wave overlay */}
        <path d="M0 320 Q100 290 200 310 Q300 330 390 305 L390 460 L0 460Z" fill="#ffffff" opacity="0.05" />

        <path d="M15 420 Q100 360 200 390 Q255 408 240 458" fill="none" stroke="#0A5246" strokeWidth="1.6" strokeLinecap="round" opacity="0.15" />
        <path d="M155 12 Q235 -16 318 28 Q365 55 352 108" fill="none" stroke="#0A5246" strokeWidth="1.6" strokeLinecap="round" opacity="0.12" />
        <ellipse cx="52" cy="60" rx="16" ry="10" transform="rotate(30 52 60)" fill="none" stroke="#0A5246" strokeWidth="1" opacity="0.08" />
        <ellipse cx="335" cy="285" rx="14" ry="9" transform="rotate(-20 335 285)" fill="none" stroke="#0A5246" strokeWidth="1" opacity="0.08" />
        {[55, 150, 245, 335].map(x =>
            [80, 185, 290, 395].map(y => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill="#0A5246" opacity="0.09" />
            ))
        )}
        <line x1="0" y1="457" x2="390" y2="457" stroke="#0A5246" strokeWidth="1.5" opacity="0.18" />
    </svg>
);

export default function Affiliates() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [triggered, setTriggered] = useState(false);
    const [phase, setPhase] = useState(0);
    const [deliveryReady, setDeliveryReady] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        const img = new Image();
        img.src = '/images/online-order.png';
        img.onload = () => setDeliveryReady(true);
        img.onerror = () => setDeliveryReady(true);
        const t = setTimeout(() => setDeliveryReady(true), 3000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !triggered) {
                setTriggered(true);
                setTimeout(() => setPhase(1), 0);
                setTimeout(() => setPhase(2), 300);
                setTimeout(() => setPhase(3), 700);
                setTimeout(() => setPhase(4), 950);
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
                @keyframes affDeliveryRoll {
                    0%   { transform: translateX(-110vw); opacity: 0.7; }
                    12%  { opacity: 1; }
                    100% { transform: translateX(0); }
                }
                @keyframes affFadeUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes affLogoPulse {
                    0%, 100% { filter: drop-shadow(0 2px 6px rgba(0,0,0,0.1)); }
                    50%      { filter: drop-shadow(0 4px 16px rgba(10,82,70,0.32)); }
                }
            `}</style>

            <div ref={sectionRef} style={{ width: '100%' }}>
                <div style={{
                    position: 'relative',
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: 0,
                    minHeight: isMobile ? 'auto' : 90,
                    clipPath: phase >= 1 ? undefined : 'inset(0 100% 0 0)',
                    animation: phase >= 1 ? 'affBannerSweep 0.55s cubic-bezier(0.22,1,0.36,1) forwards' : 'none',
                }}>

                    {isMobile ? <MobileBg /> : <DesktopBg />}

                    {/* ══ DESKTOP ══ */}
                    {!isMobile && (
                        <div style={{
                            position: 'relative', zIndex: 2,
                            display: 'flex', alignItems: 'center',
                            padding: '10px 20px',
                            gap: 12,
                            minHeight: 90,
                        }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
                                opacity: phase >= 3 ? 1 : 0,
                                animation: phase >= 3 ? 'affFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards' : 'none',
                            }}>
                                {phase < 3 ? (
                                    <>
                                        <Skel w={60} h={60} r={30} />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <Skel w={90} h={11} delay={0.06} />
                                            <Skel w={115} h={18} delay={0.13} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <img
                                            src="/images/cc-Logo-01-1.png"
                                            alt="Crunchy Cashews"
                                            style={{
                                                width: 80, height: 80, objectFit: 'contain', flexShrink: 0,
                                                animation: 'affLogoPulse 3s ease-in-out infinite',
                                            }}
                                        />
                                        <div>
                                            <p style={{ margin: 0, lineHeight: 1.25, fontSize: 17, fontWeight: 400, color: '#5c2d06' }}>
                                                We are also
                                            </p>
                                            <p style={{ margin: 0, lineHeight: 1.1, fontSize: 27, fontWeight: 900, color: '#0A5246' }}>
                                                Available on
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div style={{ flex: 1 }} />

                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                                {phase < 4
                                    ? platforms.map((_, i) => (
                                        <Skel key={i} w={logoSize} h={logoSize} r={logoSize * 0.18} delay={i * 0.1} />
                                    ))
                                    : platforms.map((p, i) => (
                                        <LogoIcon key={p.name} p={p} index={i} show={phase >= 4} size={logoSize} />
                                    ))
                                }
                            </div>

                            <div style={{
                                flexShrink: 0, marginLeft: 8, height: 90,
                                display: 'flex', alignItems: 'center',
                                opacity: phase >= 2 ? 1 : 0,
                                animation: phase >= 2 && phase < 5
                                    ? 'affDeliveryRoll 1.1s cubic-bezier(0.25,0.8,0.35,1) forwards'
                                    : 'none',
                                transform: phase >= 5 ? 'translateX(0)' : undefined,
                            }}>
                                {!deliveryReady
                                    ? <Skel w={100} h={80} r={8} />
                                    : (
                                        <img
                                            src="/images/online-order.png"
                                            alt="Order Delivery"
                                            style={{
                                                height: 90, width: 'auto', objectFit: 'contain',
                                                filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.12))',
                                                display: 'block',
                                            }}
                                        />
                                    )
                                }
                            </div>
                        </div>
                    )}

                    {/* ══ MOBILE ══ */}
                    {isMobile && (
                        <div style={{
                            position: 'relative', zIndex: 2,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center',
                            padding: '28px 16px 24px',
                            gap: 10,
                        }}>
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
                                            style={{ width: 88, height: 88, objectFit: 'contain', animation: 'affLogoPulse 3s ease-in-out infinite' }}
                                        />
                                    )
                                }
                            </div>

                            <div style={{
                                textAlign: 'center',
                                opacity: phase >= 3 ? 1 : 0,
                                animation: phase >= 3 ? 'affFadeUp 0.5s ease 0.1s forwards' : 'none',
                            }}>
                                {phase < 3 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                        <Skel w={120} h={14} delay={0.05} />
                                        <Skel w={160} h={26} delay={0.12} />
                                    </div>
                                ) : (
                                    <>
                                        <p style={{ margin: 0, fontSize: 18, fontWeight: 400, color: '#5c2d06' }}>We are also</p>
                                        <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: '#0A5246', letterSpacing: '0.02em' }}>AVAILABLE ON</p>
                                    </>
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 6 }}>
                                {phase < 4
                                    ? platforms.map((_, i) => <Skel key={i} w={logoSize} h={logoSize} r={logoSize * 0.18} delay={i * 0.1} />)
                                    : platforms.map((p, i) => (
                                        <LogoIcon key={p.name} p={p} index={i} show={phase >= 4} size={logoSize} />
                                    ))
                                }
                            </div>

                            <div style={{
                                marginTop: 8,
                                opacity: phase >= 2 ? 1 : 0,
                                animation: phase >= 2 && phase < 5
                                    ? 'affDeliveryRoll 1.1s cubic-bezier(0.25,0.8,0.35,1) forwards'
                                    : 'none',
                                transform: phase >= 5 ? 'translateX(0)' : undefined,
                            }}>
                                {!deliveryReady
                                    ? <Skel w={150} h={120} r={8} />
                                    : (
                                        <img
                                            src="/images/online-order.png"
                                            alt="Order Delivery"
                                            style={{ height: 130, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.12))', display: 'block' }}
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