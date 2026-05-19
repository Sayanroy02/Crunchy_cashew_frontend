'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ExternalLink, Zap, ShieldCheck } from 'lucide-react';
import { COLORS } from '@/constants/styles';
import SectionHeading from '@/components/ui/SectionHeading';

interface Product {
  _id: string;
  name: string;
  price: number;
  marketplace_prices?: {
    amazon?: { price?: number; link?: string };
    flipkart?: { price?: number; link?: string };
    blinkit?: { price?: number };
    swiggy?: { price?: number };
  };
}

export default function ProductComparison({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  const mp = product.marketplace_prices || {};
  const platforms = [
    {
      name: 'Our Website',
      logo: '/images/crunchy-cashews-product.png',
      price: product.price,
      link: '#',
      isBest: true
    },
    {
      name: 'Amazon',
      logo: '/images/partners/amazon.jpg',
      price: mp.amazon?.price,
      link: mp.amazon?.link
    },
    {
      name: 'Flipkart',
      logo: '/images/partners/flipkart.png',
      price: mp.flipkart?.price,
      link: mp.flipkart?.link
    },
    {
      name: 'Blinkit',
      logo: '/images/partners/blinkit.png',
      price: mp.blinkit?.price,
      link: null
    },
    {
      name: 'Jio Mart',
      logo: '/images/partners/JioMart_logo.png',
      price: mp.swiggy?.price,
      link: null
    },
  ].filter(p => p.price);

  // Get other marketplaces with pricing (excluding "Our Website" / isBest)
  const otherMarketplaces = platforms.filter(p => !p.isBest && p.price !== undefined && p.price !== null);

  // Find the lowest price among them
  const lowestMarketplacePrice = otherMarketplaces.length > 0
    ? Math.min(...otherMarketplaces.map(p => p.price as number))
    : product.price;

  const savingsPerPack = Math.max(0, Math.round(lowestMarketplacePrice - product.price));
  const totalSavings = savingsPerPack * quantity;

  return (
    <div className="mt-16 space-y-12">
      <div className="text-center space-y-2">
        <SectionHeading text="Price" highlight="Comparison" className="text-3xl md:text-4xl" />
        <p className="text-slate-500 font-medium italic text-center">See how much you save by buying direct</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Comparison Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Price</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {platforms.map((p) => (
                  <tr key={p.name} className={`${p.isBest ? 'bg-white shadow-[inset_0_0_0_1px_rgba(246,176,0,0.1)]' : 'hover:bg-slate-50/50'} transition-colors`}>
                    <td className="px-6 py-5 flex items-center gap-3">
                      <div className="w-10 h-10 relative bg-white rounded-lg p-1 border border-slate-100">
                        <Image src={p.logo} alt={p.name} fill className="object-contain p-1" />
                      </div>
                      <div>
                        <span className={`font-bold text-sm`} style={{ color: p.isBest ? COLORS.primary : '#475569' }}>{p.name}</span>
                        {p.isBest && <span className="block text-[8px] font-black uppercase tracking-tighter" style={{ color: COLORS.primary }}>Best Price</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`text-lg font-black`} style={{ color: p.isBest ? COLORS.primary : '#94a3b8' }}>₹{p.price}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {p.link && p.link !== '#' ? (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                          View Store <ExternalLink size={12} />
                        </a>
                      ) : p.isBest ? (
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: COLORS.button }}>Cheapest Here</span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300 uppercase italic tracking-tighter">Link unavailable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Savings Calculator */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl p-8 text-white shadow-xl relative overflow-hidden" style={{ backgroundColor: COLORS.heading, boxShadow: `0 20px 25px -5px ${COLORS.heading}4D` }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />

            <div className="relative space-y-6">
              <div className="flex items-center gap-2" style={{ color: 'rgb(17, 17, 17)' }}>
                <i className="fa-solid fa-calculator text-base animate-pulse" style={{ color: 'rgba(255, 255, 255, 1)' }}></i>
                <h3 className="text-sm font-black uppercase tracking-widest" style={{ color: 'rgba(255, 254, 254, 1)' }}>Savings Calculator</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Minus size={18} />
                  </button>
                  <div className="text-center">
                    <span className="text-3xl font-black block leading-none">{quantity}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Packs</span>
                  </div>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg" style={{ backgroundColor: COLORS.button, color: COLORS.buttonText }}>
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 text-center">
                <p className="font-black uppercase tracking-[0.2em] text-[9px] mb-1" style={{ color: COLORS.highlight }}>Total Savings</p>
                <div className="overflow-hidden h-14 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={totalSavings}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ type: "spring", damping: 10, stiffness: 100 }}
                      className="text-5xl font-black"
                    >
                      ₹{totalSavings}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <p className="text-white/50 text-[10px] font-medium mt-2 italic px-4 leading-relaxed">Compared to buying from marketplaces at higher prices.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-3xl p-6 flex items-center gap-4 shadow-sm group transition-colors" style={{ borderColor: `${COLORS.heading}1A` }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${COLORS.heading}1A`, color: COLORS.heading }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: COLORS.heading }}>Factory Direct Price</p>
              <p className="text-[10px] text-slate-500 font-medium">No marketplace commissions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

