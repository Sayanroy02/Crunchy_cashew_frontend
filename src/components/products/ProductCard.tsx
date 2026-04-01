'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/store/features/cartSlice';
import { useSnackbar } from '@/context/SnackbarContext';

export interface Product {
    id?: string;
    _id?: string;
    name: string;
    description?: string;
    price: number;
    discount: number;
    image_url: string;
    category: string;
    stock: number;
    tags?: string[];
    isNew?: boolean;
    isBestSeller?: boolean;
    isGift?: boolean;
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
        dispatch(addToCart({
            product_id: product.id || product._id || '',
            name: product.name,
            price: product.price,
            quantity: 1,
            image_url: product.image_url
        }));
        showSnackbar('Added to cart', 'success');
    };

    const hasDiscount = product.discount > 0;
    const originalPrice = hasDiscount
        ? product.price / (1 - product.discount / 100)
        : product.price;

    return (
        <Link
            href={`/shop/${product.id || product._id}`}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col group border border-gray-100"
        >
            <div className="relative w-full aspect-[4/3] bg-[#f8faf9] py-8 px-4 flex justify-center items-center overflow-hidden">
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
                    {product.isNew && (
                        <div className="bg-black text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md tracking-wide uppercase">
                            NEW
                        </div>
                    )}
                    {product.isBestSeller && (
                        <div className="bg-primary text-black text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md tracking-wide uppercase">
                            BEST SELLER
                        </div>
                    )}
                    {product.isGift && (
                        <div className="bg-black text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md tracking-wide uppercase">
                            GIFT
                        </div>
                    )}
                    {product.event && product.event.label && (
                        <div className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md tracking-wide uppercase">
                            {product.event.label}
                        </div>
                    )}
                    {hasDiscount && product.stock > 0 && !product.isNew && !product.isBestSeller && (
                        <div className="bg-primary text-black text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md tracking-wide">
                            {product.discount}% OFF
                        </div>
                    )}
                </div>

                {product.stock <= 0 && (
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
            </div>

            <div className="p-5 flex flex-col flex-grow bg-white">
                <div className="text-xs font-bold text-black opacity-60 uppercase tracking-wider mb-1">{product.category}</div>
                <h3 className="text-base font-heading font-bold text-black mb-2 line-clamp-2 leading-tight">
                    {product.name}
                </h3>

                <div className="mt-auto pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex items-baseline gap-2">
                        <p className="text-black font-bold text-lg">₹{product.price.toFixed(0)}</p>
                        {hasDiscount && (
                            <p className="text-gray-400 text-sm line-through">₹{originalPrice.toFixed(0)}</p>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className={`hidden sm:flex w-11 h-11 rounded-full items-center justify-center transition-all shadow-sm ${product.stock > 0
                            ? 'bg-heading text-black hover:bg-primary hover:text-black hover:shadow-md hover:scale-105'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        aria-label="Add to cart"
                    >
                        <i className="fa-solid fa-cart-plus text-sm"></i>
                    </button>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className={`sm:hidden w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-sm ${product.stock > 0
                            ? 'bg-heading text-white active:bg-primary active:text-black'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        aria-label="Add to cart"
                    >
                        <i className="fa-solid fa-cart-plus"></i> {product.stock > 0 ? 'Add' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </Link>
    );
}
