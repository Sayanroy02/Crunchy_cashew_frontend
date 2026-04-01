'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function AnimatedFlyingImage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);

    const handleMouseMove = (e: MouseEvent) => {
      if (!visible) return;
      const { innerWidth, innerHeight } = window;

      // Reversed the subtraction here!
      // Now: Center of Screen - Mouse Position
      const x = (innerWidth / 2 - e.clientX) / 25;
      const y = (innerHeight / 2 - e.clientY) / 25;

      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [visible]);

  return (
    <div className="relative w-full overflow-hidden py-4 md:py-10">
      <div className="max-w-7xl mx-auto px-4 flex justify-center">
        {/* Container for the image with transition and parallax */}
        <div
          ref={containerRef}
          className="relative w-full max-w-4xl" // Reduced from max-w-5xl (~15% smaller)
          style={{
            opacity: visible ? 1 : 0,
            transform: visible
              ? `translate(${mousePos.x}px, ${mousePos.y}px) rotate(0deg)`
              : 'translateX(-80px) rotate(-4deg)',
            transition: visible
              ? 'opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 0.1s ease-out'
              : 'opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Desktop Image */}
          <div className="hidden md:block">
            <Image
              src="/images/Artboard-1-1000-copy-p-1600.png"
              alt="Product Showcase Desktop"
              width={680} // Reduced by 15% from 800
              height={340} // Reduced by 15% from 400
              className="w-full h-auto object-contain drop-shadow-xl"
              priority={false}
            />
          </div>

          {/* Mobile Image - simpler transition, no parallax to avoid jank */}
          <div className="block md:hidden">
            <Image
              src="/images/Artboard-1-1000-copy-p-1080.png"
              alt="Product Showcase Mobile"
              width={900} // Reduced by 15% from 1080
              height={900}
              className="w-full h-auto object-contain drop-shadow-xl"
              priority={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
