import React, { Suspense } from 'react';
import Link from 'next/link';
import { API } from '@/constants/api';
import ProductDetailsClient from './ProductDetailsClient';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [res, productsRes] = await Promise.all([
        fetch(API.PRODUCT_DETAIL(id), { next: { revalidate: 60 } }),
        fetch(API.PRODUCTS, { next: { revalidate: 60 } }),
    ]);

    if (!res.ok) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-bg-cream text-center px-6">
                <i className="fa-solid fa-cookie-bite text-6xl text-gray-400 mb-6"></i>
                <h1 className="text-4xl font-heading font-black text-text-dark mb-4">Product Not Found</h1>
                <p className="text-gray-500 mb-8">Oops! We couldn't find the cashew variety you're looking for.</p>
                <a href="/our-product" className="bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-black transition-colors">
                    Return to Shop
                </a>
            </div>
        );
    }

    const product = await res.json();
    const allProducts = productsRes.ok ? await productsRes.json() : [];
    const relatedProducts = allProducts.filter((p: any) => (p._id || p.id) !== id).slice(0, 8);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-primary">Home</Link>
                    <span>/</span>
                    <Link href="/our-product" className="hover:text-primary">Shop</Link>
                    <span>/</span>
                    <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* Client Side Product Details & Gallery */}
                <ProductDetailsClient product={product} />

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-14">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl md:text-3xl font-heading font-black text-gray-900">
                                You May Also Love 🥜
                            </h2>
                            <Link href="/our-product" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                                View All <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {relatedProducts.map((p: any) => {
                                const pid = p._id || p.id;
                                 const hasPDiscount = p.discount > 0;
                                const originalPPrice = hasPDiscount ? p.price / (1 - p.discount / 100) : p.price;
                                return (
                                    <Link key={pid} href={`/our-product/${pid}`}
                                        className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group flex flex-col"
                                    >
                                        <div className="relative bg-gray-50 h-40 flex items-center justify-center overflow-hidden">
                                            {p.discount > 0 && (
                                                <span className="absolute top-2 left-2 bg-yellow text-gray-900 text-[10px] font-black px-2 py-0.5 rounded z-10">
                                                    {p.discount}% OFF
                                                </span>
                                            )}
                                            <img
                                                src={p.image_url || '/images/products/placeholder.jpg'}
                                                alt={p.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-3 flex flex-col flex-1">
                                            <h3 className="font-bold text-sm text-gray-800 mb-1 line-clamp-2">{p.name}</h3>
                                            <div className="flex items-center gap-2 mt-auto">
                                                <span className="font-black text-gray-900 text-sm">₹{p.price.toFixed(0)}</span>
                                                {hasPDiscount && <span className="text-xs text-gray-400 line-through">₹{originalPPrice.toFixed(0)}</span>}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
