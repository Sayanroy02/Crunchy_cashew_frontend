'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Factory, Globe, User, ArrowRight, Minus, Plus, ShieldCheck, Zap, ShoppingCart } from 'lucide-react';

// Color Constants (Based on brand guidelines)
const COLORS = {
  primary: '#0A5246', // Dark Green
  secondary: '#f6d70f', // Yellow Accent
  accent: '#99EA78', // Light Green
  textMuted: '#64748b',
};

// Platforms Data
const platforms = [
  {
    name: 'Our Website',
    logo: '/images/crunchy-cashews-product.png',
    price: 399,
    isBest: true,
    badge: 'Direct Price',
  },
  {
    name: 'Amazon',
    logo: '/images/partners/amazon.jpg',
    price: 499,
  },
  {
    name: 'Flipkart',
    logo: '/images/partners/flipkart.png',
    price: 499,
  },
  {
    name: 'Blinkit',
    logo: '/images/partners/blinkit.png',
    price: 520,
  },
  {
    name: 'Swiggy Instamart',
    logo: '/images/partners/swiggy-instamart.png',
    price: 520,
  },
];

const SAVINGS_PER_PACK = 100;

export default function PriceComparisonSection() {
  const [quantity, setQuantity] = useState(1);

  const totalSavings = useMemo(() => quantity * SAVINGS_PER_PACK, [quantity]);

  return (
    <section className="py-20 px-4 bg-slate-50 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-20">
        
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

        {/* 2. PRICE COMPARISON STRIP */}
        <div className="relative">
          {/* Mobile Scroll Indicator */}
          <div className="md:hidden flex justify-center mb-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">
            Swipe to compare →
          </div>
          
          <div className="flex md:grid md:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible pb-8 md:pb-0 px-2 scrollbar-hide">
            {platforms.map((platform, idx) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className={`relative min-w-[240px] md:min-w-0 p-8 rounded-[2rem] flex flex-col items-center justify-between transition-all duration-300 ${
                  platform.isBest 
                  ? 'bg-white shadow-[0_30px_60px_-15px_rgba(10,82,70,0.25)] ring-4 ring-[#0A5246] z-10 scale-105' 
                  : 'bg-white/60 shadow-xl shadow-slate-200/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                }`}
              >
                {platform.isBest && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0A5246] text-[#f6d70f] text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-lg whitespace-nowrap">
                    Best Price
                  </div>
                )}
                
                <div className="w-28 h-28 relative mb-6">
                  <Image 
                    src={platform.logo} 
                    alt={platform.name} 
                    fill 
                    className="object-contain"
                  />
                </div>
                
                <div className="text-center space-y-2">
                  <p className={`text-xs font-black uppercase tracking-widest ${platform.isBest ? 'text-[#0A5246]' : 'text-slate-400'}`}>
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
                    <span className="text-[10px] font-black tracking-widest uppercase">Save ₹100 per pack</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. SAVINGS CALCULATOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl shadow-slate-200/50 relative overflow-hidden flex flex-col justify-center"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#f6d70f]/5 rounded-full -mr-40 -mt-40 blur-3xl" />
            
            <div className="relative space-y-10">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-[#0A5246] tracking-tight">How much will you save?</h3>
                <p className="text-slate-500 font-medium italic">Adjust the quantity to see your direct savings grow</p>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Select pack quantity</label>
                <div className="flex items-center gap-8">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-[#0A5246] hover:bg-[#99EA78]/20 transition-colors"
                  >
                    <Minus size={28} />
                  </motion.button>
                  <div className="relative">
                    <span className="text-6xl font-black text-[#0A5246] w-20 text-center block leading-none">{quantity}</span>
                    <span className="absolute -right-12 bottom-1 text-slate-300 font-black text-xl uppercase tracking-widest">Packs</span>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-16 h-16 rounded-2xl bg-[#0A5246] flex items-center justify-center text-white hover:bg-[#0A5246]/90 transition-colors shadow-xl shadow-[#0A5246]/20"
                  >
                    <Plus size={28} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-[#0A5246] rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-2xl shadow-[#0A5246]/30 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#99EA78]/10 rounded-full translate-x-1/2 translate-y-1/2" />
              <div className="absolute top-0 left-0 w-24 h-24 bg-[#f6d70f]/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>

            <p className="text-[#99EA78] font-black uppercase tracking-[0.4em] text-xs relative z-10">Total Direct Savings</p>
            
            <div className="relative z-10 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white/40">₹</span>
              <div className="overflow-hidden h-24 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={totalSavings}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 100 }}
                    className="text-7xl md:text-8xl font-black text-white tracking-tighter"
                  >
                    {totalSavings}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            
            <p className="text-white/60 font-medium text-sm relative z-10 max-w-[200px]">Money that stays in your pocket instead of paying for middlemen.</p>

            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-4 bg-[#99EA78] text-[#0A5246] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest relative z-10"
            >
              Smart Choice!
            </motion.div>
          </motion.div>
        </div>

        {/* 4. WHY WE ARE CHEAPER (VISUAL FLOW) */}
        <div className="space-y-12">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-black text-[#0A5246]">The Direct Advantage</h3>
            <p className="text-slate-500 font-medium">Why we can offer premium quality at lower prices.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
            {/* Our Flow */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-[#99EA78]/5 rounded-[2.5rem] p-10 border-2 border-[#99EA78]/20 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-[#0A5246] flex items-center justify-center text-[#f6d70f]">
                  <Check size={24} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-[#0A5246]">Our Direct Supply Chain</h4>
                  <p className="text-[10px] font-bold text-[#0A5246]/60 uppercase tracking-widest">Minimal Touchpoints</p>
                </div>
              </div>

              <div className="flex-grow flex items-center justify-between px-4 pb-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-[#0A5246] border border-white">
                    <Factory size={36} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0A5246]">Factory</span>
                </div>
                
                <motion.div 
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ArrowRight size={24} className="text-[#99EA78]" />
                </motion.div>
                
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-[#0A5246] border border-white">
                    <Globe size={36} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0A5246]">Website</span>
                </div>

                <motion.div 
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
                >
                  <ArrowRight size={24} className="text-[#99EA78]" />
                </motion.div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-3xl bg-[#0A5246] shadow-xl flex items-center justify-center text-white ring-4 ring-[#99EA78]/30">
                    <User size={36} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0A5246]">Customer</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-[#0A5246] rounded-2xl text-center">
                <p className="text-white text-xs font-bold uppercase tracking-widest">No Middlemen. No Extra Charges.</p>
              </div>
            </motion.div>

            {/* Marketplace Flow */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-100/50 rounded-[2.5rem] p-10 border-2 border-slate-200/50 flex flex-col opacity-60"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-500">
                  <X size={24} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-500 font-medium">Marketplace Chain</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Multiple Inflations</p>
                </div>
              </div>

              <div className="flex-grow flex flex-wrap items-center justify-center gap-4">
                {[
                  { icon: Factory, label: 'Factory' },
                  { icon: Globe, label: 'Distributor' },
                  { icon: Globe, label: 'Retailer' },
                  { icon: Globe, label: 'App Fees' },
                  { icon: User, label: 'Customer' },
                ].map((item, i, arr) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                         <item.icon size={24} />
                       </div>
                       <span className="text-[8px] font-bold uppercase tracking-tighter text-slate-400">{item.label}</span>
                    </div>
                    {i < arr.length - 1 && <ArrowRight size={14} className="text-slate-200" />}
                  </React.Fragment>
                ))}
              </div>

              <div className="mt-8 p-4 border-2 border-dashed border-red-200 rounded-2xl text-center">
                <p className="text-red-400 text-xs font-bold uppercase tracking-widest">Markups Added at Every Step</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 5. TRUST + CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] p-12 md:p-24 text-center overflow-hidden shadow-[0_50px_100px_-20px_rgba(10,82,70,0.3)]"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[#0A5246]">
             <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-white/5 to-transparent" />
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          </div>

          <div className="relative z-10 space-y-10">
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
                <ShieldCheck className="text-[#f6d70f]" size={24} />
                <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Pure. Fresh. Factory Direct.</span>
              </div>
              
              <h3 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[0.9]">
                Same product. <br/>
                <span className="text-[#f6d70f]">Better price.</span> <br/>
                Direct from source.
              </h3>
            </div>

            <p className="text-white/70 max-w-2xl mx-auto text-lg font-medium">
              Don't pay extra for marketplace convenience when you can get it fresher and cheaper directly from our roasting facility. 
              <span className="text-white font-bold ml-1">The smartest way to buy cashews.</span>
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-[#f6d70f] text-[#0A5246] px-12 py-6 rounded-2xl font-black text-xl flex items-center gap-4 shadow-[0_20px_40px_rgba(246,215,15,0.3)] transition-shadow hover:shadow-[0_25px_50px_rgba(246,215,15,0.5)]"
              >
                Buy Direct & Save More
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest">
                <ShoppingCart size={16} />
                Free Shipping on Orders over ₹500
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}