'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { COLORS } from '@/constants/styles';
import SectionHeading from '@/components/ui/SectionHeading';

// ─── Static data — no API needed ────────────────────────────────────────────
const OUR_PRICE = 199; // Our website price (reference)

const STATIC_PLATFORMS = [
  {
    name: 'OUR WEBSITE',
    logo: '/images/crunchy-cashews-product.png',
    isBest: true,
    label: 'FACTORY PRICE',
  },
  {
    name: 'AMAZON',
    logo: '/images/partners/amazon.jpg',
    higherPct: 15,   // +15% more expensive
    label: 'HIGHER RATE',
  },
  {
    name: 'FLIPKART',
    logo: '/images/partners/flipkart.png',
    higherPct: 15,
    label: 'HIGHER RATE',
  },
  {
    name: 'BLINKIT',
    logo: '/images/partners/blinkit.png',
    higherPct: 20,
    label: 'HIGHER RATE',
  },
  {
    name: 'JIO MART',
    logo: '/images/partners/JioMart_logo.png',
    higherPct: 20,
    label: 'HIGHER RATE',
  },
];

export default function PriceComparisonPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Parallax logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 50, damping: 20 });
  const springY = useSpring(y, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); setHoveredIdx(null); }}
      className="py-4 md:py-6 px-4 bg-bg-cream overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-12">
        {/* 1. HEADER */}
        <div className="text-center space-y-4">
          <SectionHeading text="Buy Direct." highlight="Save More." />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mx-auto font-medium"
            style={{ color: COLORS.black, opacity: 0.7 }}
          >
            Same premium cashews — lower price because you buy directly from the factory.
          </motion.p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block relative">
          <div className="grid md:grid-cols-5 gap-6 md:overflow-visible px-2">
            {STATIC_PLATFORMS.map((platform, idx) => {
              const isHovered = hoveredIdx === idx && !platform.isBest;
              return (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  onHoverStart={() => !platform.isBest && setHoveredIdx(idx)}
                  onHoverEnd={() => setHoveredIdx(null)}
                  className={`relative p-8 rounded-[2.5rem] flex flex-col items-center justify-between transition-all duration-300 ${
                    platform.isBest
                      ? 'bg-white z-10 scale-105'
                      : 'bg-white/60 shadow-xl shadow-slate-200/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 border border-slate-100'
                  }`}
                  style={
                    platform.isBest
                      ? {
                          boxShadow: `0 30px 60px -15px ${COLORS.primary}40, 0 0 0 4px ${COLORS.primary}`,
                        }
                      : isHovered
                      ? {
                          boxShadow: `0 20px 40px -10px ${COLORS.heading}30, 0 0 0 2px ${COLORS.heading}`,
                          borderColor: COLORS.heading,
                        }
                      : {}
                  }
                >
                  {platform.isBest && (
                    <div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg whitespace-nowrap"
                      style={{ backgroundColor: COLORS.heading, color: '#ffffff' }}
                    >
                      Best Price
                    </div>
                  )}

                  <div className="w-32 h-32 relative mb-6">
                    <Image
                      src={platform.logo}
                      alt={platform.name}
                      fill
                      sizes="128px"
                      className="object-contain"
                    />
                  </div>

                  <div className="text-center space-y-4 w-full">
                    <p
                      className="text-[10px] font-black uppercase tracking-[0.2em]"
                      style={{
                        color: platform.isBest
                          ? COLORS.primary
                          : isHovered
                          ? '#000000'
                          : '#94a3b8',
                      }}
                    >
                      {platform.name}
                    </p>
                    <div className="flex flex-col items-center gap-1">
                      {platform.isBest ? (
                        <div className="flex flex-col items-center">
                          <span className="text-[20px] font-black text-[#00863D]">Lowest Price</span>
                          <span className="text-[10px] font-bold uppercase tracking-tighter opacity-40">
                            Factory Price
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span
                            className="text-3xl font-black"
                            style={{ color: '#ef4444' }}
                          >
                            {platform.higherPct}%
                          </span>
                          <span className="text-[10px] font-bold opacity-45 uppercase tracking-tighter">
                            Higher Rate
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {platform.isBest && (
                    <div
                      className="mt-6 flex items-center gap-2 px-4 py-1.5 rounded-full border"
                      style={{
                        color: COLORS.heading,
                        backgroundColor: `${COLORS.heading}18`,
                        borderColor: `${COLORS.heading}40`,
                      }}
                    >
                      <span
                        className="text-[10px] font-black tracking-widest uppercase truncate"
                        style={{ color: COLORS.heading }}
                      >
                        Save 15% to 25% Per Order
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-6">
          <div
            className="rounded-[3rem] p-8 shadow-sm border border-black/5 relative"
            style={{ backgroundColor: `${COLORS.black}05` }}
          >
            <div className="absolute top-6 right-8 opacity-10">
              <Zap size={64} style={{ color: COLORS.primary }} />
            </div>

            <div className="space-y-10">
              <div className="space-y-8">
                <div
                  className="flex justify-between items-end pb-3"
                  style={{ borderBottom: `1px solid ${COLORS.black}1A` }}
                >
                  <span
                    className="text-[11px] font-black uppercase tracking-widest"
                    style={{ color: COLORS.black, opacity: 0.5 }}
                  >
                    Platform
                  </span>
                  <span
                    className="text-[11px] font-black uppercase tracking-widest"
                    style={{ color: COLORS.black, opacity: 0.5 }}
                  >
                    Rate Difference
                  </span>
                </div>

                <div className="space-y-2">
                  {STATIC_PLATFORMS.map((p) => (
                    <div
                      key={p.name}
                      className={`flex items-center justify-between p-5 rounded-[2.5rem] transition-all duration-300 ${
                        p.isBest
                          ? 'bg-white shadow-xl border border-black/5'
                          : 'bg-black/5'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {p.isBest ? (
                          <div className="w-10 h-10 relative rounded-full bg-white border border-black/5 overflow-hidden shadow-sm shrink-0 flex items-center justify-center">
                            <Image
                              src="/images/cc-Logo-01-1.png"
                              alt="Our Website"
                              fill
                              sizes="40px"
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 relative rounded-xl bg-white border border-black/5 p-2 overflow-hidden shadow-sm shrink-0">
                            <Image
                              src={p.logo}
                              alt={p.name}
                              fill
                              sizes="40px"
                              className="object-contain p-0.5"
                            />
                          </div>
                        )}
                        <span className="text-base font-black" style={{ color: COLORS.black }}>
                          {p.isBest
                            ? 'Our Website'
                            : p.name.charAt(0) + p.name.slice(1).toLowerCase().split(' ')[0]}
                        </span>
                      </div>
                      <div className="text-right">
                        <div
                          className={`${p.isBest ? 'text-[16px]' : 'text-lg'} font-black`}
                          style={{ color: p.isBest ? '#00863D' : '#ef4444' }}
                        >
                          {p.isBest ? 'Lowest Price' : `${p.higherPct}%`}
                        </div>
                        {p.isBest ? (
                          <div
                            className="text-[9px] font-black uppercase tracking-tighter opacity-30"
                            style={{ color: COLORS.black }}
                          >
                            Factory Direct
                          </div>
                        ) : (
                          <div className="text-[9px] font-black uppercase tracking-tighter opacity-40 text-red-500">
                            Higher Rate
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="pt-6 flex flex-col items-center gap-8"
                  style={{ borderTop: `1px solid ${COLORS.black}1A` }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-black opacity-30 uppercase tracking-[0.2em] mb-1">
                      Estimated Savings
                    </span>
                    <span className="text-4xl font-black" style={{ color: COLORS.heading }}>
                      Save 15%–25%
                    </span>
                    <span className="text-[10px] font-black text-black opacity-30 uppercase tracking-widest mt-1">
                      Per Order
                    </span>
                  </div>

                  <Link
                    href="/our-product"
                    className="w-full bg-green-700 text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2"
                  >
                    Shop Now <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}