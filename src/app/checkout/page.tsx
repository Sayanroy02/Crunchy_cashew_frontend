'use client';

/**
 * Checkout Page
 *
 * Handles shipping details form and payment method selection.
 * The actual payment flow (COD + Razorpay popup) is delegated to <CheckoutButton />.
 * All API URLs come from @/constants/api — no hardcoded localhost strings.
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useRouter } from 'next/navigation';
import { clearCart } from '@/lib/store/features/cartSlice';
import { API } from '@/constants/api';
import CheckoutButton from '@/components/CheckoutButton';

export default function CheckoutPage() {
    const { items, totalAmount } = useSelector((state: RootState) => state.cart);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const { token: reduxToken } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'COD' as 'COD' | 'Razorpay'
    });

    const [pincodeValid, setPincodeValid] = useState<boolean | null>(null);
    const [checkingPin, setCheckingPin] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false); // used to gate checkout

    // Redirect unauthenticated users + empty cart
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/checkout');
            return;
        }
        if (items.length === 0) {
            router.push('/cart');
            return;
        }

        // Pre-fill user profile details
        const fetchProfile = async () => {
            try {
                const token = reduxToken || localStorage.getItem('token');
                if (!token) return;
                const res = await fetch(API.AUTH_ME, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    let parsedCity = '', parsedState = '', parsedPincode = '';
                    const cleanAddress = data.address || '';
                    if (data.address && data.address.includes(',')) {
                        const parts = data.address.split(',').map((p: string) => p.trim());
                        if (parts.length >= 3) {
                            parsedPincode = parts[parts.length - 2].replace(/[^0-9]/g, '');
                            parsedState = parts[parts.length - 3];
                            parsedCity = parts[parts.length - 4] || '';
                        }
                    }
                    setFormData(prev => ({
                        ...prev,
                        name: data.full_name || data.username || '',
                        phone: data.phone || '',
                        email: data.email || '',
                        address: cleanAddress,
                        city: parsedCity,
                        state: parsedState,
                        pincode: parsedPincode
                    }));
                }
            } catch (e) {
                console.error('Failed to load profile for checkout');
            }
        };
        fetchProfile();
    }, [isAuthenticated, items.length, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Reset pincode validity when pincode changes
        if (name === 'pincode') setPincodeValid(null);
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) return alert('Geolocation not supported');
        navigator.geolocation.getCurrentPosition(
            async pos => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                    const data = await res.json();
                    if (data?.display_name) setFormData(prev => ({ ...prev, address: data.display_name }));
                } catch { alert('Could not fetch address.'); }
            },
            () => { alert('Unable to retrieve location'); }
        );
    };

    // Check pincode serviceability before building the order payload
    const checkPincode = async (): Promise<boolean> => {
        if (!formData.pincode) return true; // let backend validate
        setCheckingPin(true);
        try {
            const res = await fetch(API.PINCODES_CHECK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pincode: formData.pincode })
            });
            if (res.ok) {
                const data = await res.json();
                if (!data.available) {
                    alert('We are not delivering to your location yet.');
                    return false;
                }
            }
        } catch (e) {
            console.error('Pincode check error', e);
        } finally {
            setCheckingPin(false);
        }
        return true;
    };

    // Called by form onSubmit — validates and sets formSubmitted flag
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const ok = await checkPincode();
        if (ok) setFormSubmitted(true);
    };

    // Called by CheckoutButton on success
    const handleOrderSuccess = (orderId: string) => {
        dispatch(clearCart());
        router.push(`/profile?success=true&order_id=${orderId}`);
    };

    // Called by CheckoutButton on error
    const handleOrderError = (message: string) => {
        setFormSubmitted(false);
        alert(`Payment failed: ${message}`);
    };

    const shippingThreshold = 600;
    const shippingFee = totalAmount >= shippingThreshold ? 0 : 45;
    const finalTotal = totalAmount + shippingFee;

    // Build the order payload from current form state
    const getOrderPayload = () => ({
        customer: {
            name: formData.name,
            phone: formData.phone,
            address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`
        },
        items: items.map(i => ({
            product_id: i.product_id,
            name: i.name,
            quantity: i.quantity,
            price: i.price
        })),
        total_amount: finalTotal,
        shipping_fee: shippingFee,
        payment_mode: formData.paymentMethod,
        status: 'Order placed'
    });

    const token = reduxToken || (typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '');

    if (items.length === 0) return null;

    return (
        <div className="bg-[#f4f6f9] min-h-screen py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-heading font-black text-primary mb-10 pb-4 border-b-2 border-primary/10">
                    Checkout
                </h1>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left Side: Shipping + Payment Form */}
                    <div className="lg:w-2/3">
                        <form id="checkoutForm" onSubmit={handleFormSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
                            <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
                                <i className="fa-solid fa-map-location-dot text-primary-light"></i> Shipping Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-semibold text-gray-800"
                                        placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-semibold text-gray-800"
                                        placeholder="+91 9876543210" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-semibold text-gray-800 bg-gray-50"
                                        readOnly />
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-gray-700">Street Address</label>
                                    <button type="button" onClick={handleGetLocation}
                                        className="text-[10px] bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors uppercase tracking-widest">
                                        <i className="fa-solid fa-location-crosshairs mr-1"></i> Auto-locate
                                    </button>
                                </div>
                                <textarea required name="address" value={formData.address} onChange={handleInputChange}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-semibold text-gray-800"
                                    placeholder="123 Cashew Lane, Apt 4B"></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-semibold text-gray-800"
                                        placeholder="Siliguri" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                                    <input required type="text" name="state" value={formData.state} onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-semibold text-gray-800"
                                        placeholder="West Bengal" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">PIN Code</label>
                                    <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-semibold text-gray-800"
                                        placeholder="734001" maxLength={6} />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2 border-t border-gray-100 pt-8">
                                <i className="fa-solid fa-credit-card text-primary-light"></i> Payment Method
                            </h2>
                            <div className="flex flex-col gap-4">
                                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input type="radio" name="paymentMethod" value="COD"
                                        checked={formData.paymentMethod === 'COD'} onChange={handleInputChange}
                                        className="w-5 h-5 text-primary focus:ring-primary" />
                                    <div>
                                        <div className="font-bold text-gray-800">Cash on Delivery (COD)</div>
                                        <div className="text-sm text-gray-500">Pay when your order arrives.</div>
                                    </div>
                                </label>
                                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'Razorpay' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input type="radio" name="paymentMethod" value="Razorpay"
                                        checked={formData.paymentMethod === 'Razorpay'} onChange={handleInputChange}
                                        className="w-5 h-5 text-primary focus:ring-primary" />
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-800">Pay Online (Razorpay)</div>
                                        <div className="text-sm text-gray-500">Credit Card, Debit Card, UPI, NetBanking</div>
                                    </div>
                                    <img src="https://razorpay.com/build/browser/static/razorpay-logo.5cdb58df.svg" alt="Razorpay" className="h-6 opacity-60" />
                                </label>
                            </div>

                            {/* Hidden submit to allow <CheckoutButton> to trigger form validation first */}
                            <button type="submit" className="hidden" id="form-submit-trigger" />
                        </form>
                    </div>

                    {/* Right Side: Order Summary + Checkout Button */}
                    <div className="lg:w-1/3">
                        <div className="bg-primary text-white rounded-3xl p-8 shadow-xl sticky top-28">
                            <h2 className="text-xl font-heading font-bold mb-6 text-yellow border-b border-white/20 pb-4">
                                Order Summary
                            </h2>

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
                                    <span className={`font-semibold ${shippingFee === 0 ? 'text-[#86efac]' : ''}`}>
                                        {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xl mt-4 pt-4 border-t border-white/20">
                                    <span className="font-bold text-yellow">Total</span>
                                    <span className="font-bold text-white">₹{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* CheckoutButton: handles both COD and Razorpay flows */}
                            {formSubmitted ? (
                                <CheckoutButton
                                    orderPayload={getOrderPayload()}
                                    token={token}
                                    onSuccess={handleOrderSuccess}
                                    onError={handleOrderError}
                                />
                            ) : (
                                <button
                                    type="button"
                                    disabled={checkingPin}
                                    onClick={() => {
                                        // Trigger HTML5 form validation by submitting the form
                                        (document.getElementById('form-submit-trigger') as HTMLButtonElement)?.click();
                                    }}
                                    className="w-full bg-yellow text-primary font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow hover:shadow-[0_0_15px_rgba(246,215,15,0.4)] transition-all transform hover:-translate-y-1 disabled:opacity-70"
                                >
                                    {checkingPin ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-lock" />}
                                    {checkingPin ? 'Checking location...' : 'Place Order'}
                                </button>
                            )}
                            <p className="text-white/50 text-xs text-center mt-4">Safe &amp; Secure Checkout</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
