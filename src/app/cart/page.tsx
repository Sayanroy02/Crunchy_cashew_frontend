'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { removeFromCart, updateQuantity, clearCart, autoApplyCoupons } from '@/lib/store/features/cartSlice';
import ProductCard, { Product } from '@/components/products/ProductCard';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';
import SectionHeading from '@/components/ui/SectionHeading';
import { useSnackbar } from '@/context/SnackbarContext';

function RecommendedProducts() {
    const [products, setProducts] = React.useState<Product[]>([]);

    React.useEffect(() => {
        fetch(API.PRODUCTS)
            .then(res => res.json())
            .then(data => {
                // Shuffle and pick 3 random products
                const shuffled = data.sort(() => 0.5 - Math.random());
                setProducts(shuffled.slice(0, 3));
            })
            .catch(err => console.error("Failed to fetch recommendations", err));
    }, []);

    if (products.length === 0) return null;

    return (
        <div className="mt-16 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black font-heading text-black mb-6">Customers Also Bought</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product, idx) => (
                    <ProductCard key={product.id || product._id || idx} product={product} />
                ))}
            </div>
        </div>
    );
}

export default function CartPage() {
    const { items, totalAmount } = useSelector((state: RootState) => state.cart);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const { showSnackbar } = useSnackbar();

    React.useEffect(() => {
        const hasUnappliedCoupons = items.some(item => item.available_coupon_code && !item.coupon_code);
        if (hasUnappliedCoupons) {
            dispatch(autoApplyCoupons());
            showSnackbar('Your offer has been applied.', 'success');
        }
    }, [items, dispatch, showSnackbar]);

    const totalMRP = items.reduce((sum, item) => sum + ((item.original_price || item.price) * item.quantity), 0);
    const totalDiscount = items.reduce((sum, item) => sum + (((item.original_price || item.price) - item.price) * item.quantity), 0);

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9E7] px-6 py-16">
                <i className="fa-solid fa-cart-arrow-down text-6xl text-gray-400/50 mb-6 animate-bounce"></i>
                <h1 className="text-3xl font-heading font-black text-black mb-4">Your Cart is Empty</h1>
                <p className="text-black/40 mb-8 text-center max-w-md">Looks like you haven't added any of our delicious cashews to your cart yet.</p>
                <Link href="/our-product" className="bg-green-700 text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2"
                    style={{ backgroundColor: '#00863D' }}>
                    <i className="fa-solid fa-store text-sm md:text-xs" />
                    <span>Start Shopping</span>
                </Link>
            </div>
        );
    }

    return (
        <div className={`min-h-screen py-16 px-4 md:px-8 bg-[#FFF9E7]`}>
            <div className="max-w-6xl mx-auto">
                <div className="mb-5 pb-4">
                    <SectionHeading text="Shopping" highlight="Cart" className="text-4xl md:text-5xl" textColor={COLORS.heading} />
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items List */}
                    <div className="lg:w-2/3 bg-white rounded-3xl p-6 md:p-8 shadow-xl">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                            <span className="font-bold text-gray-500 uppercase tracking-wider text-sm">{items.length} Items</span>
                            <button
                                onClick={() => dispatch(clearCart())}
                                className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1 transition-colors"
                            >
                                <i className="fa-solid fa-trash-can"></i> Clear All
                            </button>
                        </div>

                        <div className="flex flex-col gap-6">
                            {items.map(item => (
                                <div key={`${item.product_id}-${item.variant_size}`} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-4 w-full sm:w-1/2 mb-4 sm:mb-0">
                                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                            <i className="fa-solid fa-box text-xl" style={{ color: '#F6B000' }}></i>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-black text-lg line-clamp-1">{item.name}</h3>
                                            <p className="font-black" style={{ color: '#F6B000' }}>₹{item.price.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between w-full sm:w-1/2 sm:justify-end gap-6">
                                        <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                            <button
                                                onClick={() => dispatch(updateQuantity({ id: item.product_id, size: item.variant_size, change: -1 }))}
                                                className="px-3 py-1 text-gray-500 hover:bg-black hover:text-white transition-all"
                                            >
                                                <i className="fa-solid fa-minus text-xs"></i>
                                            </button>
                                            <span className="px-4 font-bold text-black">{item.quantity}</span>
                                            <button
                                                onClick={() => dispatch(updateQuantity({ id: item.product_id, size: item.variant_size, change: 1 }))}
                                                className="px-3 py-1 text-gray-500 hover:bg-black hover:text-white transition-all"
                                            >
                                                <i className="fa-solid fa-plus text-xs"></i>
                                            </button>
                                        </div>

                                        <div className="font-bold text-black w-24 text-right">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </div>

                                        <button
                                            onClick={() => dispatch(removeFromCart({ id: item.product_id, size: item.variant_size }))}
                                            className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shrink-0"
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="rounded-3xl p-8 shadow-2xl sticky top-28 text-white" style={{ backgroundColor: COLORS.heading }}>
                            <h2 className="text-2xl font-heading font-black mb-6 pb-4 border-b text-white" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>Order Summary</h2>

                            <div className="flex flex-col gap-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/80 font-medium">MRP Total</span>
                                    <span className="font-bold text-white">₹{totalMRP.toFixed(2)}</span>
                                </div>
                                {totalDiscount > 0 && (
                                    <div className="flex justify-between items-center text-green-400 font-medium">
                                        <span>Discounts</span>
                                        <span>-₹{totalDiscount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-white/80 font-medium">
                                    <span>Shipping</span>
                                    <span className="text-xs text-white/65">Calculated at checkout</span>
                                </div>
                                <hr className="my-2" style={{ borderColor: 'rgba(255,255,255,0.15)' }} />
                                <div className="flex justify-between items-center text-xl">
                                    <span className="font-black text-white">Total</span>
                                    <span className="font-black text-white">₹{totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            {isAuthenticated ? (
                                <Link href="/checkout" className="w-full text-black font-bold p-4 rounded-2xl text-sm transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2" style={{ backgroundColor: '#F6B000' }}>
                                    <i className="fa-solid fa-lock"></i> Proceed to Checkout
                                </Link>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <p className="text-xs text-center text-white/70 mb-2">You must sign in to secure your checkout.</p>
                                    <Link href="/login" className="w-full text-black font-bold p-4 rounded-2xl text-sm transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2" style={{ backgroundColor: '#F6B000' }}>
                                        Sign In to Checkout
                                    </Link>
                                    <Link href="/register" className="w-full bg-transparent border font-bold p-3 rounded-2xl flex items-center justify-center transition-all hover:bg-white/5 active:scale-95" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                                        Create an Account
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Cross-Selling Recommendations */}
                <RecommendedProducts />
            </div>
        </div>
    );
}
