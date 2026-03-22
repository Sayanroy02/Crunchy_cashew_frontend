'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ExternalLink, Zap, ShieldCheck } from 'lucide-react';

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
      name: 'Instamart',
      logo: '/images/partners/swiggy-instamart.png',
      price: mp.swiggy?.price,
      link: null
    },
  ].filter(p => p.price);

  const avgMarketplacePrice = platforms
    .filter(p => !p.isBest)
    .reduce((acc, p) => acc + (p.price || 0), 0) / (platforms.length - 1 || 1);

  const savingsPerPack = Math.max(0, Math.round(avgMarketplacePrice - product.price));
  const totalSavings = savingsPerPack * quantity;

  return (
    <div className="mt-16 space-y-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-[#0A5246] tracking-tight text-center">Price Comparison</h2>
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
                  <tr key={p.name} className={`${p.isBest ? 'bg-[#99EA78]/5' : 'hover:bg-slate-50/50'} transition-colors`}>
                    <td className="px-6 py-5 flex items-center gap-3">
                      <div className="w-10 h-10 relative bg-white rounded-lg p-1 border border-slate-100">
                        <Image src={p.logo} alt={p.name} fill className="object-contain p-1" />
                      </div>
                      <div>
                        <span className={`font-bold text-sm ${p.isBest ? 'text-[#0A5246]' : 'text-slate-600'}`}>{p.name}</span>
                        {p.isBest && <span className="block text-[8px] font-black text-[#0A5246] uppercase tracking-tighter">Best Price</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`text-lg font-black ${p.isBest ? 'text-[#0A5246]' : 'text-slate-400 line-through'}`}>₹{p.price}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {p.link && p.link !== '#' ? (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                          View Store <ExternalLink size={12} />
                        </a>
                      ) : p.isBest ? (
                        <span className="text-[10px] font-black text-[#99EA78] uppercase tracking-widest">Cheapest Here</span>
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
          <div className="bg-[#0A5246] rounded-3xl p-8 text-white shadow-xl shadow-[#0A5246]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />

            <div className="relative space-y-6">
              <div className="flex items-center gap-2 text-[#99EA78]">
                <Zap size={18} className="fill-[#99EA78]" />
                <h3 className="text-sm font-black uppercase tracking-widest">Savings Calculator</h3>
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
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-xl bg-[#f6d70f] text-[#0A5246] flex items-center justify-center hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-400/20">
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 text-center">
                <p className="text-[#99EA78] font-black uppercase tracking-[0.2em] text-[9px] mb-1">Total Savings</p>
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

          <div className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center gap-4 shadow-sm group hover:border-[#99EA78]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#99EA78]/10 flex items-center justify-center text-[#0A5246]">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-[#0A5246] uppercase tracking-widest">Factory Direct Price</p>
              <p className="text-[10px] text-slate-500 font-medium">No marketplace commissions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

