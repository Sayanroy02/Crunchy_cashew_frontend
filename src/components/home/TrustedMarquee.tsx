'use client';

import React from 'react';

export default function TrustedMarquee() {
    const logos = [
        { src: "/images/partners/reliance-logo.png", alt: "Smart Bazaar", className: "h-20 md:h-28" },
        { src: "/images/partners/Global-nuts.png", alt: "Global Nuts", className: "h-12 md:h-16" },
        { src: "/images/partners/SPENCERS%20Logo.png", alt: "Spencers", className: "h-12 md:h-16" },
        { src: "/images/partners/Marriott_Logo.png", alt: "Marriott", className: "h-12 md:h-16" },
        { src: "/images/partners/whole-farms.png", alt: "Whole Farms", className: "h-20 md:h-28" },
        { src: "/images/partners/9to10-logo.png", alt: "9to10", className: "h-16 md:h-24" },
        { src: "/images/partners/natures-nut.png", alt: "Nature's Nut", className: "h-12 md:h-16" },
        { src: "/images/partners/half-full-logo.png", alt: "Half Full", className: "h-20 md:h-28" },
    ];

    return (
        <div className="flex overflow-hidden w-full select-none relative">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes marquee-scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .marquee-track-css {
                    display: flex;
                    width: max-content;
                    animation: marquee-scroll 40s linear infinite;
                    will-change: transform;
                }
                .marquee-track-css:hover {
                    animation-play-state: paused;
                }
            `}} />

            <div className="marquee-track-css flex items-center gap-20 md:gap-34 whitespace-nowrap px-8">
                {/* Render two identical sets of logos for seamless continuous scrolling */}
                {[...Array(5)].map((_, setIdx) => (
                    <div key={setIdx} className="flex items-center gap-20 md:gap-34 shrink-0">
                        {logos.map((logo, logoIdx) => (
                            <img
                                key={`${setIdx}-${logoIdx}`}
                                src={logo.src}
                                alt={logo.alt}
                                className={`${logo.className} w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300`}
                                draggable={false}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}