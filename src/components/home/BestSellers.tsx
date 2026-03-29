'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import ProductCard, { Product } from '@/components/products/ProductCard';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';

type TagFilter = 'all' | 'best_seller' | 'newest' | 'gifting' | 'event';

const TAGS: { value: TagFilter; label: string; icon: string }[] = [
    { value: 'all', label: 'All', icon: 'fa-solid fa-border-all' },
    { value: 'best_seller', label: 'Best Sellers', icon: 'fa-solid fa-trophy' },
    { value: 'newest', label: 'New Arrivals', icon: 'fa-solid fa-sparkles' },
    { value: 'gifting', label: 'Gifting', icon: 'fa-solid fa-gift' },
    { value: 'event', label: 'Event Special', icon: 'fa-solid fa-calendar-star' },
];

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
            <div className="w-full h-52 bg-gray-200" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                <div className="h-8 bg-gray-200 rounded-full mt-4" />
            </div>
        </div>
    );
}

function SectionHeading({ text, highlight }: { text: string; highlight: string }) {
    const ref = useRef<HTMLHeadingElement>(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.3 });
        ob.observe(el);
        return () => ob.disconnect();
    }, []);
    return (
        <h2
            ref={ref}
            className="text-4xl md:text-5xl font-black tracking-tight mb-3"
            style={{
                color: COLORS.heading,
                opacity: vis ? 1 : 0,
                transform: vis ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.6s 0.1s ease, transform 0.6s 0.1s ease',
            }}
        >
            {text} <span className="relative inline-block">
                <span className="relative z-10">{highlight}</span>
                <span
                    className="absolute bottom-1 md:bottom-2 left-0 h-3 md:h-4 -z-0 opacity-80"
                    style={{
                        backgroundColor: COLORS.highlight,
                        width: vis ? '100%' : '0%',
                        transition: 'width 0.8s 0.5s ease',
                    }}
                />
            </span>
        </h2>
    );
}

export default function BestSellers() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTag, setActiveTag] = useState<TagFilter>('all');

    useEffect(() => {
        fetch(API.PRODUCTS)
            .then(res => res.json())
            .then((data: Product[]) => { setProducts(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        return products.filter(p => {
            if (activeTag === 'all') return true;
            if (activeTag === 'best_seller') return !!p.isBestSeller;
            if (activeTag === 'newest') return !!p.isNew;
            if (activeTag === 'gifting') return !!p.isGift;
            if (activeTag === 'event') return !!p.event?.type;
            return true;
        });
    }, [products, activeTag]);

    return (
        <section className="pt-[48px] pb-4 md:pb-6 bg-bg">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {/* Heading */}
                <div className="text-center mb-5 md:mb-6">
                    <span 
                        className="font-bold tracking-[4px] uppercase text-xs mb-2 block"
                        style={{ color: COLORS.text }}
                    >
                        Handpicked For You
                    </span>
                    <SectionHeading text="Our Best" highlight="Sellers" />
                </div>

                {/* Tag Filter Pills */}
                <div className="flex items-center gap-2 mb-5 overflow-x-auto scrollbar-hide px-1 md:justify-center md:flex-wrap">
                    {TAGS.map(tag => (
                        <button
                            key={tag.value}
                            onClick={() => setActiveTag(tag.value)}
                            className={`
                                flex-none inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold
                                border-2 transition-all duration-200 whitespace-nowrap
                                ${activeTag === tag.value
                                    ? 'shadow-md scale-105'
                                    : 'bg-white border-gray-200 text-gray-600'
                                }
                            `}
                            style={activeTag === tag.value ? {
                                backgroundColor: COLORS.primary,
                                borderColor: COLORS.primary,
                                color: COLORS.black
                            } : {}}
                        >
                            <i className={`${tag.icon} text-xs`} />
                            {tag.label}
                        </button>
                    ))}
                </div>

                {/* Product Grid with Horizontal Scroll */}
                <div className="relative group/scroll">
                    {/* Navigation Buttons (Desktop Only) */}
                    <button
                        onClick={() => {
                            const container = document.getElementById('bestseller-scroll');
                            if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                        }}
                        className="absolute left-[-16px] top-1/2 -translate-y-1/2 z-10 bg-white shadow-xl w-9 h-9 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all opacity-0 group-hover/scroll:opacity-100 hidden lg:flex border border-gray-100"
                    >
                        <i className="fa-solid fa-chevron-left text-xs"></i>
                    </button>

                    <button
                        onClick={() => {
                            const container = document.getElementById('bestseller-scroll');
                            if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                        }}
                        className="absolute right-[-16px] top-1/2 -translate-y-1/2 z-10 bg-white shadow-xl w-9 h-9 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all opacity-0 group-hover/scroll:opacity-100 hidden lg:flex border border-gray-100"
                    >
                        <i className="fa-solid fa-chevron-right text-xs"></i>
                    </button>

                    <div
                        id="bestseller-scroll"
                        className="flex gap-3 md:gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x scroll-smooth"
                    >
                        {loading ? (
                            [0, 1, 2, 3, 4].map(i => (
                                <div key={i} className="flex-none w-[70%] sm:w-[45%] md:w-[30%] lg:w-[calc(25%-12px)] snap-start">
                                    <SkeletonCard />
                                </div>
                            ))
                        ) : filtered.length === 0 ? (
                            <div className="w-full flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100">
                                <i className="fa-solid fa-box-open text-5xl text-gray-200 mb-4 block" />
                                <p className="text-gray-400 font-medium">No products in this collection yet.</p>
                            </div>
                        ) : (
                            filtered.map(product => (
                                <div
                                    key={product.id ?? (product as any)._id}
                                    className="flex-none w-[70%] sm:w-[45%] md:w-[30%] lg:w-[calc(25%-12px)] snap-start mb-1"
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-7 text-center">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 border-2 font-bold px-8 py-3 rounded-full transition-all duration-300 group"
                        style={{ borderColor: COLORS.black, color: COLORS.black }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = COLORS.primary;
                            e.currentTarget.style.borderColor = COLORS.primary;
                            e.currentTarget.style.color = COLORS.black;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = COLORS.black;
                            e.currentTarget.style.color = COLORS.black;
                        }}
                    >
                        View All Products <i className="fa-solid fa-arrow-right" />
                    </Link>
                </div>
            </div>
        </section>
    );
}