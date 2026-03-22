'use client';

import React, { useEffect, useRef, useState } from 'react';

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
        imgScale: '100%',
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
        imgScale: '96%',   // was 78% — now big
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
                padding: 0,
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

/** Rich green desktop banner background */
const DesktopBg = () => (
    <svg
        aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 90"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            {/* Main horizontal gradient */}
            <linearGradient id="bgMain" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#041f1a" />
                <stop offset="35%" stopColor="#063d34" />
                <stop offset="65%" stopColor="#0A5246" />
                <stop offset="100%" stopColor="#0d6b59" />
            </linearGradient>
            {/* Radial glow centre */}
            <radialGradient id="glow1" cx="72%" cy="50%" r="38%">
                <stop offset="0%" stopColor="#1a8c74" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#0A5246" stopOpacity="0" />
            </radialGradient>
            {/* Left glow */}
            <radialGradient id="glow2" cx="12%" cy="50%" r="28%">
                <stop offset="0%" stopColor="#0d6b59" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0A5246" stopOpacity="0" />
            </radialGradient>
            {/* Yellow accent glow top-right */}
            <radialGradient id="glowYellow" cx="92%" cy="10%" r="22%">
                <stop offset="0%" stopColor="#f6d70f" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#f6d70f" stopOpacity="0" />
            </radialGradient>
            <filter id="blur2" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" />
            </filter>
        </defs>

        {/* Base */}
        <rect width="1200" height="90" fill="url(#bgMain)" />
        <rect width="1200" height="90" fill="url(#glow1)" />
        <rect width="1200" height="90" fill="url(#glow2)" />
        <rect width="1200" height="90" fill="url(#glowYellow)" />

        {/* ── Diagonal stripe band ── */}
        {[-60, 60, 180, 300, 420, 540, 660, 780, 900, 1020, 1140, 1260].map((x, i) => (
            <line key={i}
                x1={x} y1="0" x2={x + 90} y2="90"
                stroke="#ffffff" strokeWidth="0.6" opacity="0.04"
            />
        ))}

        {/* ── Horizontal rule lines ── */}
        <line x1="0" y1="22" x2="1200" y2="22" stroke="#ffffff" strokeWidth="0.5" opacity="0.07" />
        <line x1="0" y1="67" x2="1200" y2="67" stroke="#ffffff" strokeWidth="0.5" opacity="0.07" />

        {/* ── Wave sweep ── */}
        <path d="M0 55 Q200 35 400 52 Q600 68 800 48 Q1000 28 1200 50 L1200 90 L0 90Z"
            fill="#ffffff" opacity="0.035" />
        <path d="M0 70 Q150 55 350 65 Q600 78 850 58 Q1050 42 1200 62 L1200 90 L0 90Z"
            fill="#ffffff" opacity="0.025" />

        {/* ── Left organic blob ── */}
        <path d="M-15 -5 Q40 -10 72 28 Q95 55 65 90 L0 90Z"
            fill="#f6d70f" opacity="0.08" />
        <path d="M-15 -5 Q40 -10 58 22 Q72 42 50 90 L0 90Z"
            fill="#ffffff" opacity="0.04" />

        {/* ── Right organic blob ── */}
        <path d="M1215 -5 Q1165 8 1140 42 Q1120 68 1148 90 L1200 90Z"
            fill="#f6d70f" opacity="0.08" />

        {/* ── Corner arc flourish left ── */}
        <path d="M0 90 Q35 55 80 38 Q120 24 165 35"
            fill="none" stroke="#f6d70f" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
        <path d="M0 90 Q28 62 65 48 Q100 36 140 42"
            fill="none" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.1" />

        {/* ── Corner arc flourish right ── */}
        <path d="M1200 0 Q1162 30 1120 44 Q1080 56 1040 50"
            fill="none" stroke="#f6d70f" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
        <path d="M1200 0 Q1168 25 1130 38 Q1095 50 1060 45"
            fill="none" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.1" />

        {/* ── Cashew-shape ellipses scattered ── */}
        <ellipse cx="310" cy="22" rx="28" ry="10" transform="rotate(18 310 22)"
            fill="none" stroke="#f6d70f" strokeWidth="1.2" opacity="0.14" />
        <ellipse cx="780" cy="68" rx="22" ry="8" transform="rotate(-14 780 68)"
            fill="none" stroke="#f6d70f" strokeWidth="1.2" opacity="0.12" />
        <ellipse cx="550" cy="40" rx="18" ry="7" transform="rotate(8 550 40)"
            fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.08" />
        <ellipse cx="1050" cy="28" rx="24" ry="9" transform="rotate(-20 1050 28)"
            fill="none" stroke="#f6d70f" strokeWidth="1" opacity="0.11" />

        {/* ── Dot grid (yellow + white mix) ── */}
        {[120, 240, 380, 500, 640, 760, 900, 1020, 1150].map((x, xi) =>
            [15, 45, 75].map((y, yi) => (
                <circle key={`${xi}-${yi}`} cx={x} cy={y} r="1.4"
                    fill={yi === 1 ? '#f6d70f' : '#ffffff'}
                    opacity={yi === 1 ? 0.12 : 0.07} />
            ))
        )}

        {/* ── Small star/cross accents ── */}
        {[200, 460, 700, 950].map((x, i) => (
            <g key={i} transform={`translate(${x}, ${i % 2 === 0 ? 18 : 72})`} opacity="0.15">
                <line x1="-4" y1="0" x2="4" y2="0" stroke="#f6d70f" strokeWidth="1.2" />
                <line x1="0" y1="-4" x2="0" y2="4" stroke="#f6d70f" strokeWidth="1.2" />
            </g>
        ))}

        {/* ── Bottom border rule ── */}
        <line x1="0" y1="88.5" x2="1200" y2="88.5" stroke="#f6d70f" strokeWidth="1.5" opacity="0.25" />
        {/* Top border rule */}
        <line x1="0" y1="1.5" x2="1200" y2="1.5" stroke="#ffffff" strokeWidth="1" opacity="0.08" />
    </svg>
);

