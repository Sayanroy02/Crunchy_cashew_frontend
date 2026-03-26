'use client';

import React, { useEffect, useRef, useState } from 'react';

const platforms = [
    { name: 'Amazon', url: 'https://amazon.in', imgSrc: '/images/partners/amazon.jpg', containerBg: 'transparent', shadow: 'rgba(255,153,0,0.5)' },
    { name: 'Flipkart', url: 'https://flipkart.com', imgSrc: '/images/partners/flipkart.png', containerBg: '#2874F0', shadow: 'rgba(40,116,240,0.5)' },
    { name: 'blinkit', url: 'https://blinkit.com', imgSrc: '/images/partners/blinkit.png', containerBg: 'transparent', shadow: 'rgba(248,203,0,0.6)' },
    { name: 'Swiggy Instamart', url: 'https://swiggy.com/instamart', imgSrc: '/images/partners/swiggy-instamart.png', containerBg: '#0050FF', shadow: 'rgba(252,128,25,0.5)' },
];

// Animation phases:
// idle → fly-in (plane enters from left, stops centre) → reveal (logos pop out one by one) → hold → fly-out (plane exits right)
type Phase = 'idle' | 'fly-in' | 'reveal' | 'hold' | 'fly-out' | 'done';

export default function Affiliates() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [triggered, setTriggered] = useState(false);
    const [phase, setPhase] = useState<Phase>('idle');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !triggered) {
                setTriggered(true);
                setPhase('fly-in');
                setTimeout(() => setPhase('reveal'), 1400); // plane stops → logos pop
                setTimeout(() => setPhase('hold'), 2600); // all logos visible
                setTimeout(() => setPhase('fly-out'), 3800); // plane exits right
                setTimeout(() => setPhase('done'), 5000); // settled
            }
        }, { threshold: 0.3 });
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, [triggered]);

    const planeAtCentre = phase === 'fly-in' || phase === 'reveal' || phase === 'hold';
    const logosVisible = phase === 'reveal' || phase === 'hold' || phase === 'fly-out' || phase === 'done';
    const planeFlyOut = phase === 'fly-out' || phase === 'done';
    const textVisible = phase === 'reveal' || phase === 'hold' || phase === 'fly-out' || phase === 'done';

    /* ── MOBILE: static, no animation ── */
    if (isMobile) {
        return (
            <div ref={sectionRef} style={{ padding: '20px 16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif' }}>We are also</p>
                        <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#000', fontFamily: 'Montserrat,sans-serif', lineHeight: 1.2 }}>Available on</p>
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

    /* ── DESKTOP: full animated strip ── */
    return (
        <div ref={sectionRef} style={{ position: 'relative', width: '100%', height: 175, overflow: 'hidden' }}>
            <style>{`
                @keyframes logoPopIn {
                    0%   { opacity: 0; transform: scale(0.3) translateY(10px); }
                    65%  { transform: scale(1.12) translateY(-3px); }
                    85%  { transform: scale(0.96) translateY(1px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes logoFadeOut {
                    from { opacity: 1; transform: scale(1); }
                    to   { opacity: 0; transform: scale(0.6) translateY(8px); }
                }
                @keyframes textFadeIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes textFadeOut {
                    from { opacity: 1; }
                    to   { opacity: 0; }
                }
                .aff-logo:hover { transform: scale(1.1) translateY(-3px) !important; box-shadow: 0 8px 24px var(--sh) !important; }
            `}</style>

            {/* ── Plane + banner image ── */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: phase === 'idle'
                    ? '-110%'
                    : planeFlyOut
                        ? '120%'
                        : '50%',
                transform: 'translate(-50%, -52%)',
                zIndex: 5,
                transition:
                    phase === 'fly-in'
                        ? 'left 1.4s cubic-bezier(0.18,0.82,0.32,1)'
                        : phase === 'fly-out'
                            ? 'left 1.1s cubic-bezier(0.55,0,0.9,0.5)'
                            : 'none',
                willChange: 'left',
                pointerEvents: 'none',
            }}>
                <img
                    src="/images/Artboard-1-1000-copy-p-2000.png"
                    alt="Love at First Bite"
                    style={{
                        height: 110,
                        width: 'auto',
                        maxWidth: '80vw',
                        objectFit: 'contain',
                        display: 'block',
                        filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.16))',
                    }}
                />
            </div>

            {/* ── Centred content column (text + logos) ── */}
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                zIndex: 3,
                pointerEvents: 'none',
            }}>
                {/* "Available on" label */}
                <div style={{
                    textAlign: 'center',
                    opacity: textVisible ? 1 : 0,
                    animation: textVisible ? 'textFadeIn 0.5s ease forwards' : 'none',
                    userSelect: 'none',
                }}>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif' }}>
                        We are also
                    </p>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#111', letterSpacing: '-0.02em', fontFamily: 'Montserrat,sans-serif', lineHeight: 1.1 }}>
                        Available on
                    </p>
                </div>

                {/* Logo row */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
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
                                width: 54,
                                height: 54,
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
                                // pop-in or fade-out
                                opacity: logosVisible ? 1 : 0,
                                animation: logosVisible
                                    ? `logoPopIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.12}s both`
                                    : planeFlyOut
                                        ? `logoFadeOut 0.3s ease ${i * 0.06}s both`
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
                </div> {/* end logo row */}
            </div> {/* end centred column */}
        </div>
    );
}