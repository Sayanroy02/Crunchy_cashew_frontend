'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#fffdf5] px-6 py-16 text-center">
            {/* Big 404 */}
            <div className="relative mb-8">
                <span className="text-[160px] md:text-[220px] font-black text-[#FBB21B]/20 leading-none select-none">404</span>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl">🥜</span>
                </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-black text-[#2c1a0e] mb-3">
                Oops! Page Not Found
            </h1>
            <p className="text-gray-500 text-lg max-w-md mb-8 font-body">
                Looks like this page wandered off, just like a cashew that rolled away! Let's get you back on track.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/"
                    className="bg-[#0c5c2b] text-white font-bold px-8 py-3.5 rounded-full hover:bg-green-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <i className="fa-solid fa-house mr-2"></i>Back to Home
                </Link>
                <Link href="/shop"
                    className="bg-[#FBB21B] text-[#2c1a0e] font-bold px-8 py-3.5 rounded-full hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <i className="fa-solid fa-store mr-2"></i>Shop Cashews
                </Link>
            </div>

            {/* Decorative cashews */}
            <div className="mt-16 flex gap-8 text-4xl opacity-20 select-none">
                <span>🌰</span><span>🥜</span><span>🌰</span><span>🥜</span><span>🌰</span>
            </div>
        </div>
    );
}
