'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';


const offers = [
    {
        id: 1,
        badge: '🔥 Limited Time',
        discount: '10% OFF',
        title: 'First Order Special',
        subtitle: 'Use code: CRUNCHY10',
        description: 'Minimum order ₹499',
        color: 'from-[#f6d70f] to-[#f0a500]',
        textColor: 'text-[#0c5c2b]',
        href: '/shop',
        size: 'large',
        icon: '🥜',
    },
    {
        id: 2,
        badge: '⚡ Flash Sale',
        discount: '5% OFF',
        title: 'Orders Above ₹1,599',
        subtitle: 'Auto-applied at checkout',
        description: 'No coupon needed',
        color: 'from-[#0c5c2b] to-[#1a8c44]',
        textColor: 'text-white',
        href: '/shop',
        size: 'medium',
        icon: '💰',
    },
    {
        id: 3,
        badge: '🚛 Free Shipping',
        discount: 'FREE',
        title: 'Delivery on ₹999+',
        subtitle: 'Pan India delivery',
        description: '5–7 business days',
        color: 'from-[#1a1a2e] to-[#16213e]',
        textColor: 'text-white',
        href: '/shop',
        size: 'medium',
        icon: '📦',
    },
    {
        id: 4,
        badge: '🎁 Exclusive',
        discount: '15% OFF',
        title: 'Gift Packs & Hampers',
        subtitle: 'Premium packaging included',
        description: 'Perfect for festive season',
        color: 'from-[#9c27b0] to-[#673ab7]',
        textColor: 'text-white',
        href: '/shop?category=gift',
        size: 'small',
        icon: '🎀',
    },
    {
        id: 5,
        badge: '📦 Wholesale',
        discount: 'BULK',
        title: 'Factory-Direct Pricing',
        subtitle: 'Min 10 kg order',
        description: 'Best rates guaranteed',
        color: 'from-[#e65100] to-[#f57c00]',
        textColor: 'text-white',
        href: '/bulk',
        size: 'small',
        icon: '🏭',
    },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                let start = 0;
                const step = target / 60;
                const timer = setInterval(() => {
                    start += step;
                    if (start >= target) { setCount(target); clearInterval(timer); }
                    else setCount(Math.floor(start));
                }, 16);
                observer.disconnect();
            }
        });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return <span ref={ref}>{count}{suffix}</span>;
}

