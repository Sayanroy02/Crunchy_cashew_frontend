'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ExternalLink, Zap, ShieldCheck } from 'lucide-react';
import { COLORS } from '@/constants/styles';
import SectionHeading from '@/components/ui/SectionHeading';
import { TrendingUp } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  image_url?: string;
  variants?: Array<{
    size: string;
    price: number;
    original_price: number;
    discount: number;
    stock: number;
    is_available: boolean;
  }>;
  marketplace_prices?: {
    amazon?: { price?: number; link?: string };
    flipkart?: { price?: number; link?: string };
    blinkit?: { price?: number; link?: string };
    swiggy?: { price?: number; link?: string };
  };
}

export default function ProductComparison({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Extract the first variant (usually 200g) as the baseline for comparison
  const variants = product.variants || [];
  const firstVariant = variants.length > 0 ? variants[0] : null;
  const compareSize = firstVariant ? firstVariant.size : '200g';

  // Base price for comparison (always the 200g variant)
  const basePrice = firstVariant ? firstVariant.price : product.price;

  const mp = product.marketplace_prices || {};

  const amazonPrice = mp.amazon?.price || 0;
  const flipkartPrice = mp.flipkart?.price || 0;
  const blinkitPrice = mp.blinkit?.price || 0;
  const jioPrice = mp.swiggy?.price || 0;

  if (amazonPrice === 0 && flipkartPrice === 0 && blinkitPrice === 0 && jioPrice === 0) {
    return null;
  }

  const platforms: Array<{
    name: string;
    logo: string;
    price: number;
    link?: string;
    isBest?: boolean;
    label?: string;
    logoClassName?: string;
  }> = [
      {
        name: 'OFFICIAL WEBSITE',
        logo: product.image_url || '/images/crunchy-cashews-product.png',
        price: basePrice,
        link: '#',
        isBest: true,
        label: 'FACTORY PRICE'
      },
      {
        name: 'AMAZON',
        logo: '/images/partners/amazon.png',
        price: amazonPrice,
        link: mp.amazon?.link
      },
      {
        name: 'BLINKIT',
        logo: '/images/partners/blinkit.png',
        price: blinkitPrice,
        link: mp.blinkit?.link
      },
      {
        name: 'FLIPKART',
        logo: '/images/partners/flipkart-logo.png',
        price: flipkartPrice,
        link: mp.flipkart?.link,
        logoClassName: 'scale-140'
      },
      {
        name: 'JIO MART',
        logo: '/images/partners/JioMart_logo.png',
        price: jioPrice,
        link: mp.swiggy?.link
      },
    ];

  const marketplacePrices = [amazonPrice, flipkartPrice, blinkitPrice, jioPrice].filter(p => p > 0);
  const minMpPrice = marketplacePrices.length > 0 ? Math.min(...marketplacePrices) : basePrice;
  const maxMpPrice = marketplacePrices.length > 0 ? Math.max(...marketplacePrices) : basePrice;

  const minSavingsPercent = minMpPrice > basePrice ? Math.round(((minMpPrice - basePrice) / minMpPrice) * 100) : 0;
  const maxSavingsPercent = maxMpPrice > basePrice ? Math.round(((maxMpPrice - basePrice) / maxMpPrice) * 100) : 0;

  const savingsString = minSavingsPercent === maxSavingsPercent 
    ? (maxSavingsPercent > 0 ? `${maxSavingsPercent}%` : '')
    : `${minSavingsPercent}% - ${maxSavingsPercent}%`;

  return (
    <div className="mt-16 space-y-12">
      <div className="text-center space-y-4">
        <SectionHeading
          text="Price Comparison"
          highlight={`for ${product.name} (${compareSize})`}
          className="text-2xl md:text-4xl"
        />
        <p className="text-slate-500 font-medium italic text-center">
          See how much you save by buying direct
        </p>
      </div>

      {/* Desktop view (HOMEPAGE style cards) */}
      <div className="hidden md:block relative">
        <div className="grid md:grid-cols-5 gap-6 px-2">
          {platforms.map((platform, idx) => {
            const isHovered = hoveredIdx === idx && !platform.isBest;
            const rupeesSaved = !platform.isBest ? platform.price - basePrice : 0;
            return (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.1 } }}
                onHoverStart={() => !platform.isBest && setHoveredIdx(idx)}
                onHoverEnd={() => setHoveredIdx(null)}
                className={`relative p-8 rounded-[2.5rem] flex flex-col items-center justify-between transition-all duration-75 ${platform.isBest
                  ? 'bg-white z-10 scale-105 border border-slate-200'
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

                <div className="w-24 h-24 relative mb-6">
                  <Image
                    src={platform.logo}
                    alt={platform.name}
                    fill
                    sizes="96px"
                    className={`object-contain ${platform.logoClassName || ''}`}
                  />
                </div>

                <div className="text-center space-y-3 w-full">
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
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[28px] font-black" style={{ color: COLORS.heading }}>₹{basePrice}</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter opacity-40">Factory Price</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        {/* Actual marketplace price */}
                        <span
                          className="text-[28px] font-black"
                          style={{ color: '#ef4444' }}
                        >
                          ₹{platform.price}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-black flex items-center gap-1 justify-center mt-1">
                          You save <span className="bg-green-600 text-white px-2 py-0.5 rounded-[4px] text-xs font-black">{Math.round((rupeesSaved / platform.price) * 100)}%</span> with us
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {platform.isBest ? (
                  <div className="mt-6 flex flex-col items-center">
                    {savingsString ? (
                      <>
                        <div className="bg-[#00863D] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-1">
                          Save
                        </div>
                        <span className="text-[24px] font-black text-[#00863D] leading-none">{savingsString}</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter opacity-40 mt-1">
                          Per Order
                        </span>
                      </>
                    ) : (
                      <span className="text-[16px] font-black text-[#00863D] uppercase">Best Price</span>
                    )}
                  </div>
                ) : platform.link ? (
                  <a
                    href={platform.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#] hover:underline"
                  >
                    View Store <ExternalLink size={10} />
                  </a>
                ) : (
                  <span className="mt-6 text-[10px] font-bold text-slate-300 uppercase italic tracking-tighter">
                    Link unavailable
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile view (HOMEPAGE style bubbles, fully responsive) */}
      <div className="md:hidden space-y-6">
        <div className="rounded-[3rem] p-6 shadow-sm border border-black/5 relative" style={{ backgroundColor: `${COLORS.black}05` }}>
          <div className="absolute top-6 right-8 opacity-10">
            <Zap size={64} style={{ color: COLORS.primary }} />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end pb-3" style={{ borderBottom: `1px solid ${COLORS.black}1A` }}>
              <span className="text-[11px] font-black uppercase tracking-widest text-black/50">Platform</span>
              <span className="text-[11px] font-black uppercase tracking-widest text-black/50">Their Price</span>
            </div>

            <div className="space-y-3">
              {platforms.map((p) => (
                <div
                  key={p.name}
                  className={`flex items-center justify-between p-4 rounded-[2.5rem] transition-all duration-300 ${p.isBest
                    ? 'bg-white shadow-xl border border-black/5'
                    : 'bg-black/5'
                    }`}
                >
                  <div className="flex items-center gap-3">
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
                          className={`object-contain p-0.5 ${p.logoClassName || ''}`}
                        />
                      </div>
                    )}
                    <span className="text-sm font-black text-black">
                      {p.isBest ? 'Official Website' : p.name.charAt(0) + p.name.slice(1).toLowerCase().split(' ')[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right flex flex-col items-end">
                      {p.isBest ? (
                        savingsString ? (
                          <>
                            <div className="bg-[#00863D] text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-1">
                              Save
                            </div>
                            <div className="text-[16px] font-black leading-none text-[#00863D]">
                              {savingsString}
                            </div>
                            <div className="text-[9px] font-black uppercase tracking-tighter opacity-30 text-black mt-1">
                              Per Order
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-[18px] font-black" style={{ color: COLORS.heading }}>₹{p.price}</div>
                            <div className="text-[9px] font-black uppercase tracking-tighter opacity-30 text-black">Factory Direct</div>
                          </>
                        )
                      ) : (
                        <>
                          <div className="text-[18px] font-black" style={{ color: '#ef4444' }}>₹{p.price}</div>
                          <div className="text-[9px] font-black uppercase tracking-tighter text-black flex items-center gap-1 justify-end mt-1">
                            save <span className="bg-green-600 text-white px-1.5 py-[2px] rounded-[3px] text-[11px]">{Math.round(((p.price - basePrice) / p.price) * 100)}%</span> with us
                          </div>
                        </>
                      )}
                    </div>

                    {!p.isBest && p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-full bg-white border border-black/5 flex items-center justify-center text-primary shadow-sm active:scale-95 transition-transform shrink-0"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
