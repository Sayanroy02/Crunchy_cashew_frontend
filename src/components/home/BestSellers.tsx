'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import ProductCard, { Product } from '@/components/products/ProductCard';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';
import SectionHeading from '@/components/ui/SectionHeading';
import { motion } from 'framer-motion';

type CategoryFilter = 'all' | 'Value Packs' | 'Premium' | 'Flavors' | 'Gifting';

const CATEGORIES: { value: CategoryFilter; label: string; icon: string }[] = [
    { value: 'all', label: 'All', icon: 'fa-solid fa-border-all' },
    { value: 'Value Packs', label: 'Value Packs', icon: 'fa-solid fa-box-open' },
    { value: 'Premium', label: 'Premium', icon: 'fa-solid fa-crown' },
    { value: 'Flavors', label: 'Flavors', icon: 'fa-solid fa-pepper-hot' },
    { value: 'Gifting', label: 'Gifting', icon: 'fa-solid fa-gift' },
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


export default function BestSellers() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTag, setActiveTag] = useState<CategoryFilter>('all');

    useEffect(() => {
        fetch(API.PRODUCTS)
            .then(res => res.json())
            .then((data: any) => {
                const productList = Array.isArray(data) ? data : (data?.products || data?.data || []);
                setProducts(productList);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch bestsellers:", err);
                setProducts([]);
                setLoading(false);
            });
    }, []);

    const filtered = useMemo(() => {
        const list = Array.isArray(products) ? products : [];
        // First filter by active category tab
        let result = list.filter(p => {
            if (activeTag === 'all') return true;
            return (p.category || '').toLowerCase() === activeTag.toLowerCase();
        });
        
        // Filter to best sellers (p.isBestSeller === true or has popular/bestseller tags)
        const bestSellers = result.filter(p => 
            p.isBestSeller || 
            p.tags?.some(t => ['best seller', 'bestseller', 'popular', 'trending'].includes(t.toLowerCase()))
        );
        
        // Fallback to general list if no products are explicitly marked as bestseller/popular
        if (bestSellers.length > 0) {
            result = bestSellers;
        }
        
        // Limit to 8 products for optimal rendering performance
        return result.slice(0, 8);
    }, [products, activeTag]);

    return (
        <section data-bestsellers className="pt-12 md:pt-14 pb-8 md:pb-10 bg-bg relative overflow-hidden">
            {/* Floating Parachute Cashew (desktop only) */}
            {/* <motion.div
                initial={{ y: 0, rotate: -5 }}
                animate={{
                    y: [0, -30, 0],
                    rotate: [-8, 8, -8],
                    x: [0, 10, 0]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute right-[4%] lg:right-[8%] top-[8%] w-[130px] lg:w-[175px] pointer-events-none select-none z-10 hidden xl:block"
            >
                <img
                    src="/images/Cashew-parachute-03-p-800.png"
                    alt="Parachute Cashew"
                    className="w-full h-auto drop-shadow-2xl"
                />
            </motion.div> */}

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">

                {/* Heading */}
                <div className="text-center mb-5 md:mb-6">
                    <span
                        className="font-bold tracking-[4px] uppercase text-xs mb-2 block"
                        style={{ color: COLORS.text }}
                    >
                        Handpicked For You
                    </span>
                    <SectionHeading text="Our" highlight="Best Sellers" />
                </div>

                {/* Tag Filter Pills */}
                <div className="flex items-center gap-2 mb-5 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:justify-center md:flex-wrap">
                    {CATEGORIES.map(tag => (
                        <button
                            key={tag.value}
                            onClick={() => setActiveTag(tag.value)}
                            className={`
                                flex-none inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold
                                border-2 transition-all duration-200 whitespace-nowrap hover:bg-primary hover:text-black
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
                        className="absolute left-[-40px] top-1/2 -translate-y-1/2 z-10 bg-white shadow-xl w-9 h-9 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all opacity-0 group-hover/scroll:opacity-100 hidden lg:flex border border-gray-100"
                    >
                        <i className="fa-solid fa-chevron-left text-xs"></i>
                    </button>

                    <button
                        onClick={() => {
                            const container = document.getElementById('bestseller-scroll');
                            if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                        }}
                        className="absolute right-[-40px] top-1/2 -translate-y-1/2 z-10 bg-white shadow-xl w-9 h-9 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all opacity-0 group-hover/scroll:opacity-100 hidden lg:flex border border-gray-100"
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
                        href="/our-product"
                        className="bg-green-700 text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl inline-flex items-center justify-center gap-2"
                    >
                        View All Products <i className="fa-solid fa-arrow-right" />
                    </Link>
                </div>
            </div>
        </section>
    );
}