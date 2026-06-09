'use client';

import React, { useEffect, useRef } from 'react';

export default function TrustedMarquee() {
    const logos = [
        { src: "/images/partners/reliance-logo.png", alt: "Smart Bazaar", h: "h-20 md:h-28" },
        { src: "/images/partners/Global-nuts.png", alt: "Global Nuts", h: "h-12 md:h-16" },
        { src: "/images/partners/9to10-logo.png", alt: "9to10", h: "h-16 md:h-24" },
        { src: "/images/partners/natures-nut.png", alt: "Nature's Nut", h: "h-12 md:h-16" },
        { src: "/images/partners/SPENCERS%20Logo.png", alt: "Spencers", h: "h-12 md:h-16" },
        { src: "/images/partners/half-full-logo.png", alt: "Half Full", h: "h-20 md:h-28" },
        { src: "/images/partners/Marriott_Logo.png", alt: "Marriott", h: "h-12 md:h-16" },
        { src: "/images/partners/whole-farms.png", alt: "Whole Farms", h: "h-20 md:h-28" },
    ];

    const GAP_CLASS = "mr-16 md:mr-24";
    const SPEED = 0.6; // px per frame — tune this

    const trackRef = useRef<HTMLDivElement>(null);
    const setARef = useRef<HTMLDivElement | null>(null);
    const offsetRef = useRef(0);
    const pausedRef = useRef(false);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const track = trackRef.current;
        const setA = setARef.current;
        if (!track || !setA) return;

        const tick = () => {
            if (!pausedRef.current) {
                offsetRef.current += SPEED;

                // Measure live — handles font/image load settling
                const singleSetWidth = setA.getBoundingClientRect().width;

                // Once we've scrolled one full set, snap back — invisible reset
                if (singleSetWidth > 0 && offsetRef.current >= singleSetWidth) {
                    offsetRef.current -= singleSetWidth;
                }

                track.style.transform = `translateX(-${offsetRef.current}px)`;
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const logoList = (ref?: React.RefObject<HTMLDivElement | null>) => (
        <div ref={ref} className="flex items-center shrink-0">
            {logos.map((logo, i) => (
                <img
                    key={i}
                    src={logo.src}
                    alt={logo.alt}
                    className={`${logo.h} ${GAP_CLASS} w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 shrink-0`}
                    draggable={false}
                />
            ))}
        </div>
    );

    return (
        <div
            className="flex overflow-hidden w-full select-none"
            onMouseEnter={() => { pausedRef.current = true; }}
            onMouseLeave={() => { pausedRef.current = false; }}
        >
            <div
                ref={trackRef}
                className="flex items-center"
                style={{ width: 'max-content', willChange: 'transform' }}
            >
                {logoList(setARef)}
                {logoList()}   {/* identical clone — no ref needed */}
            </div>
        </div>
    );
}