'use client';

import React, { useEffect, useRef } from 'react';

export default function TrustedMarquee() {
    const logos = [
        { src: "/images/partners/reliance-logo.png", alt: "Smart Bazaar" },
        { src: "/images/partners/Global-nuts.png", alt: "Global Nuts" },
        { src: "/images/partners/SPENCERS%20Logo.png", alt: "Spencers" },
        { src: "/images/partners/Marriott_Logo.png", alt: "Marriott" },
        { src: "/images/partners/whole-farms.png", alt: "Whole Farms" },
        { src: "/images/partners/9to10-logo.png", alt: "9to10" },
        { src: "/images/partners/natures-nut.png", alt: "Nature's Nut" },
        { src: "/images/partners/half-full-logo.png", alt: "Half Full" },
    ];

    const GAP_CLASS = "gap-8 md:gap-12";
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
        <div ref={ref} className={`flex items-center shrink-0 ${GAP_CLASS} pr-8 md:pr-12`}>
            {logos.map((logo, i) => (
                <div key={i} className="flex items-center justify-center w-28 h-16 md:w-40 md:h-20 shrink-0">
                    <img
                        src={logo.src}
                        alt={logo.alt}
                        className="max-w-full max-h-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                        draggable={false}
                    />
                </div>
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