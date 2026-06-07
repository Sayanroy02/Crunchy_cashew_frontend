'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/store/features/cartSlice';
import { API } from '@/constants/api';

export default function AddToCartButton({ product, selectedVariant }: { product: any, selectedVariant: any }) {
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();

    const handleAdd = () => {
        if (!selectedVariant) return;
        dispatch(addToCart({
            product_id: product.id || product._id,
            variant_size: selectedVariant.size,
            name: `${product.name} (${selectedVariant.size})`,
            price: selectedVariant.price,
            original_price: selectedVariant.original_price,
            discount_type: selectedVariant.discount_type,
            coupon_code: selectedVariant.coupon_code,
            coupon_amount: selectedVariant.coupon_amount,
            quantity: quantity,
            image_url: product.image_url
        }));
        // Optional: show snackbar or open cart
    };

    const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;

    if (isOutOfStock) {
        return (
            <button disabled className="w-full bg-gray-200 text-gray-400 font-black text-lg py-5 rounded-2xl cursor-not-allowed border-2 border-gray-100 flex items-center justify-center gap-3">
                <i className="fa-solid fa-clock-rotate-left"></i> Restocking Soon
            </button>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center justify-between border-2 border-gray-200 bg-white rounded-2xl px-5 py-3 w-full sm:w-[160px] shadow-sm">
                <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-400 hover:text-black transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                >
                    <i className="fa-solid fa-minus text-sm"></i>
                </button>
                <span className="font-black text-xl w-8 text-center">{quantity}</span>
                <button
                    onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                    className="text-gray-400 hover:text-black transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                >
                    <i className="fa-solid fa-plus text-sm"></i>
                </button>
            </div>

            <button
                onClick={handleAdd}
                className="flex-1 text-white font-bold p-4 rounded-2xl text-base transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2"
                style={{ backgroundColor: '#00863D' }}
            >
                <i className="fa-solid fa-bag-shopping text-sm"></i> Add to Cart
            </button>
        </div>
    );
}
