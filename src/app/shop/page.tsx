'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard, { Product } from '@/components/products/ProductCard';

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/api/products/')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch products:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="bg-bg-cream min-h-screen pb-20">
            {/* Header */}
            <section className="bg-black text-white py-16 px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Our Premium Shop</h1>
                <p className="text-gray-300 max-w-2xl mx-auto text-lg">Browse our selection of the finest cashews. Guaranteed freshness in every bite.</p>
            </section>

            {/* Product Grid */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white rounded-[20px] shadow-sm overflow-hidden flex flex-col h-[400px]">
                                <div className="w-full h-[60%] bg-gray-200 animate-pulse"></div>
                                <div className="p-6 flex flex-col gap-4 flex-1">
                                    <div className="h-6 bg-gray-300 rounded-md w-3/4 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded-md w-1/4 animate-pulse"></div>
                                    <div className="mt-auto flex justify-between items-center">
                                        <div className="h-6 bg-gray-300 rounded-md w-1/3 animate-pulse"></div>
                                        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center text-gray-500 py-20 text-xl font-medium">No products found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
