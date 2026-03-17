'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// ─── Data ────────────────────────────────────────────────────────────────────

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
    icon: '🧪',
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
  {
    icon: '📦',
    label: 'Packaging',
    ours: 'Sealed freshness-lock packs, tamper-proof',
    theirs: 'Standard packaging, no freshness guarantee',
  },
  {
    icon: '🌿',
    label: 'Freshness',
    ours: 'Dispatched within days of roasting',
    theirs: 'Sits in warehouses for weeks',
  },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

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

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function ComparisonSection() {
  const { ref: headRef, inView: headIn } = useInView(0.2);

  return (
    <section
      className="py-10 md:py-10 px-4"
    // style={{ background: '#E1EDEB' }}
    >
      <div className="max-w-4xl mx-auto">

        {/* ── Page Heading ── */}
        <div
          ref={headRef}
          className="text-center mb-10 md:mb-14"
          style={{
            opacity: headIn ? 1 : 0,
            transform: headIn ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.65s ease, transform 0.65s ease',
          }}
        >
          <span
            className="inline-block text-xs font-black tracking-[5px] uppercase mb-3"
            style={{ color: '#0A5246', opacity: 0.6 }}
          >
            The Difference
          </span>
          <h2
            className="text-3xl md:text-4xl font-black leading-tight tracking-tight"
            style={{ color: '#0a1f1c' }}
          >
            Why We{' '}
            <span
              style={{
                color: '#0A5246',
                borderBottom: '4px solid #f6d70f',
                paddingBottom: 2,
              }}
            >
              Stand Out
            </span>
          </h2>
          <p className="mt-3 text-sm md:text-base max-w-md mx-auto" style={{ color: '#3d6560' }}>
            From farm to your hands — every step is ours to control.
          </p>
        </div>

        {/* ── DESKTOP: Side-by-side table (md and above) ── */}
        <DesktopTable />

        {/* ── MOBILE: Accordion cards (below md) ── */}
        <MobileAccordion />

      </div>

      <style>{`
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { transform: scale(0.4); opacity: 0; }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .anim-left  { animation: slideLeft  0.55s cubic-bezier(.22,1,.36,1) both; }
        .anim-right { animation: slideRight 0.55s cubic-bezier(.22,1,.36,1) both; }
        .anim-up    { animation: fadeUp     0.5s  cubic-bezier(.22,1,.36,1) both; }
        .anim-pop   { animation: popIn      0.4s  cubic-bezier(.34,1.56,.64,1) both; }

        .acc-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.35s cubic-bezier(.22,1,.36,1);
        }
        .acc-body.open {
          grid-template-rows: 1fr;
        }
        .acc-inner { overflow: hidden; }

        .acc-trigger-icon {
          transition: transform 0.3s cubic-bezier(.22,1,.36,1), color 0.3s;
        }
      `}</style>
    </section>
  );
}

// ─── Desktop Table ─────────────────────────────────────────────────────────────

