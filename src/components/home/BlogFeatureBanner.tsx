'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const topics = [
  { label: '🍳 Recipe', color: '#FDC700' },
  { label: '💚 Health', color: '#5CB85C' },
  { label: '🌱 Sustainability', color: '#4CAF9A' },
];

export default function BlogFeatureBanner() {
  const [hovered, setHovered] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="py-4 pb-10 px-4 md:px-6 "
      aria-label="Write a Blog Contest Banner"
    >
      <div className="max-w-7xl mx-auto">
        {/* ── Thin Banner Card ── */}
        <div
          ref={bannerRef}
          className="relative flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 rounded-2xl overflow-hidden px-6 md:px-10 py-5 md:py-6"
          style={{
            background: 'linear-gradient(110deg, #0f0f0f 0%, #1a1a0f 50%, #0f0f0f 100%)',
            boxShadow: '0 8px 40px rgba(253,199,0,0.13), 0 2px 8px rgba(0,0,0,0.18)',
            border: '1px solid rgba(253,199,0,0.18)',
          }}
        >
          {/* ── Background shimmer dots ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff0d 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />

          {/* ── Gold accent glow top-right ── */}
          <div
            className="absolute -top-12 -right-12 w-44 h-44 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, #FDC70022 0%, transparent 70%)' }}
          />
          {/* ── Subtle green glow bottom-left ── */}
          <div
            className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, #4CAF9A18 0%, transparent 70%)' }}
          />

          {/* ── LEFT: Illustration ── */}
          <div className="relative z-10 flex-shrink-0 hidden sm:flex items-center justify-center">
            <Image
              src="/images/iLLUSTARTION-1.png"
              alt="Blog illustration"
              width={90}
              height={90}
              className="h-[72px] w-auto object-contain drop-shadow-lg"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(253,199,0,0.25))' }}
              priority={false}
            />
          </div>

          {/* ── CENTER: Text + Topics ── */}
          <div className="relative z-10 flex-1 flex flex-col sm:flex-row items-center sm:items-center gap-3 md:gap-6 text-center sm:text-left">
            {/* Text block */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border"
                  style={{ color: '#FDC700', borderColor: 'rgba(253,199,0,0.4)', backgroundColor: 'rgba(253,199,0,0.1)' }}
                >
                  🎁 Featured + Win a Gift Hamper
                </span>
              </div>
              <p className="text-white font-bold text-base md:text-lg leading-tight">
                Write a Blog. Get Featured.{' '}
                <span style={{ color: '#FDC700' }}>Win a Hamper!</span>
              </p>
              <p className="text-white/50 text-xs leading-relaxed max-w-xs sm:max-w-sm">
                Share your knowledge on recipes, health, or sustainability — we'll feature your blog on our site.
              </p>
            </div>

            {/* Topic chips */}
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              {topics.map((t) => (
                <span
                  key={t.label}
                  className="text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap"
                  style={{
                    backgroundColor: `${t.color}18`,
                    color: t.color,
                    border: `1px solid ${t.color}40`,
                  }}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: CTA Button ── */}
          <div className="relative z-10 flex-shrink-0">
            <Link
              href="/profile?tab=blogs"
              id="blog-feature-banner-cta"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap"
              style={{
                backgroundColor: hovered ? '#e6b300' : '#FDC700',
                color: '#0a0a0a',
                boxShadow: hovered
                  ? '0 6px 28px rgba(253,199,0,0.55)'
                  : '0 4px 18px rgba(253,199,0,0.35)',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
              }}
            >
              ✍️ Write a Blog
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.15)',
                  transform: hovered ? 'translateX(3px)' : 'translateX(0)',
                }}
              >
                <i className="fa-solid fa-arrow-right text-[10px]" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
