'use client';

import React from 'react';

export default function Affiliates() {
    return (
        <section className="py-20 bg-bg-cream border-y border-gray-200">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-primary font-bold tracking-widest uppercase text-sm mb-6">Also Available On</p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-12 md:gap-24 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <a href="https://amazon.in" target="_blank" rel="noopener noreferrer" className="hover:-translate-y-2 transition-transform duration-300">
                        {/* Amazon text placeholder (in a real app, use their logo SVG/PNG) */}
                        <div className="text-4xl font-bold font-sans text-gray-800 flex items-center">
                            amazon<span className="text-orange-500 text-5xl leading-none">.</span>in
                        </div>
                    </a>

                    <a href="https://flipkart.com" target="_blank" rel="noopener noreferrer" className="hover:-translate-y-2 transition-transform duration-300">
                        {/* Flipkart text placeholder */}
                        <div className="text-4xl font-bold font-sans italic text-blue-600 flex items-center">
                            Flipkart<span className="text-yellow-400 ml-1 text-2xl"><i className="fa-solid fa-cart-shopping"></i></span>
                        </div>
                    </a>
                </div>
            </div>
        </section>
    );
}