function DesktopTable() {
  const { ref, inView } = useInView(0.08);

  return (
    <div
      ref={ref}
      className="hidden md:block rounded-3xl overflow-hidden"
      style={{
        boxShadow: '0 8px 48px rgba(10,82,70,0.13)',
        opacity: inView ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    >
      {/* ── Column Headers with Product Images ── */}
      <div className="grid grid-cols-2">

        {/* Our Brand */}
        <div
          className="flex flex-col items-center pb-6 pt-8 px-8"
          style={{ background: '#ffffff' }}
        >
          <div className="relative w-40 h-40 mb-4">
            <Image
              src="/images/crunchy-cashews-product.png"
              alt="Crunchy Cashews"
              fill
              className="object-contain drop-shadow-lg"
            />
          </div>
          <p className="text-xl font-black tracking-tight" style={{ color: '#0A5246' }}>
            Crunchy Cashews
          </p>
          <span
            className="mt-2 text-[9px] font-bold tracking-[3px] uppercase px-3 py-1 rounded-full"
            style={{ background: '#E1EDEB', color: '#0A5246' }}
          >
            Factory Direct
          </span>
        </div>

        {/* Other Brands */}
        <div
          className="flex flex-col items-center pb-6 pt-8 px-8"
          style={{ background: '#f5f0e6', borderLeft: '1.5px solid #ddd7cc' }}
        >
          <div className="relative w-40 h-40 mb-4">
            <Image
              src="/images/other-brands.png"
              alt="Other Brands"
              fill
              className="object-contain"
              style={{ filter: 'grayscale(25%) opacity(0.72)' }}
            />
          </div>
          <p className="text-xl font-black tracking-tight" style={{ color: '#4a4540' }}>
            Other Brands
          </p>
          <span
            className="mt-2 text-[9px] font-bold tracking-[3px] uppercase px-3 py-1 rounded-full"
            style={{ background: '#e8e2d8', color: '#6a6560' }}
          >
            Via Middlemen
          </span>
        </div>
      </div>

      {/* Gradient divider */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #0A5246 50%, #ddd7cc 50%)' }} />

      {/* Rows */}
      {points.map((p, i) => (
        <DesktopRow
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

function DesktopRow({
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
  const delay = `${index * 70 + 100}ms`;

  return (
    <div
      className="grid grid-cols-2"
      style={{ borderBottom: isLast ? 'none' : '1.5px solid #ede8df' }}
    >
      {/* Our side */}
      <div
        className={inView ? 'anim-left' : ''}
        style={{
          animationDelay: delay,
          opacity: inView ? undefined : 0,
          padding: '18px 24px',
          background: '#ffffff',
        }}
      >
        <div className="flex items-start gap-3">
          <span
            className={inView ? 'anim-pop' : ''}
            style={{
              animationDelay: `${index * 70 + 220}ms`,
              flexShrink: 0,
              marginTop: 2,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#0A5246',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 900,
              color: '#f6d70f',
            }}
          >
            ✓
          </span>
          <div>
            <p
              className="text-[9px] font-black tracking-[2.5px] uppercase mb-1"
              style={{ color: '#0A5246', opacity: 0.55 }}
            >
              {point.icon} {point.label}
            </p>
            <p className="text-sm font-semibold leading-snug" style={{ color: '#1a1f1c' }}>
              {point.ours}
            </p>
          </div>
        </div>
      </div>

      {/* Their side */}
      <div
        className={inView ? 'anim-right' : ''}
        style={{
          animationDelay: delay,
          opacity: inView ? undefined : 0,
          padding: '18px 24px',
          background: '#f9f5ed',
          borderLeft: '1.5px solid #ddd7cc',
        }}
      >
        <div className="flex items-start gap-3">
          <span
            style={{
              flexShrink: 0,
              marginTop: 2,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#e5e0d6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 900,
              color: '#cc2222',
            }}
          >
            ✕
          </span>
          <div>
            <p
              className="text-[9px] font-black tracking-[2.5px] uppercase mb-1"
              style={{ color: '#7a7068' }}
            >
              {point.label}
            </p>
            <p className="text-sm leading-snug" style={{ color: '#3a3530' }}>
              {point.theirs}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Accordion ──────────────────────────────────────────────────────────

function MobileAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, inView } = useInView(0.05);

  return (
    <div ref={ref} className="md:hidden flex flex-col gap-3">

      {/* Product image cards */}
      <div
        className={`grid grid-cols-2 gap-3 mb-2 ${inView ? 'anim-up' : ''}`}
        style={{ opacity: inView ? undefined : 0 }}
      >
        {/* Our product */}
        <div
          className="rounded-2xl flex flex-col items-center py-5 px-3"
          style={{
            background: '#ffffff',
            boxShadow: '0 2px 16px rgba(10,82,70,0.10)',
            border: '1.5px solid #c8e0da',
          }}
        >
          <div className="relative w-24 h-24 mb-3">
            <Image
              src="/images/crunchy-cashews-product.png"
              alt="Crunchy Cashews"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-xs font-black text-center" style={{ color: '#0A5246' }}>
            Crunchy Cashews
          </p>
          <span
            className="mt-1.5 text-[7px] font-bold tracking-[2px] uppercase px-2.5 py-1 rounded-full"
            style={{ background: '#E1EDEB', color: '#0A5246' }}
          >
            Factory Direct
          </span>
        </div>

        {/* Other brands */}
        <div
          className="rounded-2xl flex flex-col items-center py-5 px-3"
          style={{
            background: '#f5f0e6',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            border: '1.5px solid #ddd7cc',
          }}
        >
          <div className="relative w-24 h-24 mb-3">
            <Image
              src="/images/other-brands.png"
              alt="Other Brands"
              fill
              className="object-contain"
              style={{ filter: 'grayscale(25%) opacity(0.7)' }}
            />
          </div>
          <p className="text-xs font-black text-center" style={{ color: '#4a4540' }}>
            Other Brands
          </p>
          <span
            className="mt-1.5 text-[7px] font-bold tracking-[2px] uppercase px-2.5 py-1 rounded-full"
            style={{ background: '#e2ddd4', color: '#6a6560' }}
          >
            Via Middlemen
          </span>
        </div>
      </div>

      {/* Accordion rows */}
      {points.map((p, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={p.label}
            className={`rounded-2xl overflow-hidden ${inView ? 'anim-up' : ''}`}
            style={{
              animationDelay: `${i * 55 + 80}ms`,
              opacity: inView ? undefined : 0,
              boxShadow: isOpen
                ? '0 4px 22px rgba(10,82,70,0.15)'
                : '0 1px 6px rgba(0,0,0,0.05)',
              border: isOpen ? '1.5px solid #0A5246' : '1.5px solid #d4cfc4',
              background: '#ffffff',
              transition: 'box-shadow 0.3s, border-color 0.3s',
            }}
          >
            {/* Trigger */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left"
              style={{
                background: isOpen ? '#0A5246' : '#ffffff',
                transition: 'background 0.3s',
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base leading-none">{p.icon}</span>
                <span
                  className="text-sm font-black"
                  style={{ color: isOpen ? '#ffffff' : '#1a1f1c' }}
                >
                  {p.label}
                </span>
              </div>
              <span
                className="acc-trigger-icon text-xl font-black leading-none select-none"
                style={{
                  color: isOpen ? '#f6d70f' : '#0A5246',
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  display: 'inline-block',
                }}
              >
                +
              </span>
            </button>

            {/* Body */}
            <div className={`acc-body ${isOpen ? 'open' : ''}`}>
              <div className="acc-inner">

                {/* Our row */}
                <div
                  className="flex items-start gap-3 px-4 py-3.5"
                  style={{ borderTop: '1px solid #eee9e0', borderBottom: '1px dashed #ede8df' }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      marginTop: 2,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#0A5246',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 900,
                      color: '#f6d70f',
                    }}
                  >
                    ✓
                  </span>
                  <div>
                    <p
                      className="text-[8px] font-black tracking-[2px] uppercase mb-0.5"
                      style={{ color: '#0A5246', opacity: 0.6 }}
                    >
                      Crunchy Cashews
                    </p>
                    <p className="text-sm font-semibold leading-snug" style={{ color: '#1a1f1c' }}>
                      {p.ours}
                    </p>
                  </div>
                </div>

                {/* Their row */}
                <div
                  className="flex items-start gap-3 px-4 py-3.5"
                  style={{ background: '#f9f5ed' }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      marginTop: 2,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#e5e0d6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 900,
                      color: '#cc2222',
                    }}
                  >
                    ✕
                  </span>
                  <div>
                    <p
                      className="text-[8px] font-black tracking-[2px] uppercase mb-0.5"
                      style={{ color: '#7a7068' }}
                    >
                      Other Brands
                    </p>
                    <p className="text-sm leading-snug" style={{ color: '#3a3530' }}>
                      {p.theirs}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}