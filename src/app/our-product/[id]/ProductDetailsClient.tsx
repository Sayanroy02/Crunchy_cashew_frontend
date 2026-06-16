'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import ProductGallery from './ProductGallery';
import PincodeWidget from '@/components/PincodeWidget';
import ProductComparison from '@/components/products/ProductComparison';
import { useSnackbar } from '@/context/SnackbarContext';

export default function ProductDetailsClient({ product }: { product: any }) {
    const getCategoryColors = (category: string) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('value')) return 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20';
        if (cat.includes('premium')) return 'bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20';
        if (cat.includes('flavor')) return 'bg-[#92400E]/10 text-[#92400E] border-[#92400E]/20';
        if (cat.includes('gift')) return 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20';
        return 'bg-[#F6B000]/10 text-[#F6B000] border-[#F6B000]/20';
    };

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

    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const { showSnackbar } = useSnackbar();

    const isCouponType = product.discount_type === 'coupon' || (!product.discount_type && (product.coupon_enabled || selectedVariant.coupon_code));
    const isDiscountType = product.discount_type === 'discount' || (!product.discount_type && !product.coupon_enabled && selectedVariant.discount > 0);

    const hasDiscount = isDiscountType && selectedVariant.discount > 0;
    const hasCoupon = isCouponType && selectedVariant.coupon_code && selectedVariant.coupon_amount > 0;

    const finalPrice = (hasCoupon && isCouponApplied)
        ? (selectedVariant.original_price - (selectedVariant.coupon_amount || 0))
        : (isDiscountType ? selectedVariant.price : selectedVariant.original_price);
    const originalPrice = selectedVariant.original_price;

    const handleToggleCoupon = () => {
        if (isCouponApplied) {
            setIsCouponApplied(false);
            showSnackbar('Coupon removed', 'info');
        } else {
            setIsCouponApplied(true);
            showSnackbar('Coupon applied successfully!', 'success');
        }
    };

    return (
        <div className="space-y-12">
            {/* Main Product Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row items-start relative">
                {/* Image Gallery */}
                <div className="lg:w-[45%] w-full bg-gray-50 lg:border-r border-b lg:border-b-0 border-gray-100 p-6 md:p-8 lg:sticky lg:top-24 lg:rounded-l-2xl rounded-t-2xl overflow-hidden z-10">
                    <ProductGallery
                        images={product.image_urls && product.image_urls.length > 0 ? product.image_urls : [product.image_url]}
                        name={product.name}
                        videoUrl={product.video_url}
                    />
                </div>

                {/* Details Section */}
                <div className="lg:w-[55%] w-full p-8 md:p-12 flex flex-col justify-between lg:rounded-r-2xl rounded-b-2xl bg-white">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${getCategoryColors(product.category)}`}>
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

                        <div className="flex items-baseline gap-3 mb-5 flex-wrap">
                            <span className="text-3xl md:text-4xl font-black text-gray-900">
                                ₹{finalPrice.toFixed(0)}
                            </span>
                            {hasCoupon && isCouponApplied ? (
                                <>
                                    <span className="text-lg text-gray-400 line-through">₹{selectedVariant.original_price.toFixed(0)}</span>
                                    <span className="bg-green-700 text-white text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                        <i className="fa-solid fa-ticket"></i> {selectedVariant.coupon_code} Offer
                                    </span>
                                </>
                            ) : (
                                hasDiscount && (
                                    <>
                                        <span className="text-lg text-gray-400 line-through">₹{originalPrice.toFixed(0)}</span>
                                        <span className="bg-yellow text-gray-900 text-xs font-black px-2 py-1 rounded">{selectedVariant.discount}% OFF</span>
                                    </>
                                )
                            )}
                        </div>

                        <p className="text-gray-600 text-base leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {/* Coupon Info Section (Zomato District Style) */}
                        {hasCoupon && (
                            <div
                                onClick={handleToggleCoupon}
                                className={`mb-8 p-4 rounded-3xl border-2 cursor-pointer flex items-center justify-between shadow-sm transition-all duration-300 ${isCouponApplied
                                    ? 'bg-gradient-to-r from-green-50 to-emerald-50/35 border-green-500 shadow-green-100/50'
                                    : 'bg-white border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50/20'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 relative rounded-full bg-white border border-gray-100 flex items-center justify-center p-1.5 shrink-0 shadow-sm">
                                        <Image
                                            src="/images/cc-Logo-01-1.png"
                                            alt="CC Logo"
                                            fill
                                            sizes="44px"
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-black uppercase tracking-wide transition-colors duration-200 ${isCouponApplied ? 'text-green-800' : 'text-gray-700'
                                            }`}>{selectedVariant.coupon_code}</span>
                                        <span className="text-xs text-gray-500 font-bold">
                                            {isCouponApplied ? 'Coupon applied successfully!' : `Save ₹${selectedVariant.coupon_amount || product.coupon_discount || 0} with this coupon`}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    {isCouponApplied ? (
                                        <span className="bg-[#00863D] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full tracking-wider uppercase flex items-center gap-1 shadow-sm transition-all duration-200">
                                            <i className="fa-solid fa-check text-[9px]" /> Applied
                                        </span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-700 group-hover:bg-green-600 group-hover:text-white border border-gray-200 text-[10px] font-extrabold px-3 py-1.5 rounded-full tracking-wider uppercase flex items-center gap-1 transition-all duration-200">
                                            Apply
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Variant Selector */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Select Pack Size</p>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((v: any, idx: number) => {
                                        const vIsCouponType = product.discount_type === 'coupon' || (!product.discount_type && (product.coupon_enabled || v.coupon_code));
                                        const vIsDiscountType = product.discount_type === 'discount' || (!product.discount_type && !product.coupon_enabled && v.discount > 0);
                                        const vHasCoupon = vIsCouponType && v.coupon_code && v.coupon_amount > 0;
                                        const vPrice = (vHasCoupon && isCouponApplied) 
                                            ? (v.original_price - (v.coupon_amount || 0))
                                            : (vIsDiscountType ? v.price : v.original_price);
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setSelectedVariant(v);
                                                }}
                                                className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 flex flex-col items-center gap-1 min-w-[80px] ${selectedVariant.size === v.size
                                                    ? 'border-[#00863D] bg-[#00863D] text-white shadow-lg scale-105'
                                                    : 'border-white bg-white text-gray-500 hover:border-gray-200'
                                                    }`}
                                            >
                                                <span>{v.size}</span>
                                                <span className={`text-[10px] ${selectedVariant.size === v.size ? 'text-white' : 'text-gray-400'}`}>₹{vPrice}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Key Features */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {[
                                { icon: '🏭', label: 'Factory-Direct Freshness' },
                                { icon: '🌱', label: 'Premium African Crop' },
                                { icon: '📦', label: 'Resealable Fresh-lock Pouch' },
                                { icon: '🚚', label: 'Free Shipping above ₹1499' },
                            ].map(f => (
                                <div key={f.label} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2">
                                    <span>{f.icon}</span>
                                    {f.label}
                                </div>
                            ))}
                        </div>

                        <AddToCartButton
                            product={product}
                            selectedVariant={{
                                ...selectedVariant,
                                price: finalPrice,
                                original_price: selectedVariant.original_price,
                                discount_type: product.discount_type || ((hasCoupon && isCouponApplied) ? 'coupon' : (isDiscountType ? 'discount' : '')),
                                coupon_code: (hasCoupon && isCouponApplied) ? (selectedVariant.coupon_code || product.coupon_code || '') : '',
                                coupon_amount: (hasCoupon && isCouponApplied) ? (selectedVariant.coupon_amount || product.coupon_discount || 0) : 0,
                                available_coupon_code: hasCoupon ? (selectedVariant.coupon_code || product.coupon_code || '') : '',
                                available_coupon_amount: hasCoupon ? (selectedVariant.coupon_amount || product.coupon_discount || 0) : 0
                            }}
                        />

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

            {/* Price Comparison */}
            <ProductComparison product={product} />
        </div>
    );
}
