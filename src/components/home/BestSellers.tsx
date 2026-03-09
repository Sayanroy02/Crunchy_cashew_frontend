'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard, { Product } from '@/components/products/ProductCard';

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

    useEffect(() => {
        fetch('http://localhost:8000/api/products/')
            .then(res => res.json())
            .then(data => { setProducts(data.slice(0, 4)); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    return (
        // ✅ py-16 md:py-24 → pt-8 pb-16 md:pt-10 md:pb-20: cuts top padding roughly in half
        <section className="pt-8 pb-16 md:pt-10 md:pb-20 bg-[#fffdf5]">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <span className="text-[#0c5c2b] font-bold tracking-[4px] uppercase text-xs mb-2 block">Handpicked For You</span>
                    <h2 className="text-3xl md:text-4xl font-black text-[#2c1a0e] mb-3">
                        Our Best Sellers
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-sm">
                        Experience the crunch. Premium, sustainably packaged, straight from our factory.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {loading
                        ? [0, 1, 2, 3].map(i => <SkeletonCard key={i} />)
                        : products.map(product => (
                            <div key={product.id || (product as any)._id}>
                                <ProductCard product={product} />
                            </div>
                        ))
                    }
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 border-2 border-[#0c5c2b] text-[#0c5c2b] font-bold px-8 py-3 rounded-full hover:bg-[#0c5c2b] hover:text-white transition-all duration-300"
                    >
                        View All Products <i className="fa-solid fa-arrow-right" />
                    </Link>
                </div>
            </div>
        </section>
    );
}