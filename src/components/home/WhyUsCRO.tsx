'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const points = [
    {
        icon: '🏭',
        label: 'Sourcing',
        ours: 'Direct from our own factory — zero middlemen',
        theirs: 'Passes through multiple middlemen',
    },
    {
        icon: '💰',
        label: 'Pricing',
        ours: 'Below market rate, always competitive',
        theirs: 'Inflated by supply chain markups',
    },
    {
        icon: '✅',
        label: 'Production',
        ours: 'Hygienic, food-grade certified facility',
        theirs: 'Unverified third-party standards',
    },
    {
        icon: '🏆',
        label: 'Kernel Quality',
        ours: 'Premium grade, uniformly white kernels',
        theirs: 'Inconsistent grades, mixed batches',
    },
];

function useInView(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setInView(true); },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return { ref, inView };
}

export default function ComparisonSection() {
    const { ref: headRef, inView: headIn } = useInView(0.2);

    return (
        <section
            className="relative py-2 md:py-2"
            style={{ background: '#FFFDF5' }}
        >
            <div className="max-w-5xl mx-auto px-4 md:px-8">

                {/* Header */}
                <div
                    ref={headRef}
                    className="text-center mb-10"
                    style={{
                        opacity: headIn ? 1 : 0,
                        transform: headIn ? 'translateY(0)' : 'translateY(18px)',
                        transition: 'opacity 0.6s ease, transform 0.6s ease',
                    }}
                >
                    <span
                        className="inline-block font-bold tracking-[4px] uppercase text-xs mb-2"
                        style={{ color: '#0A4F25' }}
                    >
                        Side by Side
                    </span>
                    <h2
                        className="text-3xl md:text-4xl font-black leading-tight"
                        style={{ color: '#1a1a1a' }}
                    >
                        Why{' '}
                        <span style={{ color: '#FDC700' }}>
                            Crunchy Cashews
                        </span>{' '}
                        wins
                    </h2>
                    <p className="mt-2 text-sm" style={{ color: '#777' }}>
                        Farm to pack. No detours. No compromise.
                    </p>
                </div>

                {/* Split card */}
                <SplitCard />

            </div>

            <style>{`
        @keyframes cc-left {
          from { opacity: 0; transform: translateX(-22px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes cc-right {
          from { opacity: 0; transform: translateX(22px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes cc-pop {
          0%   { transform: scale(0); }
          70%  { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        .cc-left  { animation: cc-left  0.5s cubic-bezier(.22,1,.36,1) both; }
        .cc-right { animation: cc-right 0.5s cubic-bezier(.22,1,.36,1) both; }
        .cc-pop   { animation: cc-pop   0.35s cubic-bezier(.34,1.56,.64,1) both; }
      `}</style>
        </section>
    );
}

function SplitCard() {
    const { ref, inView } = useInView(0.08);

    return (
        <div
            ref={ref}
            className="rounded-2xl overflow-hidden"
            style={{
                border: '2px solid #c8c2b4',
                boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
                opacity: inView ? 1 : 0,
                transition: 'opacity 0.3s ease',
            }}
        >
            {/* Column headers */}
            <div className="grid grid-cols-2">

                {/* Our header — green with logo */}
                <div
                    className="px-5 md:px-7 py-4 flex items-center gap-3"
                    style={{ background: '#0A4F25' }}
                >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1">
                        <Image
                            src="/images/cc-Logo-01-1.png"
                            alt="Crunchy Cashews Logo"
                            width={36}
                            height={36}
                            className="object-contain w-full h-full"
                        />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold tracking-[3px] uppercase" style={{ color: 'rgba(253,199,0,0.65)' }}>
                            Factory Direct
                        </p>
                        <p className="font-black text-sm leading-tight text-white">
                            Crunchy Cashews
                        </p>
                    </div>
                </div>

                {/* Their header */}
                <div
                    className="px-5 md:px-7 py-4 flex items-center gap-3"
                    style={{ background: '#ede8de', borderLeft: '2px solid #c8c2b4' }}
                >
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background: '#d8d2c6' }}
                    >
                        🏪
                    </div>
                    <div>
                        <p className="text-[9px] font-bold tracking-[3px] uppercase" style={{ color: '#1a1a1a' }}>
                            Via Middlemen
                        </p>
                        <p className="font-black text-sm leading-tight" style={{ color: '#1a1a1a' }}>
                            Other Brands
                        </p>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div style={{ height: '2px', background: 'linear-gradient(90deg, #0A4F25 50%, #c8c2b4 50%)' }} />

            {/* Rows */}
            {points.map((p, i) => (
                <CompareRow
                    key={p.label}
                    point={p}
                    index={i}
                    inView={inView}
                    isLast={i === points.length - 1}
                />
            ))}
        </div>
    );
}

function CompareRow({
    point,
    index,
    inView,
    isLast,
}: {
    point: typeof points[0];
    index: number;
    inView: boolean;
    isLast: boolean;
}) {
    const d = `${index * 85 + 100}ms`;
    const cd = `${index * 85 + 260}ms`;

    return (
        <div
            className="grid grid-cols-2"
            style={{ borderBottom: isLast ? 'none' : '1.5px solid #d4cfc4' }}
        >
            {/* Our side */}
            <div
                className={inView ? 'cc-left' : ''}
                style={{
                    animationDelay: d,
                    opacity: inView ? undefined : 0,
                    background: 'rgba(10,79,37,0.04)',
                    borderLeft: '3px solid #0A4F25',
                    padding: '16px 16px 16px 18px',
                }}
            >
                <div className="flex items-start gap-2.5">
                    <span
                        className={inView ? 'cc-pop' : ''}
                        style={{
                            animationDelay: cd,
                            flexShrink: 0,
                            marginTop: 3,
                            width: 19,
                            height: 19,
                            borderRadius: '50%',
                            background: '#0A4F25',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            fontWeight: 900,
                            color: '#FDC700',
                        }}
                    >
                        ✓
                    </span>
                    <div>
                        <p
                            className="text-[9px] font-black tracking-[2px] uppercase mb-1"
                            style={{ color: '#0A4F25', opacity: 0.75 }}
                        >
                            {point.icon} {point.label}
                        </p>
                        <p className="text-xs md:text-sm font-semibold leading-snug" style={{ color: '#1a1a1a' }}>
                            {point.ours}
                        </p>
                    </div>
                </div>
            </div>

            {/* Their side — darker text now */}
            <div
                className={inView ? 'cc-right' : ''}
                style={{
                    animationDelay: d,
                    opacity: inView ? undefined : 0,
                    background: '#f4f0e6',
                    borderLeft: '2px solid #c8c2b4',
                    padding: '16px',
                }}
            >
                <div className="flex items-start gap-2.5">
                    <span
                        style={{
                            flexShrink: 0,
                            marginTop: 3,
                            width: 19,
                            height: 19,
                            borderRadius: '50%',
                            background: '#ccc7bc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            fontWeight: 900,
                            color: '#fa003f',
                        }}
                    >
                        ✕
                    </span>
                    <div>
                        <p
                            className="text-[9px] font-black tracking-[2px] uppercase mb-1"
                            style={{ color: '#1a1a1a' }}
                        >
                            {point.label}
                        </p>
                        <p className="text-xs md:text-sm leading-snug" style={{ color: '#1a1a1a' }}>
                            {point.theirs}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}