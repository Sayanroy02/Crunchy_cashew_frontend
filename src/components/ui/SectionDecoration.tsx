'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface SectionDecorationProps {
  type: 'fruit-left' | 'fruit-right' | 'parachute';
  className?: string;
}

const DECO_IMAGES = {
  'fruit-left': '/images/Left-Fruit-2-1.png',
  'fruit-right': '/images/Right-Fruit-2-2-1.png',
  'parachute': '/images/Cashew-parachute-1-03-03.png',
};

export default function SectionDecoration({ type, className = "" }: SectionDecorationProps) {
  const isParachute = type === 'parachute';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: isParachute ? -10 : 0 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay: 0.2, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={`absolute pointer-events-none z-10 hidden lg:block ${className}`}
    >
      <motion.div
        animate={isParachute ? {
          y: [0, -12, 0],
          x: [0, 5, 0],
          rotate: [0, 2, 0]
        } : {
          y: [0, -8, 0],
          rotate: [0, 1.5, 0]
        }}
        transition={{
          duration: isParachute ? 6 : 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Image
          src={DECO_IMAGES[type]}
          alt=""
          width={isParachute ? 140 : 120}
          height={isParachute ? 140 : 180}
          className={`${isParachute ? 'w-[clamp(60px,6vw,100px)]' : 'w-[clamp(70px,7vw,110px)]'} h-auto object-contain drop-shadow-2xl opacity-90`}
          priority={false}
        />
      </motion.div>
    </motion.div>
  );
}
