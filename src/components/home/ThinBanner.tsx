'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ThinBanner() {
  return (
    <div className="bg-[#0A5246] text-white py-2 md:py-3 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8">
        <div className="flex items-center gap-2 text-sm md:text-base font-bold">
          <CheckCircle2 size={18} className="text-[#99EA78] shrink-0" />
          <p className="tracking-tight text-center md:text-left">
            Same product. <span className="text-[#f6d70f]">Better price.</span> Direct from source.
          </p>
        </div>
        
        <Link 
          href="/shop" 
          className="group flex items-center gap-1.5 bg-[#f6d70f] text-[#0A5246] px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider hover:bg-white transition-all transform hover:scale-105"
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
