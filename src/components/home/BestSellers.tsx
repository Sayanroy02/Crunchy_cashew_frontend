'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCard, { Product } from '@/components/products/ProductCard';
import { API } from '@/constants/api';

type TagFilter = 'best_seller' | 'newest' | 'gifting' | 'event';

const TAGS: { value: TagFilter; label: string; icon: string }[] = [
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

export default function BestSellers() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTag, setActiveTag] = useState<TagFilter>('best_seller');

    useEffect(() => {
        fetch(API.PRODUCTS)
            .then(res => res.json())
            .then((data: Product[]) => { setProducts(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    // Mirror the same filter logic used in ShopPage
    const filtered = useMemo(() => {
        return products
            .filter(p => {
                if (activeTag === 'best_seller') return !!p.isBestSeller;
                if (activeTag === 'newest') return !!p.isNew;
                if (activeTag === 'gifting') return !!p.isGift;
                if (activeTag === 'event') return !!p.event?.type;
                return true;
            })
            .slice(0, 4); // cap at 4 cards like the original
    }, [products, activeTag]);

    return (
        <section className="py-8 md:py-12 bg-bg">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {/* Heading */}
                <div className="text-center mb-6 md:mb-8">
                    <span className="text-primary font-bold tracking-[4px] uppercase text-xs mb-2 block">
                        Handpicked For You
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-[#2c1a0e] mb-3">
                        Our Best Sellers
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-sm">
                        Experience the crunch. Premium, sustainably packaged, straight from our factory.
                    </p>
                </div>

                {/* Tag Filter Pills */}
                <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
                    {TAGS.map(tag => (
                        <button
                            key={tag.value}
                            onClick={() => setActiveTag(tag.value)}
                            className={`
                                inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                                border-2 transition-all duration-200 whitespace-nowrap
                                ${activeTag === tag.value
                                    ? 'bg-primary border-primary text-white shadow-md scale-105'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                                }
                            `}
                        >
                            <i className={`${tag.icon} text-xs`} />
                            {tag.label}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 min-h-[280px]">
                    {loading ? (
                        [0, 1, 2, 3].map(i => <SkeletonCard key={i} />)
                    ) : filtered.length === 0 ? (
                        // Empty state — spans full grid width
                        <div className="col-span-2 lg:col-span-4 flex flex-col items-center justify-center py-16 text-center">
                            <i className="fa-solid fa-box-open text-5xl text-gray-200 mb-4 block" />
                            <p className="text-gray-400 font-medium">
                                No products in this collection yet.
                            </p>
                        </div>
                    ) : (
                        filtered.map(product => (
                            <ProductCard key={product.id ?? (product as any)._id} product={product} />
                        ))
                    )}
                </div>

                {/* CTA */}
                <div className="mt-10 text-center">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
                    >
                        View All Products <i className="fa-solid fa-arrow-right" />
                    </Link>
                </div>
            </div>
        </section>
    );
}