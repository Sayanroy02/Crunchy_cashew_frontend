'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#fffdf5] px-6 py-16 text-center">
            {/* Big 404 with Logo replacing '0' */}
            <div className="flex items-center justify-center gap-2 mb-8 select-none">
                <span className="text-[120px] md:text-[180px] font-black text-amber/20 leading-none">4</span>
                <img
                    src="/images/cc-Logo-01-1.png"
                    alt="Crunchy Cashews Logo"
                    className="h-20 w-20 md:h-36 md:w-36 object-contain animate-bounce"
                />
                <span className="text-[120px] md:text-[180px] font-black text-amber/20 leading-none">4</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-black text-[#2c1a0e] mb-3">
                Oops! Page Not Found
            </h1>
            <p className="text-gray-500 text-lg max-w-md mb-8 font-body">
                Looks like this page wandered off, just like a cashew that rolled away! Let's get you back on track.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/"
                    className="bg-green-700 text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2">
                    <i className="fa-solid fa-house text-sm md:text-xs" />
                    <span>Back to Home</span>
                </Link>
                <Link href="/our-product"
                    className="bg-green-700 text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2">
                    <i className="fa-solid fa-store text-sm md:text-xs" />
                    <span>Shop Cashews</span>
                </Link>
            </div>

            {/* Decorative cashews */}
            <div className="mt-16 flex gap-8 text-4xl opacity-20 select-none">
                <span>🌰</span><span>🥜</span><span>🌰</span><span>🥜</span><span>🌰</span>
            </div>
        </div>
    );
}
