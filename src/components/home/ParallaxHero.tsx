import React from 'react';
import Link from 'next/link';

export default function ParallaxHero() {
    return (
        <section
            className="relative w-full h-[600px] flex items-center justify-center bg-fixed bg-center bg-cover"
            style={{ backgroundImage: 'url("/images/Right-Hero-Section.png")' }}
        >
            {/* Dark overlay for text legibility */}
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="relative z-10 max-w-4xl text-center px-6 py-10 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-2xl">
                <h1
                    className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-6 uppercase tracking-wider"
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 0 rgba(0,0,0,0.5), 1px -1px 0 rgba(0,0,0,0.5), -1px 1px 0 rgba(0,0,0,0.5), 1px 1px 0 rgba(0,0,0,0.5)' }}
                >
                    Discover the Best Cashews in Siliguri
                </h1>
                <p className="text-lg md:text-xl text-yellow-100 font-medium mb-8 max-w-2xl mx-auto drop-shadow-lg">
                    We are the leading cashew factory and wholesale distributor in West Bengal, India. Sourcing premium farm-wild nuts worldwide since 2010.
                </p>
                <Link
                    href="/our-product"
                    className="inline-block bg-gradient-to-r from-primary to-green-700 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-green-900/50 hover:-translate-y-1 transition-all duration-300"
                >
                    Shop Now
                </Link>
            </div>
        </section>
    );
}
