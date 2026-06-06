'use client';

import React, { useState } from 'react';
import AddToCartButton from './AddToCartButton';
import ProductGallery from './ProductGallery';
import PincodeWidget from '@/components/PincodeWidget';
import ProductComparison from '@/components/products/ProductComparison';

export default function ProductDetailsClient({ product }: { product: any }) {
    // Initialize with first available variant or legacy data
    const [selectedVariant, setSelectedVariant] = useState(() => {
        if (product.variants && product.variants.length > 0) {
            return product.variants[0];
        }
        return {
            size: 'Standard',
            price: product.price || 0,
            original_price: product.original_price || (product.price ? product.price / (1 - (product.discount || 0) / 100) : 0),
            discount: product.discount || 0,
            stock: product.stock || 0,
            is_available: product.is_available !== false
        };
    });

    const hasDiscount = selectedVariant.discount > 0;
    const originalPrice = selectedVariant.original_price;

    return (
        <div className="space-y-12">
            {/* Main Product Info Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col lg:flex-row">
                {/* Image Gallery */}
                <div className="lg:w-[45%] bg-gray-50 border-r border-gray-100">
                    <ProductGallery 
                        images={product.image_urls && product.image_urls.length > 0 ? product.image_urls : [product.image_url]} 
                        name={product.name} 
                        videoUrl={product.video_url}
                    />
                </div>

                {/* Details Section */}
                <div className="lg:w-[55%] p-8 md:p-12 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                {product.category}
                            </span>
                            {selectedVariant.stock > 0 ? (
                                <span className="bg-primary/20 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">In Stock</span>
                            ) : (
                                <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Out of Stock</span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 mb-4 leading-tight">
                            {product.name} <span style={{ color: '#00863D' }} className="font-black">({selectedVariant.size})</span>
                        </h1>

                        <div className="flex items-baseline gap-3 mb-5">
                            <span className="text-3xl md:text-4xl font-black text-gray-900">
                                ₹{selectedVariant.price.toFixed(0)}
                            </span>
                            {hasDiscount && (
                                <>
                                    <span className="text-lg text-gray-400 line-through">₹{originalPrice.toFixed(0)}</span>
                                    <span className="bg-yellow text-gray-900 text-xs font-black px-2 py-1 rounded">{selectedVariant.discount}% OFF</span>
                                </>
                            )}
                        </div>

                        <p className="text-gray-600 text-base leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {/* Variant Selector */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Select Pack Size</p>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((v: any, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedVariant(v)}
                                            className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 flex flex-col items-center gap-1 min-w-[80px] ${
                                                selectedVariant.size === v.size
                                                    ? 'border-[#00863D] bg-[#00863D] text-white shadow-lg scale-105'
                                                    : 'border-white bg-white text-gray-500 hover:border-gray-200'
                                            }`}
                                        >
                                            <span>{v.size}</span>
                                            <span className={`text-[10px] ${selectedVariant.size === v.size ? 'text-primary' : 'text-gray-400'}`}>₹{v.price}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Key Features */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {[
                                { icon: '🏭', label: 'Direct from factory' },
                                { icon: '🌱', label: '100% Natural' },
                                { icon: '📦', label: 'Hygienic packaging' },
                                { icon: '🚚', label: 'Free ship on ₹999+' },
                            ].map(f => (
                                <div key={f.label} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2">
                                    <span>{f.icon}</span>
                                    {f.label}
                                </div>
                            ))}
                        </div>

                        <AddToCartButton product={product} selectedVariant={selectedVariant} />

                        {/* Pincode delivery check */}
                        <div className="mt-8">
                            <p className="text-sm font-semibold text-gray-700 mb-2">🚚 Check Delivery at Your Pincode</p>
                            <PincodeWidget />
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-12 pt-6 border-t border-gray-100 flex flex-wrap gap-6 text-xs text-gray-500">
                        <span className="flex items-center gap-2"><i className="fa-solid fa-shield-halved text-primary"></i> Secure Checkout</span>
                        <span className="flex items-center gap-2"><i className="fa-solid fa-rotate-left text-primary"></i> Easy Returns</span>
                        <span className="flex items-center gap-2"><i className="fa-brands fa-whatsapp text-primary"></i> WhatsApp Support</span>
                    </div>
                </div>
            </div>

            {/* Price Comparison - Passing selected variant's price */}
            <ProductComparison product={{ 
                ...product, 
                price: selectedVariant.price 
            }} />
        </div>
    );
}
