'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { COLORS } from '@/constants/styles';

export default function ThinBanner() {
  return (
    <div 
        className="text-white py-2 md:py-3 px-4 relative overflow-hidden"
        style={{ backgroundColor: COLORS.primary }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8">
        <div className="flex items-center gap-2 text-sm md:text-base font-bold">
          <CheckCircle2 size={18} style={{ color: `${COLORS.highlight}80` }} className="shrink-0" />
          <p className="tracking-tight text-center md:text-left">
            Same product. <span style={{ color: COLORS.highlight }}>Better price.</span> Direct from source.
          </p>
        </div>
        
        <Link 
          href="/shop" 
          className="group flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider transition-all transform hover:scale-105"
          style={{ backgroundColor: COLORS.button, color: COLORS.primary }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.button}
        >
          Shop Now
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      {/* Decorative pulse */}
      <motion.div 
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none"
      />
    </div>
  );
}
