'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AnimatedFlyingImage() {
  return (
    <div className="relative w-full overflow-hidden py-2 md:py-8">
      <div className="max-w-7xl mx-auto px-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0, x: -100, rotate: -5 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 1.2, // Slightly longer for a smoother "settle"
            ease: [0.16, 1, 0.3, 1],
            delay: 0.1
          }}
          className="relative w-full max-w-5xl"
        >
          {/* Desktop Image */}
          <div className="hidden md:block">
            <Image
              src="/images/Artboard-1-1000-copy-p-1600.png"
              alt="Product Showcase Desktop"
              width={800}
              height={400}
              className="w-full h-auto object-contain drop-shadow-2xl"
              priority={false}
            />
          </div>

          {/* Mobile Image */}
          <div className="block md:hidden">
            <Image
              src="/images/Artboard-1-1000-copy-p-1080.png"
              alt="Product Showcase Mobile"
              width={1080}
              height={1080}
              className="w-full h-auto object-contain drop-shadow-xl"
              priority={false}
            />
          </div>

          {/* Subtle glow effect behind */}
          <div className="absolute inset-0 bg-primary/10 blur-[100px] -z-10 rounded-full scale-90" />
        </motion.div>
      </div>
    </div>
  );
}
