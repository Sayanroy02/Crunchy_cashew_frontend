'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/store/features/cartSlice';
import { API } from '@/constants/api';

export default function AddToCartButton({ product }: { product: any }) {
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();

    const handleAdd = () => {
        dispatch(addToCart({
            product_id: product.id || product._id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image_url: product.image_url
        }));
        // Could dispatch an open cart drawer event here
    };

    if (product.stock <= 0) {
        return (
            <button disabled className="w-full bg-gray-200 text-gray-500 font-bold text-lg py-5 rounded-xl cursor-not-allowed">
                Currently Unavailable
            </button>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center justify-between border-2 border-gray-200 rounded-xl px-4 py-2 w-full sm:w-1/3">
                <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-500 hover:text-text-dark transition-colors px-2 py-2"
                >
                    <i className="fa-solid fa-minus"></i>
                </button>
                <span className="font-bold text-xl">{quantity}</span>
                <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="text-gray-500 hover:text-text-dark transition-colors px-2 py-2"
                >
                    <i className="fa-solid fa-plus"></i>
                </button>
            </div>

            <button
                onClick={handleAdd}
                className="w-full sm:w-2/3 bg-highlight text-text-dark font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-yellow hover:shadow-yellow-400/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
            >
                <i className="fa-solid fa-bag-shopping"></i> Add to Cart
            </button>
        </div>
    );
}
