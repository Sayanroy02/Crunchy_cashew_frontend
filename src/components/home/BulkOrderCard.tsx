'use client';

import React from 'react';
import Link from 'next/link';

const grades = [
    {
        id: 'ww180',
        name: 'WW 180 - Jumbo Grade',
        img: '/images/WW180-min.png',
        accent: '#2D6A4F',
    },
    {
        id: 'ww320',
        name: 'WW 320 - Most Popular',
        img: '/images/WW320-min.png',
        accent: '#2D6A4F',
    },
    {
        id: 'sw320',
        name: 'SW 320 - Scorched',
        img: '/images/SW320-min.png',
        accent: '#B5641C',
    },
    {
        id: 'lwp',
        name: 'LWP - Large Pieces',
        img: '/images/LWP-min.png',
        accent: '#5C7A29',
    },
];

export default function BulkOrderCard() {
    return (
        <section className="py-10 bg-[#F5F0E8]">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-[#2D6A4F] font-bold tracking-widest uppercase text-xs mb-2 block">
                        Wholesale & B2B
                    </span>
                    <h2
                        className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
                        style={{ fontFamily: 'Georgia, serif' }}
                    >
                        Bulk Orders & Gradings
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
                        Explore our premium cashew grades available for wholesale. Competitive pricing,
                        custom packaging, and reliable global shipping.
                    </p>
                </div>

                {/* Grade Cards — image only, hover reveals name */}
                <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 snap-x snap-mandatory scrollbar-hide"
                    style={{ scrollbarWidth: 'none' }}>
                    {grades.map((grade) => (
                        <div
                            key={grade.id}
                            className="grade-card min-w-[200px] sm:min-w-0 snap-center relative group cursor-pointer"
                        >
                            {/* Image container */}
                            <div className="relative overflow-hidden rounded-3xl aspect-square shadow-md group-hover:shadow-xl transition-shadow duration-500">
                                <img
                                    src={grade.img}
                                    alt={grade.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e: any) => {
                                        e.target.src = '/images/crunchy-cashews-product.png';
                                    }}
                                />

                                {/* Hover overlay with grade name */}
                                <div
                                    className="absolute inset-0 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                                    style={{
                                        background: `linear-gradient(to top, ${grade.accent}ee 0%, ${grade.accent}44 50%, transparent 100%)`,
                                    }}
                                >
                                    <span
                                        className="text-white font-bold text-base md:text-lg text-center px-3 leading-snug translate-y-3 group-hover:translate-y-0 transition-transform duration-400"
                                        style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}
                                    >
                                        {grade.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Banner */}
                <div className="bg-[#1E4D35] rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Decorative blobs */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-xl text-center md:text-left">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                            Ready to place a wholesale order?
                        </h3>
                        <p className="text-white/70 text-sm md:text-base">
                            Get a custom quote instantly tailored to your business needs and expected volume.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <Link
                            href="/bulk"
                            className="bg-[#FDC700] text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-300 transition-colors shadow-lg text-center whitespace-nowrap text-sm md:text-base"
                        >
                            Request Bulk Order →
                        </Link>
                        <Link
                            href="/bulk"
                            className="bg-white/10 text-white font-bold px-8 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm text-center whitespace-nowrap text-sm md:text-base"
                        >
                            Know More
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}