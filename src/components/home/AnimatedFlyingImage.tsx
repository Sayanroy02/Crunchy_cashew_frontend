'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function AnimatedFlyingImage() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // one-shot: no need to keep observing
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full overflow-hidden py-2 md:py-8">
      <div className="max-w-7xl mx-auto px-4 flex justify-center">
        {/* CSS-driven reveal — no framer-motion runtime overhead */}
        <div
          ref={ref}
          className="relative w-full max-w-5xl"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0px) rotate(0deg)' : 'translateX(-80px) rotate(-4deg)',
            transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Desktop Image */}
          <div className="hidden md:block">
            <Image
              src="/images/Artboard-1-1000-copy-p-1600.png"
              alt="Product Showcase Desktop"
              width={800}
              height={400}
              className="w-full h-auto object-contain"
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
              className="w-full h-auto object-contain"
              priority={false}
            />
          </div>
          {/* Removed blur-[100px] glow — it was forcing GPU compositing over a huge transparent area for a near-invisible effect */}
        </div>
      </div>
    </div>
  );
}
