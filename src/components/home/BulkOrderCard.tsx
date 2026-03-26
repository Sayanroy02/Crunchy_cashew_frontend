'use client';

import React from 'react';
import Link from 'next/link';

const grades = [
    {
        id: 'ww180',
        name: 'WW 180',
        img: '/images/WW180-min.png',
    },
    {
        id: 'ww320',
        name: 'WW 320',
        img: '/images/WW320-min.png',
    },
    {
        id: 'sw320',
        name: 'SW 320',
        img: '/images/SW320-min.png',
    },
    {
        id: 'lwp',
        name: 'LWP',
        img: '/images/LWP-min.png',
    },
];

function GradeCard({ grade }: { grade: typeof grades[0] }) {
    return (
        <Link
            href="/bulk"
            className="grade-card-link flex-shrink-0 snap-center flex flex-col items-center w-[160px] md:w-auto"
            style={{ gap: '6px' }}
        >
            {/* Circular image */}
            <div
                className="grade-circle rounded-full overflow-hidden"
                style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    transition: 'transform 0.3s ease',
                }}
            >
                <img
                    src={grade.img}
                    alt={grade.name}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                        e.target.src = '/images/crunchy-cashews-product.png';
                    }}
                />
            </div>

            {/* Label — fixed size, tight margin */}
            <span
                className="text-center font-bold text-[#2D6A4F]"
                style={{ fontSize: '1.3rem', lineHeight: '1.2', marginTop: '2px' }}
            >
                {grade.name}
            </span>
        </Link>
    );
}

export default function BulkOrderCard() {
    return (
        <section className="py-6 bg-bg-cream">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="text-center mb-3">
                    <span className="text-[#2D6A4F] font-bold tracking-widest uppercase text-xs mb-2 block">
                        Wholesale & B2B
                    </span>
                    <h2
                        className="text-3xl md:text-5xl font-bold text-gray-900 mb-3"
                        style={{ fontFamily: 'Georgia, serif' }}
                    >
                        Bulk Orders & Gradings
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
                        Explore our premium cashew grades available for wholesale. Competitive pricing,
                        custom packaging, and reliable global shipping.
                    </p>
                </div>

                {/* Mobile: horizontal scroll */}
                <div
                    className="flex md:hidden overflow-x-auto pb-4 gap-4 snap-x snap-mandatory px-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {grades.map((grade) => (
                        <GradeCard key={grade.id} grade={grade} />
                    ))}
                </div>

                {/* Desktop: equal 4-column grid */}
                <div className="hidden md:grid grid-cols-4 gap-4 mb-2">
                    {grades.map((grade) => (
                        <GradeCard key={grade.id} grade={grade} />
                    ))}
                </div>

                {/* CTA Banner */}
                <div className="mt-2 bg-[#1E4D35] rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />

                    <div className="relative z-10 max-w-xl text-center md:text-left">
                        <h3
                            className="text-2xl md:text-3xl font-bold text-white mb-2"
                            style={{ fontFamily: 'Georgia, serif' }}
                        >
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
                            className="bg-white/10 text-white font-bold px-8 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-colors text-center whitespace-nowrap text-sm md:text-base"
                        >
                            Know More
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
                .flex.overflow-x-auto::-webkit-scrollbar { display: none; }
                .grade-card-link:hover .grade-circle {
                    transform: scale(1.09);
                }
            `}</style>
        </section>
    );
}