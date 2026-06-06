'use client';

import React, { useEffect, useRef } from 'react';

export default function TrustedMarquee() {
    const trackRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<number>(0);
    const xRef = useRef<number>(0);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const singleSetWidth = track.scrollWidth / 5;
        const speed = 0.8; // increase for faster

        const tick = () => {
            xRef.current -= speed;
            if (Math.abs(xRef.current) >= singleSetWidth) {
                xRef.current = 0;
            }
            track.style.transform = `translateX(${xRef.current}px)`;
            animRef.current = requestAnimationFrame(tick);
        };

        animRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animRef.current);
    }, []);

    return (
        <div className="flex overflow-hidden w-full select-none">
            <div
                ref={trackRef}
                className="flex w-max items-center gap-16 md:gap-24 whitespace-nowrap px-8 will-change-transform"
            >
                {[...Array(5)].map((_, idx) => (
                    <div key={idx} className="flex items-center gap-16 md:gap-24 shrink-0">
                        <img 
                            src="/images/partners/reliance-logo.png" 
                            alt="Smart Bazaar" 
                            className="h-20 md:h-30 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
                        />
                        <img 
                            src="/images/partners/Global-nuts.png" 
                            alt="Global Nuts" 
                            className="h-12 md:h-16 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
                        />
                        <img 
                            src="/images/partners/9to10-logo.png" 
                            alt="9to10" 
                            className="h-16 md:h-24 w-auto object-contain grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
                        />
                        <img 
                            src="/images/partners/natures-nut.png" 
                            alt="Nature's Nut" 
                            className="h-12 md:h-16 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
                        />
                        <img 
                            src="/images/partners/SPENCERS%20Logo.png" 
                            alt="Spencers" 
                            className="h-12 md:h-16 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
