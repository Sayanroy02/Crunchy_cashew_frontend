'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { COLORS } from '@/constants/styles';
import { Colors } from 'chart.js';

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
        id: 'WS',
        name: 'White Splits',
        img: '/images/SS-min.png',
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
            className="grade-card-link flex-shrink-0 snap-center flex flex-col items-center w-[160px] md:w-auto overflow-visible isolate"
        >
            {/* Circular image — Higher Stacking */}
            <div
                className="grade-circle rounded-full flex items-center justify-center relative z-20"
                style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    transition: 'transform 0.3s ease',
                }}
            >
                <img
                    src={grade.img}
                    alt={grade.name}
                    className="w-full h-full object-cover scale-[1.05]"
                    onError={(e: any) => {
                        e.target.src = '/images/crunchy-cashews-product.png';
                    }}
                />
            </div>

            {/* Label — Lower Stacking but Above Background */}
            <span
                className="text-center font-bold relative z-10 -mt-2 md:-mt-10"
                style={{ fontSize: '1.3rem', lineHeight: '1.2', color: COLORS.black }}
            >
                {grade.name}
            </span>
        </Link>
    );
}

export default function BulkOrderCard() {
    return (
        <section className="py-4 md:py-6 bg-bg-cream">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="text-center mb-3">
                    <span
                        className="font-bold tracking-widest uppercase text-xs mb-2 block"
                        style={{ color: COLORS.black }}
                    >
                        Wholesale & B2B
                    </span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black tracking-tight mb-3"
                        style={{ color: COLORS.heading }}
                    >
                        Bulk Orders & <span className="relative inline-block">
                            <span className="relative z-10">Gradings</span>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: '100%' }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="absolute bottom-1 md:bottom-2 left-0 h-3 md:h-4 -z-0 opacity-80"
                                style={{ backgroundColor: COLORS.highlight }}
                            />
                        </span>
                    </motion.h2>
                    <p className="text-black/60 max-w-2xl mx-auto text-sm md:text-base mt-2">
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
                <div
                    className="mt-10 rounded-3xl relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
                    style={{
                        background: 'linear-gradient(135deg, #FFFBEA 0%, #FEF3C7 40%, #FDE68A 100%)',
                        padding: '2.5rem 2.5rem',
                    }}
                >
                    {/* Dotted matrix background */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle, #D97706 1px, transparent 1px)',
                            backgroundSize: '20px 20px',
                            opacity: 0.12,
                        }}
                    />

                    {/* Decorative blobs */}
                    <div
                        className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
                        style={{ background: 'radial-gradient(circle, #FCD34D55 0%, transparent 70%)' }}
                    />
                    <div
                        className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
                        style={{ background: 'radial-gradient(circle, #FDE68A55 0%, transparent 70%)' }}
                    />

                    {/* Badge */}
                    <div className="absolute top-4 left-6 z-10">
                        <span
                            className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                            style={{ backgroundColor: COLORS.primary, color: COLORS.black, letterSpacing: '0.12em' }}
                        >
                            Factory Direct
                        </span>
                    </div>

                    <div className="relative z-10 max-w-xl text-center md:text-left pt-6 md:pt-2">
                        <h3
                            className="text-2xl md:text-3xl font-bold mb-2"
                            style={{ color: COLORS.black }}
                        >
                            Need a{' '}
                            <span style={{ color: COLORS.primary }}>Custom Order?</span>
                        </h3>
                        <p style={{ color: COLORS.black, fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.6 }}>
                            We handle large-scale shipments and retail packaging.
                            Get in touch with our factory today.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <Link
                            href="/bulk"
                            className="font-bold px-8 py-4 rounded-2xl transition-all shadow-md text-center whitespace-nowrap text-sm hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                            style={{ backgroundColor: COLORS.primary, color: COLORS.black }}
                        >
                            Contact Us
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </Link>
                        <Link
                            href="/bulk"
                            className="font-bold px-8 py-4 rounded-2xl text-center whitespace-nowrap text-sm transition-colors hover:bg-amber-100"
                            style={{ color: COLORS.black, border: '1.5px solid COLORS.black', backgroundColor: 'transparent' }}
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