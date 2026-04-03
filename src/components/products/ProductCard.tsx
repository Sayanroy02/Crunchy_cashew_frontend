'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/store/features/cartSlice';
import { useSnackbar } from '@/context/SnackbarContext';
import { COLORS } from '@/constants/styles';

export interface Variant {
    size: string;
    price: number;
    original_price: number;
    discount: number;
    stock: number;
    is_available: boolean;
}

export interface Product {
    id?: string;
    _id?: string;
    name: string;
    description?: string;
    variants: Variant[];
    image_url: string;
    category: string;
    tags?: string[];
    isNew?: boolean;
    isBestSeller?: boolean;
    isGift?: boolean;
    isValuePack?: boolean;
    isPremium?: boolean;
    isFlavors?: boolean;
    event?: {
        type: string;
        label: string;
    };
    salesCount?: number;
    createdAt?: string;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const dispatch = useDispatch();
    const { showSnackbar } = useSnackbar();

    // Initialize with first available variant or a synthesized fallback for legacy data
    const [selectedVariant, setSelectedVariant] = useState<Variant>(() => {
        if (product.variants && product.variants.length > 0) {
            return product.variants[0];
        }
        // Fallback for legacy products during transition
        return {
            size: 'Standard',
            price: (product as any).price || 0,
            original_price: (product as any).price || 0,
            discount: (product as any).discount || 0,
            stock: (product as any).stock || 0,
            is_available: true
        };
    });

    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('wishlistItems');
            if (saved) {
                const list: string[] = JSON.parse(saved);
                setIsWishlisted(list.includes(product.id || product._id || ''));
            }
        } catch (e) { console.error('Wishlist init error', e); }
    }, [product.id, product._id]);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        const targetId = product.id || product._id || '';
        try {
            const saved = localStorage.getItem('wishlistItems');
            let list: string[] = saved ? JSON.parse(saved) : [];

            if (list.includes(targetId)) {
                list = list.filter(id => id !== targetId);
                setIsWishlisted(false);
                showSnackbar('Removed from wishlist', 'info');
            } else {
                list.push(targetId);
                setIsWishlisted(true);
                showSnackbar('Added to wishlist', 'success');
            }

            localStorage.setItem('wishlistItems', JSON.stringify(list));
        } catch (e) { console.error('Wishlist toggle error', e); }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!selectedVariant) return;

        dispatch(addToCart({
            product_id: product.id || product._id || '',
            variant_size: selectedVariant.size,
            name: `${product.name} (${selectedVariant.size})`,
            price: selectedVariant.price,
            quantity: 1,
            image_url: product.image_url
        }));
        showSnackbar(`${product.name} (${selectedVariant.size}) added to cart`, 'success');
    };

    const hasDiscount = selectedVariant.discount > 0;
    const originalPrice = selectedVariant.original_price || (selectedVariant.price / (1 - selectedVariant.discount / 100));

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col group border border-gray-100 h-full">
            <Link
                href={`/shop/${product.id || product._id}`}
                className="relative w-full aspect-[4/3] bg-[#f8faf9] py-8 px-4 flex justify-center items-center overflow-hidden"
            >
                <Image
                    src={product.image_url || '/images/products/placeholder.jpg'}
                    alt={product.name}
                    width={400}
                    height={300}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={product.isBestSeller}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                />

                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {product.event && product.event.label && (
                        <div className="bg-[#EF4444] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md tracking-wide uppercase">
                            {product.event.label}
                        </div>
                    )}
                    {product.isNew && (
                        <div className="bg-[#00863D] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md tracking-wide uppercase">
                            NEW
                        </div>
                    )}
                    {product.isBestSeller && (
                        <div className="bg-[#F6B000] text-black text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md tracking-wide uppercase">
                            BEST SELLER
                        </div>
                    )}
                    {product.isGift && (
                        <div className="bg-[#2563EB] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md tracking-wide uppercase">
                            GIFTING
                        </div>
                    )}
                    {product.isValuePack && (
                        <div className="bg-[#F97316] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md tracking-wide uppercase">
                            VALUE PACK
                        </div>
                    )}
                    {product.isPremium && (
                        <div className="bg-[#7C3AED] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md tracking-wide uppercase">
                            PREMIUM
                        </div>
                    )}
                    {product.isFlavors && (
                        <div className="bg-[#92400E] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md tracking-wide uppercase">
                            FLAVORS
                        </div>
                    )}
                    {hasDiscount && selectedVariant.stock > 0 && (
                        <div className="bg-[#F6B000] text-black text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md tracking-wide">
                            {selectedVariant.discount}% OFF
                        </div>
                    )}
                </div>

                {selectedVariant.stock <= 0 && (
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <div className="bg-red-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-xl transform -rotate-12 border-2 border-white">
                            OUT OF STOCK
                        </div>
                    </div>
                )}

                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-3 right-3 z-20 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform text-black"
                    aria-label="Toggle Wishlist"
                >
                    <i className={`${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart text-lg`}></i>
                </button>
            </Link>

            <div className="p-5 flex flex-col flex-grow bg-white">
                <Link href={`/shop/${product.id || product._id}`}>
                    <div className="text-xs font-bold text-black opacity-60 uppercase tracking-wider mb-1">{product.category}</div>
                    <h3 className="text-base font-heading font-bold text-black mb-3 line-clamp-2 leading-tight hover:text-primary transition-colors">
                        {product.name.length > 20 ? `${product.name.slice(0, 20)}...` : product.name} <span className="ml-1 font-black shrink-0" style={{ color: COLORS.heading }}>({selectedVariant.size})</span>
                    </h3>
                </Link>

                {/* Enhanced Variant Selector */}
                {product.variants && product.variants.length > 0 && (
                    <div className="mb-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Size</span>
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase">
                                {selectedVariant.size}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {product.variants.map((v, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedVariant(v);
                                    }}
                                    className={`relative group px-2.5 py-1.5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center min-w-[50px] ${
                                        selectedVariant.size === v.size
                                            ? 'border-[#00863D] bg-[#00863D] text-white shadow-md -translate-y-0.5'
                                            : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-white'
                                    }`}
                                >
                                    <span className="text-[11px] font-black break-keep">{v.size}</span>
                                    {selectedVariant.size === v.size && (
                                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Thin Marketing Tags Row */}
                <div className="mb-2 flex flex-wrap gap-1.5 min-h-[18px]">
                    {product.isValuePack && (
                        <span className="text-[9px] font-black bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 px-2 py-0.5 rounded-md uppercase tracking-tighter">Value Pack</span>
                    )}
                    {product.isPremium && (
                        <span className="text-[9px] font-black bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20 px-2 py-0.5 rounded-md uppercase tracking-tighter">Premium</span>
                    )}
                    {product.isFlavors && (
                        <span className="text-[9px] font-black bg-[#92400E]/10 text-[#92400E] border border-[#92400E]/20 px-2 py-0.5 rounded-md uppercase tracking-tighter">Flavors</span>
                    )}
                    {product.isBestSeller && (
                        <span className="text-[9px] font-black bg-[#F6B000]/10 text-[#F6B000] border border-[#F6B000]/20 px-2 py-0.5 rounded-md uppercase tracking-tighter">Best Seller</span>
                    )}
                    {product.isNew && (
                        <span className="text-[9px] font-black bg-[#00863D]/10 text-[#00863D] border border-[#00863D]/20 px-2 py-0.5 rounded-md uppercase tracking-tighter">New Arrival</span>
                    )}
                    {product.isGift && (
                        <span className="text-[9px] font-black bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20 px-2 py-0.5 rounded-md uppercase tracking-tighter">Gifting</span>
                    )}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-gray-50">
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-black font-black text-xl">₹{selectedVariant.price.toFixed(0)}</span>
                            {hasDiscount && (
                                <span className="text-gray-400 text-xs line-through font-medium">₹{originalPrice.toFixed(0)}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${selectedVariant.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                                {selectedVariant.stock > 0 ? (selectedVariant.stock < 10 ? `Only ${selectedVariant.stock} left!` : 'In Stock') : 'Restocking'}
                            </span>
                        </div>
                    </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={selectedVariant.stock <= 0}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${selectedVariant.stock > 0
                                ? 'bg-primary text-black hover:bg-black hover:text-white hover:shadow-lg hover:-translate-y-1 active:translate-y-0'
                                : 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-200'
                                }`}
                            style={selectedVariant.stock > 0 ? { backgroundColor: COLORS.primary } : {}}
                            aria-label="Add to cart"
                        >
                            <i className={`fa-solid ${selectedVariant.stock > 0 ? 'fa-bag-shopping' : 'fa-hourglass-start'} text-sm`}></i>
                        </button>
                </div>
            </div>
        </div>
    );
}