const MobileBg = () => (
    <svg
        aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 390 400"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <linearGradient id="bgMainMob" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#041f1a" />
                <stop offset="40%" stopColor="#063d34" />
                <stop offset="75%" stopColor="#0A5246" />
                <stop offset="100%" stopColor="#0d6b59" />
            </linearGradient>
            <radialGradient id="glowMobC" cx="50%" cy="42%" r="52%">
                <stop offset="0%" stopColor="#1a8c74" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0A5246" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="glowMobTR" cx="88%" cy="8%" r="35%">
                <stop offset="0%" stopColor="#f6d70f" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#f6d70f" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="glowMobBL" cx="10%" cy="92%" r="35%">
                <stop offset="0%" stopColor="#f6d70f" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#f6d70f" stopOpacity="0" />
            </radialGradient>
        </defs>

        <rect width="390" height="400" fill="url(#bgMainMob)" />
        <rect width="390" height="400" fill="url(#glowMobC)" />
        <rect width="390" height="400" fill="url(#glowMobTR)" />
        <rect width="390" height="400" fill="url(#glowMobBL)" />

        {/* Diagonal stripes */}
        {[-80, 20, 120, 220, 320, 420].map((x, i) => (
            <line key={i} x1={x} y1="0" x2={x + 400} y2="400"
                stroke="#ffffff" strokeWidth="0.8" opacity="0.04" />
        ))}

        {/* Vertical rules */}
        <line x1="30" y1="0" x2="30" y2="400" stroke="#ffffff" strokeWidth="0.5" opacity="0.06" />
        <line x1="360" y1="0" x2="360" y2="400" stroke="#ffffff" strokeWidth="0.5" opacity="0.06" />

        {/* Horizontal rules */}
        <line x1="0" y1="90" x2="390" y2="90" stroke="#ffffff" strokeWidth="0.5" opacity="0.07" />
        <line x1="0" y1="310" x2="390" y2="310" stroke="#ffffff" strokeWidth="0.5" opacity="0.07" />

        {/* Wave sweeps */}
        <path d="M0 250 Q100 225 195 242 Q290 258 390 235 L390 400 L0 400Z" fill="#ffffff" opacity="0.03" />
        <path d="M0 290 Q80 268 195 280 Q310 292 390 270 L390 400 L0 400Z" fill="#ffffff" opacity="0.025" />

        {/* Corner blobs */}
        <path d="M-10 -10 Q55 5 75 65 Q88 110 50 145 Q15 175 -10 130Z" fill="#f6d70f" opacity="0.07" />
        <path d="M400 -10 Q340 10 322 68 Q308 112 338 148 Q368 180 400 145Z" fill="#f6d70f" opacity="0.07" />
        <path d="M-10 400 Q30 348 75 340 Q118 332 130 375 Q140 408 -10 410Z" fill="#ffffff" opacity="0.04" />
        <path d="M400 400 Q360 350 318 342 Q275 334 262 378 Q252 410 400 410Z" fill="#ffffff" opacity="0.04" />

        {/* Arc flourishes */}
        <path d="M10 380 Q80 310 155 290 Q225 272 275 300"
            fill="none" stroke="#f6d70f" strokeWidth="1.8" strokeLinecap="round" opacity="0.2" />
        <path d="M10 395 Q75 330 145 312 Q210 296 255 318"
            fill="none" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" opacity="0.1" />
        <path d="M380 20 Q310 80 240 95 Q175 108 145 82"
            fill="none" stroke="#f6d70f" strokeWidth="1.8" strokeLinecap="round" opacity="0.2" />
        <path d="M380 8 Q315 65 248 78 Q185 90 158 68"
            fill="none" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" opacity="0.1" />

        {/* Cashew ellipses */}
        <ellipse cx="68" cy="185" rx="32" ry="12" transform="rotate(35 68 185)"
            fill="none" stroke="#f6d70f" strokeWidth="1.3" opacity="0.15" />
        <ellipse cx="322" cy="210" rx="28" ry="10" transform="rotate(-28 322 210)"
            fill="none" stroke="#f6d70f" strokeWidth="1.3" opacity="0.13" />
        <ellipse cx="195" cy="350" rx="35" ry="11" transform="rotate(10 195 350)"
            fill="none" stroke="#ffffff" strokeWidth="0.9" opacity="0.08" />
        <ellipse cx="195" cy="55" rx="30" ry="10" transform="rotate(-5 195 55)"
            fill="none" stroke="#f6d70f" strokeWidth="1" opacity="0.1" />

        {/* Dot grid */}
        {[45, 130, 195, 260, 345].map((x, xi) =>
            [55, 135, 200, 270, 345].map((y, yi) => (
                <circle key={`${xi}-${yi}`} cx={x} cy={y} r="1.5"
                    fill={(xi + yi) % 3 === 0 ? '#f6d70f' : '#ffffff'}
                    opacity={(xi + yi) % 3 === 0 ? 0.13 : 0.07} />
            ))
        )}

        {/* Star/cross accents */}
        {[[60, 60], [330, 140], [55, 330], [335, 310], [195, 120], [195, 285]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x}, ${y})`} opacity="0.18">
                <line x1="-5" y1="0" x2="5" y2="0" stroke="#f6d70f" strokeWidth="1.4" />
                <line x1="0" y1="-5" x2="0" y2="5" stroke="#f6d70f" strokeWidth="1.4" />
            </g>
        ))}

        {/* Concentric rings */}
        <circle cx="195" cy="200" r="80" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.04" />
        <circle cx="195" cy="200" r="120" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.03" />

        {/* Border rules */}
        <line x1="0" y1="1.5" x2="390" y2="1.5" stroke="#ffffff" strokeWidth="1" opacity="0.08" />
        <line x1="0" y1="397.5" x2="390" y2="397.5" stroke="#f6d70f" strokeWidth="1.5" opacity="0.25" />
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

    // Slightly larger logo tiles so logos aren't cramped
    const logoSize = isMobile ? 64 : 72;

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
                            // ↓ reduced vertical padding (was 10px → 6px) so banner stays compact
                            padding: '6px 16px',
                            gap: 10,
                            minHeight: 90,
                        }}>
                            {/* Brand + text */}
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
                                                width: 76, height: 76, objectFit: 'contain', flexShrink: 0,
                                                animation: 'affLogoPulse 3s ease-in-out infinite',
                                            }}
                                        />
                                        <div>
                                            <p style={{ margin: 0, lineHeight: 1.25, fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                                                We are also
                                            </p>
                                            <p style={{ margin: 0, lineHeight: 1.1, fontSize: 26, fontWeight: 900, color: '#f6d70f', fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                                                Available on
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div style={{ flex: 1 }} />

                            {/* Platform logos */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                {phase < 4
                                    ? platforms.map((_, i) => (
                                        <Skel key={i} w={logoSize} h={logoSize} r={logoSize * 0.18} delay={i * 0.1} />
                                    ))
                                    : platforms.map((p, i) => (
                                        <LogoIcon key={p.name} p={p} index={i} show={phase >= 4} size={logoSize} />
                                    ))
                                }
                            </div>

                            {/* Delivery illustration */}
                            <div style={{
                                flexShrink: 0, marginLeft: 6, height: 90,
                                display: 'flex', alignItems: 'center',
                                opacity: phase >= 2 ? 1 : 0,
                                animation: phase >= 2 && phase < 5
                                    ? 'affDeliveryRoll 1.1s cubic-bezier(0.25,0.8,0.35,1) forwards'
                                    : 'none',
                                transform: phase >= 5 ? 'translateX(0)' : undefined,
                            }}>
                                {!deliveryReady
                                    ? <Skel w={90} h={76} r={8} />
                                    : (
                                        <img
                                            src="/images/online-order.png"
                                            alt="Order Delivery"
                                            style={{
                                                height: 86, width: 'auto', objectFit: 'contain',
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
                            // ↓ reduced padding (was 28/24 → 20/18)
                            padding: '20px 16px 18px',
                            gap: 8,
                        }}>
                            {/* Brand logo */}
                            <div style={{
                                opacity: phase >= 3 ? 1 : 0,
                                animation: phase >= 3 ? 'affFadeUp 0.5s ease forwards' : 'none',
                            }}>
                                {phase < 3
                                    ? <Skel w={80} h={80} r={40} />
                                    : (
                                        <img
                                            src="/images/cc-Logo-01-1.png"
                                            alt="Crunchy Cashews"
                                            style={{ width: 80, height: 80, objectFit: 'contain', animation: 'affLogoPulse 3s ease-in-out infinite' }}
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
                                {phase < 3 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                        <Skel w={120} h={14} delay={0.05} />
                                        <Skel w={160} h={26} delay={0.12} />
                                    </div>
                                ) : (
                                    <>
                                        <p style={{ margin: 0, fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>We are also</p>
                                        <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#f6d70f', letterSpacing: '0.02em', fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>AVAILABLE ON</p>
                                    </>
                                )}
                            </div>

                            {/* Platform logos */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                                {phase < 4
                                    ? platforms.map((_, i) => <Skel key={i} w={logoSize} h={logoSize} r={logoSize * 0.18} delay={i * 0.1} />)
                                    : platforms.map((p, i) => (
                                        <LogoIcon key={p.name} p={p} index={i} show={phase >= 4} size={logoSize} />
                                    ))
                                }
                            </div>

                            {/* Delivery illustration */}
                            <div style={{
                                marginTop: 6,
                                opacity: phase >= 2 ? 1 : 0,
                                animation: phase >= 2 && phase < 5
                                    ? 'affDeliveryRoll 1.1s cubic-bezier(0.25,0.8,0.35,1) forwards'
                                    : 'none',
                                transform: phase >= 5 ? 'translateX(0)' : undefined,
                            }}>
                                {!deliveryReady
                                    ? <Skel w={140} h={110} r={8} />
                                    : (
                                        <img
                                            src="/images/online-order.png"
                                            alt="Order Delivery"
                                            style={{ height: 118, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.12))', display: 'block' }}
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