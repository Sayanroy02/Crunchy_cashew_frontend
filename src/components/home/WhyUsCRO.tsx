'use client';

import React from 'react';
import Link from 'next/link';

const reasons = [
    { icon: '🏆', title: 'High Kernel Quality', desc: 'Premium grade, uniformly white cashews you can trust.' },
    { icon: '📦', title: 'Durable Packaging', desc: '3-layer seal keeps moisture out and crunch in.' },
    { icon: '🏭', title: 'Clean Production', desc: 'Hygienic factory, food-grade machinery, always.' },
    { icon: '✨', title: 'Customized Orders', desc: 'Your grade, your packaging — personalised for you.' },
];

export default function WhyUsCRO() {
    return (
        <section className="relative bg-[#2c1a0e] py-16 md:py-20 overflow-hidden">
            {/* Subtle texture dots */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FBB21B 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

            <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
                <div className="text-center mb-10">
                    <span className="inline-block text-[#FBB21B] font-bold tracking-[4px] uppercase text-xs mb-2">Our Advantage</span>
                    <h2 className="text-3xl md:text-4xl font-heading font-black text-white leading-tight">
                        Why Choose <span className="text-[#FBB21B]">Crunchy Cashews?</span>
                    </h2>
                </div>

                {/* Icon grid: 4 col desktop, 2 col mobile */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {reasons.map((r) => (
                        <div key={r.title} className="bg-[#3a2210] rounded-2xl p-5 flex flex-col items-center text-center gap-3 hover:bg-[#4a2e15] transition-colors group">
                            <div className="w-14 h-14 bg-[#FBB21B] rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 transition-transform">
                                {r.icon}
                            </div>
                            <h3 className="font-black text-white text-sm md:text-base font-heading leading-tight">{r.title}</h3>
                            <p className="text-white/50 text-xs leading-relaxed">{r.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link href="/about"
                        className="inline-flex items-center gap-2 bg-[#FBB21B] text-[#2c1a0e] font-black px-7 py-3 rounded-full hover:bg-yellow-400 transition-all shadow-md uppercase tracking-widest text-xs"
                    >
                        Learn More <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
}
