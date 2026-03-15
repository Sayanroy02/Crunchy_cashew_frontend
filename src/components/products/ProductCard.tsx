'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/store/features/cartSlice';

export interface Product {
    id?: string;
    _id?: string;
    name: string;
    price: number;
    discount: number;
    image_url: string;
    category: string;
    stock: number;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const dispatch = useDispatch();

    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        // Hydrate wishlist status on load
        try {
            const saved = localStorage.getItem('wishlistItems');
            if (saved) {
                const list: string[] = JSON.parse(saved);
                setIsWishlisted(list.includes(product.id || product._id || ''));
            }
        } catch (e) { console.error('Wishlist init error', e); }
    }, [product.id, product._id]);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to single product page when clicking heart
        const targetId = product.id || product._id || '';
        try {
            const saved = localStorage.getItem('wishlistItems');
            let list: string[] = saved ? JSON.parse(saved) : [];

            if (list.includes(targetId)) {
                list = list.filter(id => id !== targetId);
                setIsWishlisted(false);
            } else {
                list.push(targetId);
                setIsWishlisted(true);
            }

            localStorage.setItem('wishlistItems', JSON.stringify(list));
        } catch (e) { console.error('Wishlist toggle error', e); }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to single product page when clicking Add
        dispatch(addToCart({
            product_id: product.id || product._id || '',
            name: product.name,
            price: product.price,
            quantity: 1,
            image_url: product.image_url
        }));
    };

    // Calculate original price before discount
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
                <img
                    src={product.image_url || '/images/products/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                />

                {/* Discount Badge */}
                {hasDiscount && product.stock > 0 && (
                    <div className="absolute top-3 left-3 bg-[#f5a623] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md z-10 tracking-wide">
                        {product.discount}% OFF
                    </div>
                )}

                {/* Out of Stock Badge */}
                {product.stock <= 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                        Out of Stock
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-3 right-3 z-20 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform text-primary"
                    aria-label="Toggle Wishlist"
                >
                    <i className={`${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart text-lg`}></i>
                </button>
            </div>

            <div className="p-5 flex flex-col flex-grow bg-white">
                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{product.category}</div>
                <h3 className="text-base font-heading font-bold text-text-dark mb-2 line-clamp-2 leading-tight">
                    {product.name}
                </h3>

                <div className="mt-auto pt-3 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <p className="text-primary font-bold text-lg">₹{product.price.toFixed(0)}</p>
                        {hasDiscount && (
                            <p className="text-gray-400 text-sm line-through">₹{originalPrice.toFixed(0)}</p>
                        )}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-sm ${product.stock > 0
                            ? 'bg-primary text-white hover:bg-[#0a4f25] hover:shadow-md hover:scale-105'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        aria-label="Add to cart"
                    >
                        <i className="fa-solid fa-cart-plus text-sm"></i>
                    </button>
                </div>
            </div>
        </Link>
    );
}
