'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { removeFromCart, updateQuantity, clearCart, addToCart } from '@/lib/store/features/cartSlice';
import ProductCard, { Product } from '@/components/products/ProductCard';

function RecommendedProducts() {
    const [products, setProducts] = React.useState<Product[]>([]);

    React.useEffect(() => {
        fetch('http://localhost:8000/api/products/')
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
            <h2 className="text-2xl font-bold font-heading text-text-dark mb-6">Customers Also Bought</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default function CartPage() {
    const { items, totalAmount } = useSelector((state: RootState) => state.cart);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-bg-cream px-6">
                <i className="fa-solid fa-cart-arrow-down text-6xl text-gray-300 mb-6"></i>
                <h1 className="text-3xl font-heading font-bold text-text-dark mb-4">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added any of our delicious cashews to your cart yet.</p>
                <Link href="/shop" className="bg-primary hover:bg-green-800 text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-store"></i> Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-bg-cream min-h-screen py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-heading font-black text-text-dark mb-10 border-b-2 border-primary/20 pb-4 inline-block">Shopping Cart</h1>

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
                                <div key={item.product_id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-4 w-full sm:w-1/2 mb-4 sm:mb-0">
                                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                            <i className="fa-solid fa-box text-primary text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-dark text-lg line-clamp-1">{item.name}</h3>
                                            <p className="text-primary font-bold">₹{item.price.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between w-full sm:w-1/2 sm:justify-end gap-6">
                                        <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                            <button
                                                onClick={() => dispatch(updateQuantity({ id: item.product_id, change: -1 }))}
                                                className="px-3 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
                                            >
                                                <i className="fa-solid fa-minus text-xs"></i>
                                            </button>
                                            <span className="px-4 font-bold text-text-dark">{item.quantity}</span>
                                            <button
                                                onClick={() => dispatch(updateQuantity({ id: item.product_id, change: 1 }))}
                                                className="px-3 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
                                            >
                                                <i className="fa-solid fa-plus text-xs"></i>
                                            </button>
                                        </div>

                                        <div className="font-bold text-text-dark w-24 text-right">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </div>

                                        <button
                                            onClick={() => dispatch(removeFromCart(item.product_id))}
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
                        <div className="bg-text-dark text-white rounded-3xl p-8 shadow-2xl sticky top-28">
                            <h2 className="text-2xl font-heading font-bold mb-6 text-highlight border-b border-gray-700 pb-4">Order Summary</h2>

                            <div className="flex flex-col gap-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="font-bold">₹{totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-400">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <hr className="border-gray-700 my-2" />
                                <div className="flex justify-between items-center text-xl">
                                    <span className="font-bold text-highlight">Total</span>
                                    <span className="font-bold text-white">₹{totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            {isAuthenticated ? (
                                <Link href="/checkout" className="w-full bg-highlight text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 hover:shadow-yellow-400/20 transition-all hover:-translate-y-1">
                                    <i className="fa-solid fa-lock"></i> Proceed to Checkout
                                </Link>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <p className="text-sm text-center text-gray-400 mb-2">You must sign in to secure your checkout.</p>
                                    <Link href="/login" className="w-full bg-highlight text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all">
                                        Sign In to Checkout
                                    </Link>
                                    <Link href="/register" className="w-full bg-transparent border border-gray-600 text-white font-bold py-3 rounded-xl flex items-center justify-center hover:border-gray-400 transition-all">
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