export default function OffersGrid() {
    return (
        <section className="max-w-screen-xl mx-auto px-4 md:px-8 py-10 md:py-14">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-heading font-black text-gray-900">
                        🏷️ Today's <span className="text-[#0c5c2b]">Best Deals</span>
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Freshly sourced. Directly roasted. Only the best for you.</p>
                </div>
                <Link href="/shop" className="hidden md:flex items-center gap-2 text-[#0c5c2b] font-bold text-sm hover:underline">
                    Shop All <i className="fa-solid fa-arrow-right"></i>
                </Link>
            </div>

            {/* Bento Grid — fixed to remove empty space */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {/* Large Card - 2x2 */}
                <Link href="/shop"
                    className="col-span-2 md:col-span-2 row-span-2 bg-gradient-to-br from-[#f6d70f] to-[#f0a500] rounded-2xl p-6 md:p-8 flex flex-col justify-between group overflow-hidden relative shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-[220px] md:min-h-[280px]"
                >
                    <div className="absolute -right-8 -bottom-8 text-[100px] md:text-[150px] opacity-10 select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">🥜</div>
                    <div>
                        <span className="inline-block text-[#0c5c2b] bg-black/10 text-xs font-bold px-3 py-1 rounded-full mb-3">🔥 Limited Time</span>
                        <div className="text-5xl md:text-6xl font-black text-[#0c5c2b] leading-none mb-1">10% OFF</div>
                        <div className="text-lg md:text-xl font-bold text-[#0c5c2b] opacity-90">First Order Special</div>
                        <div className="text-sm text-[#0c5c2b] opacity-70 mt-1">Use code: CRUNCHY10</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#0c5c2b] opacity-60">Min order ₹499</span>
                        <span className="text-[#0c5c2b] group-hover:translate-x-1 transition-transform text-lg">→</span>
                    </div>
                </Link>

                {/* Right column — stacked vertically */}
                <div className="col-span-2 md:col-span-1 grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4">
                    {/* Green Card */}
                    <Link href="/shop" className="bg-gradient-to-br from-[#0c5c2b] to-[#1a8c44] rounded-2xl p-4 md:p-5 flex flex-col justify-between group overflow-hidden relative shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-[130px]">
                        <div className="absolute -right-3 -bottom-3 text-[60px] opacity-10 select-none pointer-events-none">💰</div>
                        <span className="inline-block text-white bg-white/10 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">⚡ Flash Sale</span>
                        <div>
                            <div className="text-3xl font-black text-white leading-none">5% OFF</div>
                            <div className="text-xs font-bold text-white opacity-80">Orders above ₹1,599</div>
                        </div>
                    </Link>
                    {/* Dark Card */}
                    <Link href="/shop" className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-4 md:p-5 flex flex-col justify-between group overflow-hidden relative shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-[130px]">
                        <div className="absolute -right-3 -bottom-3 text-[60px] opacity-10 select-none pointer-events-none">📦</div>
                        <span className="inline-block text-white bg-white/10 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">🚛 Free Shipping</span>
                        <div>
                            <div className="text-3xl font-black text-white leading-none">FREE</div>
                            <div className="text-xs font-bold text-white opacity-80">On orders above ₹999</div>
                        </div>
                    </Link>
                </div>

                {/* Bottom row — 3 equal cards */}
                <Link href="/shop?category=gift" className="col-span-1 bg-gradient-to-br from-[#9c27b0] to-[#673ab7] rounded-2xl p-4 md:p-5 flex flex-col justify-between group overflow-hidden relative shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[120px]">
                    <div className="absolute -right-2 -bottom-2 text-[50px] opacity-10 select-none pointer-events-none">🎁</div>
                    <span className="inline-block text-white bg-white/10 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">🎁 Exclusive</span>
                    <div>
                        <div className="text-2xl font-black text-white">15% OFF</div>
                        <div className="text-xs font-bold text-white opacity-80">Gift Packs & Hampers</div>
                    </div>
                </Link>
                <Link href="/bulk" className="col-span-1 bg-gradient-to-br from-[#e65100] to-[#f57c00] rounded-2xl p-4 md:p-5 flex flex-col justify-between group overflow-hidden relative shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[120px]">
                    <div className="absolute -right-2 -bottom-2 text-[50px] opacity-10 select-none pointer-events-none">🏭</div>
                    <span className="inline-block text-white bg-white/10 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">📦 Wholesale</span>
                    <div>
                        <div className="text-2xl font-black text-white">BULK</div>
                        <div className="text-xs font-bold text-white opacity-80">Factory-direct pricing</div>
                    </div>
                </Link>
                <Link href="/shop?category=roasted" className="col-span-2 md:col-span-1 bg-gradient-to-br from-[#004d40] to-[#00796b] rounded-2xl p-4 md:p-5 flex flex-col justify-between group overflow-hidden relative shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[120px]">
                    <div className="absolute -right-2 -bottom-2 text-[50px] opacity-10 select-none pointer-events-none">✨</div>
                    <span className="inline-block text-white bg-white/10 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">🌟 Bestseller</span>
                    <div>
                        <div className="text-2xl font-black text-white">NEW</div>
                        <div className="text-xs font-bold text-white opacity-80">Spiced Roasted Range</div>
                    </div>
                </Link>
            </div>


            {/* Stats Ticker */}
            <div className="mt-6 bg-[#0c5c2b] rounded-2xl px-6 py-4 flex flex-wrap items-center justify-around gap-4 text-white">
                {[
                    { label: 'Happy Customers', value: 15000, suffix: '+' },
                    { label: 'Orders Delivered', value: 50000, suffix: '+' },
                    { label: 'Cities Covered', value: 200, suffix: '+' },
                    { label: 'Years of Trust', value: 12, suffix: '+' },
                ].map((stat) => (
                    <div key={stat.label} className="text-center">
                        <div className="text-2xl md:text-3xl font-black text-[#f6d70f]">
                            <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                        </div>
                        <div className="text-xs md:text-sm opacity-80 mt-0.5">{stat.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
