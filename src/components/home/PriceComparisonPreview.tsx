'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { API } from '@/constants/api';

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
      name: 'SWIGGY INSTAMART',
      logo: '/images/partners/swiggy-instamart.png',
      price: mp.swiggy?.price || 520,
      label: 'MARKETPLACE MARKUP'
    },
  ];

  const marketplacePrices = [mp.amazon?.price, mp.flipkart?.price, mp.blinkit?.price, mp.swiggy?.price].filter(p => p) as number[];
  const avgMpPrice = marketplacePrices.length > 0 ? marketplacePrices[0] : 499;
  const savings = avgMpPrice - product.price;

  return (
    <section className="py-24 px-4 bg-bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* 1. HEADER */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A5246]/5 text-[#0A5246] text-xs font-black uppercase tracking-[3px]"
          >
            <Zap size={14} className="fill-[#0A5246]" />
            The Price Difference
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-[#0A5246] tracking-tight"
          >
            Buy Direct. <span className="relative inline-block">
              <span className="relative z-10">Save More.</span>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-1 md:bottom-2 left-0 h-3 md:h-4 bg-[#f6d70f] -z-0 opacity-80"
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium"
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
                    ? 'bg-white shadow-[0_30px_60px_-15px_rgba(10,82,70,0.25)] ring-4 ring-[#0A5246] z-10 scale-105'
                    : 'bg-white/60 shadow-xl shadow-slate-200/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 border border-slate-100'
                  }`}
              >
                {platform.isBest && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0A5246] text-[#f6d70f] text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg whitespace-nowrap">
                    Best Price
                  </div>
                )}

                <div className="w-32 h-32 relative mb-6">
                  <Image
                    src={platform.logo}
                    alt={platform.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="text-center space-y-4 w-full">
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${platform.isBest ? 'text-[#0A5246]' : 'text-slate-400'}`}>
                    {platform.name}
                  </p>
                  <div className="flex flex-col items-center gap-1">
                    {platform.isBest ? (
                      <div className="flex flex-col items-center">
                        <span className="text-4xl font-black text-[#0A5246]">₹{platform.price}</span>
                        <span className="text-[10px] font-bold text-[#99EA78] uppercase tracking-tighter">Factory Price</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-black text-slate-400 line-through decoration-red-500/50 decoration-2">₹{platform.price}</span>
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">Marketplace Markup</span>
                      </div>
                    )}
                  </div>
                </div>

                {platform.isBest && (
                  <div className="mt-6 flex items-center gap-2 text-[#0A5246] bg-[#99EA78]/20 px-4 py-1.5 rounded-full border border-[#99EA78]/30">
                    <span className="text-[10px] font-black tracking-widest uppercase truncate">Save ₹{savings} per pack</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Layout (Image 2 style) */}
        <div className="md:hidden space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-black text-[#0A5246] tracking-tight leading-tight">
              Direct Savings Preview
            </h2>
            <p className="text-black text-sm font-semibold italic leading-relaxed opacity-60">
              Same product, same quality, significantly lower price.
            </p>
          </div>

          <div className="bg-[#F0F4F4]/60 rounded-[3rem] p-8 shadow-sm border border-slate-100 relative">
            <div className="absolute top-6 right-8 opacity-10">
              <Zap size={64} className="text-[#0A5246]" />
            </div>

            <div className="space-y-10">
              {/* Product Info */}
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="relative w-52 h-52 bg-white rounded-3xl p-4 shadow-sm border border-slate-50 overflow-hidden">
                  <Image
                    src={product.image_url || '/images/crunchy-cashews-product.png'}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0A5246] max-w-[240px] leading-tight px-2">
                  {product.name}
                </h3>
                <div className="bg-[#99EA78] text-[#0A5246] text-[10px] font-black px-8 py-2.5 rounded-full uppercase tracking-[0.2em] shadow-sm">
                  Best Price Found
                </div>
              </div>

              {/* Pricing List */}
              <div className="space-y-8">
                <div className="flex justify-between items-end border-b border-[#0A5246]/10 pb-3">
                  <span className="text-[11px] font-black text-[#0A5246] uppercase tracking-widest">Platform</span>
                  <span className="text-[11px] font-black text-[#0A5246] uppercase tracking-widest">Price</span>
                </div>

                <div className="space-y-2">
                  {platforms.slice(0, 4).map((p) => (
                    <div
                      key={p.name}
                      className={`flex items-center justify-between p-5 rounded-[1.5rem] transition-all duration-300 ${p.isBest
                          ? "bg-white shadow-lg border border-slate-50 ring-1 ring-[#0A5246]/5 scale-[1.02]"
                          : "bg-transparent hover:bg-white/30"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        {p.isBest ? (
                          <div className="w-10 h-10 rounded-full bg-[#0A5246] flex items-center justify-center text-[#f6d70f]">
                            <Zap size={16} fill="#f6d70f" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 relative rounded-xl bg-white border border-slate-100 p-2 overflow-hidden shadow-sm">
                            <Image src={p.logo} alt={p.name} fill className="object-contain p-0.5" />
                          </div>
                        )}
                        <span className={`text-base font-black ${p.isBest ? 'text-[#0A5246]' : 'text-black'}`}>
                          {p.isBest ? 'Our Website' : p.name.charAt(0) + p.name.slice(1).toLowerCase().split(' ')[0]}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-black ${p.isBest ? 'text-[#0A5246]' : 'text-black'}`}>
                          ₹{p.price}
                        </div>
                        {p.isBest && (
                          <div className="text-[9px] font-black text-[#99EA78] uppercase tracking-tighter">Factory Direct</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#0A5246]/5 flex flex-col items-center gap-8">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-black opacity-40 uppercase tracking-[0.2em] mb-1">Estimated Savings</span>
                    <span className="text-4xl font-black text-[#0A5246]">Save ₹{savings}</span>
                    <span className="text-[10px] font-black text-black opacity-40 uppercase tracking-widest mt-1">Per Pack</span>
                  </div>

                  <Link
                    href={`/shop/${product._id}`}
                    className="w-full bg-[#0A5246] text-white px-10 py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-[#084239] transition-all shadow-xl shadow-[#0A5246]/20 active:scale-95"
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
