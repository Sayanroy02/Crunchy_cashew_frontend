'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';
import SectionHeading from '@/components/ui/SectionHeading';

interface Product {
  _id: string;
  name: string;
  price: number;
  image_url: string;
  marketplace_prices?: {
    amazon?: { price?: number; link?: string };
    flipkart?: { price?: number; link?: string };
    blinkit?: { price?: number };
    swiggy?: { price?: number };
  };
}

export default function PriceComparisonPreview() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API.PRODUCTS}?limit=1`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProduct(data[0]);
        } else if (data && !Array.isArray(data)) {
          setProduct(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !product) return null;

  const mp = product.marketplace_prices || {};
  const platforms = [
    {
      name: 'OUR WEBSITE',
      logo: product.image_url || '/images/crunchy-cashews-product.png',
      price: product.price,
      isBest: true,
      label: 'FACTORY PRICE',
      savingsLabel: 'SAVE ₹100 PER PACK'
    },
    {
      name: 'AMAZON',
      logo: '/images/partners/amazon.jpg',
      price: mp.amazon?.price || 499,
      label: 'MARKETPLACE MARKUP'
    },
    {
      name: 'FLIPKART',
      logo: '/images/partners/flipkart.png',
      price: mp.flipkart?.price || 499,
      label: 'MARKETPLACE MARKUP'
    },
    {
      name: 'BLINKIT',
      logo: '/images/partners/blinkit.png',
      price: mp.blinkit?.price || 520,
      label: 'MARKETPLACE MARKUP'
    },
    {
      name: 'JIO MART',
      logo: '/images/partners/JioMart_logo.png',
      price: mp.swiggy?.price || 520,
      label: 'MARKETPLACE MARKUP'
    },
  ];

  const marketplacePrices = [mp.amazon?.price, mp.flipkart?.price, mp.blinkit?.price, mp.swiggy?.price].filter(p => p) as number[];
  const avgMpPrice = marketplacePrices.length > 0 ? marketplacePrices[0] : 499;
  const savings = avgMpPrice - product.price;

  return (
    <section className="py-4 md:py-6 px-4 bg-bg-cream overflow-hidden relative">

      {/* ── Left corner fruit — desktop only, anchored to heading area ── */}
      <div className="hidden md:block absolute left-0 top-0 w-28 lg:w-36 pointer-events-none select-none z-10">
        <Image
          src="/images/Fruit-3.png"
          alt=""
          width={144}
          height={220}
          className="object-contain object-top w-full h-auto -translate-x-8"
          aria-hidden="true"
        />
      </div>

      <div className="max-w-7xl mx-auto space-y-16">
        {/* 1. HEADER */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[3px]"
            style={{ backgroundColor: `${COLORS.primary}0D`, color: COLORS.primary }}
          >
            {/* <Zap size={14} className="fill-[#0A5246]" /> */}
            {/* The Price Difference */}
          </motion.div>

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

        {/* Desktop Layout (Enhanced User Design) */}
        <div className="hidden md:block relative">
          <div className="grid md:grid-cols-5 gap-6 md:overflow-visible px-2">
            {platforms.map((platform, idx) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className={`relative p-8 rounded-[2.5rem] flex flex-col items-center justify-between transition-all duration-300 ${platform.isBest
                  ? 'bg-white z-10 scale-105'
                  : 'bg-white/60 shadow-xl shadow-slate-200/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 border border-slate-100'
                  }`}
                style={platform.isBest ? {
                  boxShadow: `0 30px 60px -15px ${COLORS.primary}40, 0 0 0 4px ${COLORS.primary}`
                } : {}}
              >
                {platform.isBest && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg whitespace-nowrap"
                    style={{ backgroundColor: COLORS.black, color: COLORS.primary }}
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
                    className={`text-[10px] font-black uppercase tracking-[0.2em]`}
                    style={{ color: platform.isBest ? COLORS.primary : '#94a3b8' }}
                  >
                    {platform.name}
                  </p>
                  <div className="flex flex-col items-center gap-1">
                    {platform.isBest ? (
                      <div className="flex flex-col items-center">
                        <span className="text-4xl font-black" style={{ color: COLORS.black }}>₹{platform.price}</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter opacity-40">Factory Price</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-black opacity-20 line-through decoration-black/50 decoration-2">₹{platform.price}</span>
                        <span className="text-[10px] font-bold opacity-30 uppercase tracking-tighter">Marketplace Markup</span>
                      </div>
                    )}
                  </div>
                </div>

                {platform.isBest && (
                  <div
                    className="mt-6 flex items-center gap-2 px-4 py-1.5 rounded-full border"
                    style={{ color: COLORS.primary, backgroundColor: `${COLORS.primaryLight}33`, borderColor: `${COLORS.primaryLight}4D` }}
                  >
                    <span className="text-[10px] font-black tracking-widest uppercase truncate">Save ₹{savings} per pack</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Layout (Image 2 style) */}
        <div className="md:hidden space-y-6">

          <div className="rounded-[3rem] p-8 shadow-sm border border-black/5 relative" style={{ backgroundColor: `${COLORS.black}05` }}>
            <div className="absolute top-6 right-8 opacity-10">
              <Zap size={64} style={{ color: COLORS.primary }} />
            </div>

            <div className="space-y-10">
              {/* Product Info */}
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="relative w-52 h-52 bg-white rounded-3xl p-4 shadow-sm border border-black/5 overflow-hidden">
                  <Image
                    src={product.image_url || '/images/crunchy-cashews-product.png'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain p-2"
                  />
                </div>
                <h3
                  className="text-2xl font-extrabold max-w-[240px] leading-tight px-2"
                  style={{ color: COLORS.black }}
                >
                  {product.name}
                </h3>
                <div
                  className="text-[10px] font-black px-8 py-2.5 rounded-full uppercase tracking-[0.2em] shadow-sm"
                  style={{ backgroundColor: COLORS.primary, color: COLORS.black }}
                >
                  Best Price Found
                </div>
              </div>

              {/* Pricing List */}
              <div className="space-y-8">
                <div className="flex justify-between items-end pb-3" style={{ borderBottom: `1px solid ${COLORS.black}1A` }}>
                  <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: COLORS.black, opacity: 0.5 }}>Platform</span>
                  <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: COLORS.black, opacity: 0.5 }}>Price</span>
                </div>

                <div className="space-y-2">
                  {platforms.slice(0, 4).map((p) => (
                    <div
                      key={p.name}
                      className={`flex items-center justify-between p-5 rounded-[2.5rem] transition-all duration-300 ${p.isBest
                        ? "bg-white shadow-xl border border-black/5"
                        : "bg-black/5"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        {p.isBest ? (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: COLORS.black, color: COLORS.primary }}
                          >
                            <Zap size={16} fill={COLORS.primary} />
                          </div>
                        ) : (
                          <div className="w-10 h-10 relative rounded-xl bg-white border border-black/5 p-2 overflow-hidden shadow-sm shrink-0">
                            <Image src={p.logo} alt={p.name} fill sizes="40px" className="object-contain p-0.5" />
                          </div>
                        )}
                        <span
                          className={`text-base font-black`}
                          style={{ color: COLORS.black }}
                        >
                          {p.isBest ? 'Our Website' : p.name.charAt(0) + p.name.slice(1).toLowerCase().split(' ')[0]}
                        </span>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-xl font-black`}
                          style={{ color: COLORS.black }}
                        >
                          ₹{p.price}
                        </div>
                        {p.isBest && (
                          <div className="text-[9px] font-black uppercase tracking-tighter opacity-30" style={{ color: COLORS.black }}>Factory Direct</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 flex flex-col items-center gap-8" style={{ borderTop: `1px solid ${COLORS.black}1A` }}>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-black opacity-30 uppercase tracking-[0.2em] mb-1">Estimated Savings</span>
                    <span className="text-4xl font-black" style={{ color: COLORS.black }}>Save ₹{savings}</span>
                    <span className="text-[10px] font-black text-black opacity-30 uppercase tracking-widest mt-1">Per Pack</span>
                  </div>

                  <Link
                    href={`/shop/${product._id}`}
                    className="w-full text-white px-10 py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95"
                    style={{ backgroundColor: COLORS.black, color: COLORS.primary }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS.primary}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = COLORS.black}
                  >
                    Full Comparison Table <ChevronRight size={20} />
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