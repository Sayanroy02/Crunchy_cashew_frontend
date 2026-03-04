'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useRouter } from 'next/navigation';
import { clearCart } from '@/lib/store/features/cartSlice';

export default function CheckoutPage() {
    const { items, totalAmount } = useSelector((state: RootState) => state.cart);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'COD'
    });

    // Hydrate user info if available
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/checkout');
            return;
        }

        if (items.length === 0) {
            router.push('/cart');
            return;
        }

        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:8000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setFormData(prev => ({
                        ...prev,
                        name: data.full_name || data.username || '',
                        phone: data.phone || '',
                        address: data.address || ''
                    }));
                }
            } catch (e) {
                console.error("Failed to load profile for checkout");
            }
        };
        fetchProfile();
    }, [isAuthenticated, items.length, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

        const payload = {
            customer: {
                name: formData.name,
                phone: formData.phone,
                address: fullAddress
            },
            items: items.map(i => ({
                product_id: i.product_id,
                name: i.name,
                quantity: i.quantity,
                price: i.price
            })),
            total_amount: totalAmount,
            payment_mode: formData.paymentMethod,
            status: "Order placed"
        };

        try {
            const res = await fetch('http://localhost:8000/api/orders/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                dispatch(clearCart());
                router.push(`/profile?tab=orders&success=true&order_id=${data.order_id}`);
            } else {
                alert("Failed to place order. Please try again.");
            }
        } catch (err) {
            console.error("Checkout error", err);
            alert("Network error.");
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) return null; // Wait for redirect

    return (
        <div className="bg-[#f4f6f9] min-h-screen py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-heading font-black text-[#0c5c2b] mb-10 pb-4 border-b-2 border-[#0c5c2b]/10">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left Side: Forms */}
                    <div className="lg:w-2/3">
                        <form id="checkoutForm" onSubmit={handlePlaceOrder} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
                            <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
                                <i className="fa-solid fa-map-location-dot text-[#6bbc45]"></i> Shipping Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0c5c2b] focus:ring-1 focus:ring-[#0c5c2b]" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0c5c2b] focus:ring-1 focus:ring-[#0c5c2b]" placeholder="+91 9876543210" />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                                <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0c5c2b] focus:ring-1 focus:ring-[#0c5c2b]" placeholder="123 Cashew Lane, Apt 4B"></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0c5c2b] focus:ring-1 focus:ring-[#0c5c2b]" placeholder="Siliguri" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                                    <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0c5c2b] focus:ring-1 focus:ring-[#0c5c2b]" placeholder="West Bengal" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">PIN Code</label>
                                    <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0c5c2b] focus:ring-1 focus:ring-[#0c5c2b]" placeholder="734001" />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2 border-t border-gray-100 pt-8">
                                <i className="fa-solid fa-credit-card text-[#6bbc45]"></i> Payment Method
                            </h2>
                            <div className="flex flex-col gap-4">
                                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'COD' ? 'border-[#0c5c2b] bg-[#0c5c2b]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === 'COD'} onChange={handleInputChange} className="w-5 h-5 text-[#0c5c2b] focus:ring-[#0c5c2b]" />
                                    <div>
                                        <div className="font-bold text-gray-800">Cash on Delivery (COD)</div>
                                        <div className="text-sm text-gray-500">Pay when your order arrives.</div>
                                    </div>
                                </label>
                                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'Razorpay' ? 'border-[#0c5c2b] bg-[#0c5c2b]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input type="radio" name="paymentMethod" value="Razorpay" checked={formData.paymentMethod === 'Razorpay'} onChange={handleInputChange} className="w-5 h-5 text-[#0c5c2b] focus:ring-[#0c5c2b]" />
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-800">Pay Online (Razorpay)</div>
                                        <div className="text-sm text-gray-500">Credit Card, Debit Card, UPI, NetBanking</div>
                                    </div>
                                    <img src="https://razorpay.com/build/browser/static/razorpay-logo.5cdb58df.svg" alt="Razorpay" className="h-6 opacity-60" />
                                </label>
                            </div>
                        </form>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-[#0c5c2b] text-white rounded-3xl p-8 shadow-xl sticky top-28">
                            <h2 className="text-xl font-heading font-bold mb-6 text-[#f6d70f] border-b border-white/20 pb-4">Order Summary</h2>

                            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map(item => (
                                    <div key={item.product_id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded flex items-center justify-center shrink-0 overflow-hidden">
                                                <img src={item.image_url || '/images/products/placeholder.jpg'} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-semibold line-clamp-1 max-w-[150px]">{item.name}</div>
                                                <div className="text-white/60 text-xs">Qty: {item.quantity}</div>
                                            </div>
                                        </div>
                                        <div className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-white/20 my-6" />

                            <div className="flex flex-col gap-3 mb-8 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/80">Subtotal</span>
                                    <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/80">Shipping</span>
                                    <span className="font-semibold text-[#6bbc45]">Free</span>
                                </div>
                                <div className="flex justify-between items-center text-xl mt-4 pt-4 border-t border-white/20">
                                    <span className="font-bold text-[#f6d70f]">Total</span>
                                    <span className="font-bold text-white">₹{totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkoutForm"
                                disabled={loading}
                                className="w-full bg-[#f6d70f] text-[#0c5c2b] font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 hover:shadow-[0_0_15px_rgba(246,215,15,0.4)] transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-lock"></i>}
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                            <p className="text-white/50 text-xs text-center mt-4">Safe & Secure Checkout</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
