'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const grades = [
    {
        id: 'ww180',
        name: 'WW 180 - Jumbo Grade',
        img: '/images/WW180-min.png',
        desc: 'The highest grade by size. Critical where visual appeal and nut size matter.',
        accent: '#2D6A4F'
    },
    {
        id: 'ww320',
        name: 'WW 320 - Most Popular',
        img: '/images/WW320-min.png',
        desc: 'Mid-size and the #1 traded cashew grade worldwide. Versatile for all food applications.',
        accent: '#2D6A4F'
    },
    {
        id: 'sw320',
        name: 'SW 320 - Popular Scorched',
        img: '/images/SW320-min.png',
        desc: 'Most popular scorched grade. Perfect for all processed food applications.',
        accent: '#B5641C'
    },
    {
        id: 'lwp',
        name: 'LWP - Large Pieces',
        img: '/images/LWP-min.png',
        desc: 'Whole cashew diced into 4 pieces. Ideal for topping, coating and garnishing.',
        accent: '#5C7A29'
    },
];

export default function BulkOrderCard() {
    return (
        <section className="py-10 mb:py-0 bg-bg-cream">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-12">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Wholesale & B2B</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                        Bulk Orders & Gradings
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our premium cashew grades available for wholesale. We offer competitive pricing,
                        custom packaging, and reliable global shipping for all bulk requirements.
                    </p>
                </div>

                {/* Grades Display */}
                <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                    {grades.map((grade) => (
                        <div key={grade.id}
                            className="min-w-[280px] sm:min-w-0 snap-center rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col items-center text-center group"
                            style={{ background: `linear-gradient(135deg, ${grade.accent}15 0%, #ffffff 100%)` }}
                        >
                            <div className="w-32 h-32 relative mb-5 flex-shrink-0 bg-white rounded-full p-4 shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all">
                                {/* Use placeholder image object logic if actual product images aren't present */}
                                <img
                                    src={grade.img}
                                    alt={grade.name}
                                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm"
                                    onError={(e: any) => { e.target.src = '/images/crunchy-cashews-product.png' }}
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ color: grade.accent }}>{grade.name}</h3>
                            <p className="text-sm text-gray-700 leading-relaxed font-medium mb-2">{grade.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Call to Actions */}
                <div className="bg-primary rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Background decorations */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

                    <div className="relative z-10 max-w-xl text-center md:text-left">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to place a wholesale order?</h3>
                        <p className="text-white/80">Get a custom quote instantly tailored to your business needs and expected volume.</p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <Link href="/bulk" className="bg-[#FDC700] text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-[#FDC700]/20 text-center whitespace-nowrap">
                            Request Bulk Order <i className="fa-solid fa-arrow-right ml-2"></i>
                        </Link>
                        <Link href="/bulk" className="bg-white/10 text-white font-bold px-8 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm text-center whitespace-nowrap">
                            Know More
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
