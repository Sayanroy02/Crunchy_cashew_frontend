'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Factory, Globe, User, ArrowRight } from 'lucide-react';
import { COLORS } from '@/constants/styles';

export default function DirectAdvantage() {
  return (
    <section className="py-12 md:py-16 px-4 bg-bg-cream overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-10">

        <div className="text-center space-y-2">
          <h3 
            className="text-2xl md:text-3xl font-black tracking-tight"
            style={{ color: COLORS.heading }}
          >
            The Direct Advantage
          </h3>
          <p className="text-slate-500 font-medium text-sm md:text-base italic">Why our premium cashews cost less than marketplaces.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Our Flow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-6 md:p-8 border-2 flex flex-col justify-between space-y-8"
            style={{ backgroundColor: `${COLORS.primary}1A`, borderColor: `${COLORS.primary}4D` }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: COLORS.primary, color: COLORS.highlight }}
              >
                <Check size={20} strokeWidth={3} />
              </div>
              <div>
                <h4 className="text-lg font-black" style={{ color: COLORS.primary }}>Factory Direct</h4>
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: `${COLORS.primary}99` }}>No Middlemen. No Extra Charges.</p>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col items-center gap-2">
                <div 
                    className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center"
                    style={{ color: COLORS.primary }}
                >
                  <Factory size={28} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: COLORS.primary }}>Factory</span>
              </div>

              <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <ArrowRight size={18} style={{ color: COLORS.primary }} />
              </motion.div>

              <div className="flex flex-col items-center gap-2">
                <div 
                    className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center"
                    style={{ color: COLORS.primary }}
                >
                  <Globe size={28} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: COLORS.primary }}>Website</span>
              </div>

              <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}>
                <ArrowRight size={18} style={{ color: COLORS.primary }} />
              </motion.div>

              <div className="flex flex-col items-center gap-2">
                <div 
                    className="w-14 h-14 rounded-2xl shadow-md flex items-center justify-center text-white"
                    style={{ backgroundColor: COLORS.primary, boxShadow: `0 0 0 2px ${COLORS.primary}4D` }}
                >
                  <User size={28} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: COLORS.primary }}>You</span>
              </div>
            </div>

            <div className="p-3 rounded-xl text-center" style={{ backgroundColor: COLORS.primary }}>
              <p className="text-white text-[10px] font-bold uppercase tracking-widest">Best Price Guaranteed</p>
            </div>
          </motion.div>

          {/* Marketplace Flow */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-slate-200 flex flex-col justify-between space-y-8 opacity-70"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500">
                <X size={20} strokeWidth={3} />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-500">Marketplace Chain</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Extra markups at every step</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              {[
                { icon: Factory, label: 'Factory' },
                { icon: Globe, label: 'Distrib.' },
                { icon: Globe, label: 'Retail' },
                { icon: Globe, label: 'Apps' },
                { icon: User, label: 'You' },
              ].map((item, i, arr) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                      <item.icon size={18} />
                    </div>
                    <span className="text-[7px] font-bold uppercase tracking-tighter text-slate-400">{item.label}</span>
                  </div>
                  {i < arr.length - 1 && <ArrowRight size={10} className="text-slate-200" />}
                </React.Fragment>
              ))}
            </div>

            <div className="p-3 border-2 border-dashed border-red-200 rounded-xl text-center">
              <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">+ Platform Commissions</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}