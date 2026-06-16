'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { COLORS } from '@/constants/styles';


export default function BlogFeatureBanner() {
  const [hovered, setHovered] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="py-4 md:py-8 px-4 md:px-6 bg-transparent"
      aria-label="Share a Recipe & Win a Gift Hamper Banner"
    >
      <div className="max-w-7xl mx-auto">
        {/* ── Thin Banner Card ── */}
        <div
          ref={bannerRef}
          className="relative flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 rounded-2xl overflow-hidden px-6 md:px-10 py-5 md:py-6"
          style={{
            background: `linear-gradient(135deg, ${COLORS.heading} 0%, #006b31 100%)`,
            boxShadow: `0 8px 40px rgba(0, 134, 61, 0.2), 0 2px 8px rgba(0,0,0,0.18)`,
            border: `1px solid rgba(255, 255, 255, 0.1)`,
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
              src="/images/chef-cook.png"
              alt="Chef sharing recipe"
              width={120}
              height={120}
              className="h-[120px] w-auto object-contain drop-shadow-lg"
              style={{ filter: 'drop-shadow(0 4px 16px rgba(253,199,0,0.3))' }}
              priority={false}
            />
          </div>

          {/* ── CENTER: Text ── */}
          <div className="relative z-10 flex-1 text-center sm:text-left">
            {/* Text block */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border"
                  style={{ color: '#FDC700', borderColor: 'rgba(253,199,0,0.4)', backgroundColor: 'rgba(253,199,0,0.1)' }}
                >
                  🎁 Share a Recipe + Win a Gift Hamper
                </span>
              </div>
              <p className="text-white font-bold text-base md:text-lg leading-tight">
                Made Something Delicious?{' '}
                <span style={{ color: '#FDC700' }}>Share Your Recipe & Win!</span>
              </p>
              <p className="text-white text-xs leading-relaxed max-w-xs sm:max-w-sm">
                Did you create a mouth-watering dish using Crunchy Cashews? Share your recipe with us to get featured on our site and win an exclusive gift hamper!
              </p>
            </div>
          </div>

          {/* ── RIGHT: CTA Button ── */}
          <div className="relative z-10 flex-shrink-0">
            <Link
              id="blog-feature-banner-cta"
              href="/profile?tab=blogs"
              className="group font-black px-6 py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 whitespace-nowrap transition-all hover:scale-105 active:scale-95 shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, #FFD54F 100%)`,
                color: '#000',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
              Submit Your Recipe
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="group-hover:translate-x-0.5 transition-transform">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
