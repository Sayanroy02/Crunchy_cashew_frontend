'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { logout } from '@/lib/store/features/authSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard, { Product } from '@/components/products/ProductCard';

interface UserProfile {
    username: string;
    email: string;
    phone?: string;
    address?: string;
    role: string;
}

// ─── Star Rating Component ───────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="text-2xl transition-transform hover:scale-110"
                >
                    <i className={`${(hover || value) >= star ? 'fa-solid fa-star text-[#FBB21B]' : 'fa-regular fa-star text-gray-300'}`} />
                </button>
            ))}
        </div>
    );
}

// ─── Status step/pill ────────────────────────────────────────────
const STATUS_STEPS = ['Pending', 'Accepted', 'Dispatched', 'Shipped', 'Delivered'];
const STATUS_COLORS: Record<string, string> = {
    Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Accepted: 'bg-blue-50 text-blue-700 border-blue-200',
    Dispatched: 'bg-purple-50 text-purple-700 border-purple-200',
    Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Delivered: 'bg-green-50 text-green-700 border-green-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
};

type TabKey = 'details' | 'orders' | 'wishlist' | 'queries' | 'reviews';

const TABS: { key: TabKey; label: string; icon: string }[] = [
    { key: 'details', label: 'Account', icon: 'fa-user' },
    { key: 'orders', label: 'Orders', icon: 'fa-box' },
    { key: 'wishlist', label: 'Wishlist', icon: 'fa-heart' },
    { key: 'reviews', label: 'Reviews', icon: 'fa-star' },
    { key: 'queries', label: 'Queries', icon: 'fa-clipboard-question' },
];

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabKey>('details');

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ phone: '', address: '' });
    const [locating, setLocating] = useState(false);

    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderSuccess = searchParams.get('success') === 'true';
    const successOrderId = searchParams.get('order_id');
    const [showSuccessModal, setShowSuccessModal] = useState(orderSuccess);

    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [visits, setVisits] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [tabLoading, setTabLoading] = useState(false);

    // Reviews state
    const [reviewForm, setReviewForm] = useState({ name: '', city: '', state: '', description: '', rating: 5 });
    const [reviewStatus, setReviewStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        if (!isAuthenticated) { router.push('/login'); return; }
        const fetchProfile = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed');
                const data = await res.json();
                setProfile(data);
                setEditForm({ phone: data.phone || '', address: data.address || '' });
                setReviewForm(prev => ({ ...prev, name: data.username || '' }));
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchProfile();
    }, [isAuthenticated, router, token]);

    useEffect(() => {
        if (activeTab === 'wishlist') fetchWishlist();
        else if (activeTab === 'queries') fetchQueries();
        else if (activeTab === 'orders') fetchOrders();
    }, [activeTab]);

    const fetchWishlist = async () => {
        try {
            setTabLoading(true);
            const saved = localStorage.getItem('wishlistItems');
            if (saved) {
                const list: string[] = JSON.parse(saved);
                if (list.length > 0) {
                    const res = await fetch('http://localhost:8000/api/products/');
                    if (res.ok) {
                        const all = await res.json();
                        setWishlistProducts(all.filter((p: any) => list.includes(p.id || p._id)));
                    }
                } else setWishlistProducts([]);
            }
        } catch (e) { console.error(e); } finally { setTabLoading(false); }
    };

    const fetchOrders = async () => {
        try {
            setTabLoading(true);
            const res = await fetch('http://localhost:8000/api/orders/my-orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setOrders(await res.json());
        } catch (e) { console.error(e); } finally { setTabLoading(false); }
    };

    const cancelOrder = async (orderId: string) => {
        if (!confirm('Cancel this order?')) return;
        try {
            const res = await fetch(`http://localhost:8000/api/orders/cancel/${orderId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'Cancelled' } : o));
            } else {
                const err = await res.json().catch(() => ({}));
                alert(err.detail || 'Cannot cancel order.');
            }
        } catch { alert('Network error.'); }
    };

    const fetchQueries = async () => {
        try {
            setTabLoading(true);
            const headers = { 'Authorization': `Bearer ${token}` };
            const [enqRes, visRes] = await Promise.all([
                fetch('http://localhost:8000/api/contact/my-enquiries', { headers }),
                fetch('http://localhost:8000/api/contact/my-visits', { headers })
            ]);
            if (enqRes.ok) setEnquiries(await enqRes.json());
            if (visRes.ok) setVisits(await visRes.json());
        } catch (e) { console.error(e); } finally { setTabLoading(false); }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8000/api/auth/profile', {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            if (res.ok) {
                setIsEditing(false);
                const meRes = await fetch('http://localhost:8000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setProfile(await meRes.json());
            }
        } catch (err) { console.error('Update failed', err); }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) return alert('Geolocation not supported');
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async pos => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                    const data = await res.json();
                    if (data?.display_name) setEditForm(prev => ({ ...prev, address: data.display_name }));
                } catch { alert('Could not fetch address.'); }
                setLocating(false);
            },
            () => { alert('Unable to retrieve location'); setLocating(false); }
        );
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setReviewStatus('loading');
        try {
            const res = await fetch('http://localhost:8000/api/cms/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewForm)
            });
            if (res.ok) {
                setReviewStatus('success');
                setTimeout(() => setReviewStatus('idle'), 4000);
            } else setReviewStatus('error');
        } catch { setReviewStatus('error'); }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#f8f9fa] py-8 px-4">
            <div className="max-w-3xl mx-auto space-y-4">
                <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
                <div className="h-12 bg-gray-100 rounded-full w-full animate-pulse" />
                <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
            </div>
        </div>
    );

    const initials = profile?.username.charAt(0).toUpperCase() || '?';

    return (
        <div className="min-h-screen bg-[#f8f9fa]">

            {/* ── Order Success Modal ── */}
            {showSuccessModal && successOrderId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                            <i className="fa-solid fa-circle-check text-4xl text-green-500" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Order Placed! 🎉</h2>
                        <p className="text-gray-500 text-sm mb-1">Your order has been confirmed.</p>
                        <code className="block text-xs bg-gray-100 text-[#0c5c2b] font-mono font-bold px-4 py-2 rounded-xl mt-3 mb-6 select-all">
                            #{successOrderId.slice(-10).toUpperCase()}
                        </code>
                        <div className="flex flex-col gap-3">
                            <Link href={`/track?order=${successOrderId}`}
                                className="block bg-[#0c5c2b] text-white font-bold py-3 rounded-xl hover:bg-green-800 transition flex items-center justify-center gap-2">
                                <i className="fa-solid fa-truck-fast" /> Track Your Order
                            </Link>
                            <button onClick={() => setShowSuccessModal(false)}
                                className="block bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition text-sm w-full">
                                View My Orders
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Profile Header Card ── */}
            <div className="bg-[#0c5c2b] text-white rounded-2xl p-5 md:p-7 flex items-center gap-4 relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                {/* Avatar */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl md:text-4xl font-black z-10 shrink-0 border-2 border-white/30">
                    {initials}
                </div>
                <div className="z-10 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-xl md:text-2xl font-black truncate">{profile?.username}</h1>
                        {profile?.role === 'admin' && (
                            <span className="bg-[#FBB21B] text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                        )}
                    </div>
                    <p className="text-green-200 text-sm mt-0.5 truncate">{profile?.email}</p>
                    {profile?.phone && <p className="text-green-100 text-xs mt-0.5"><i className="fa-solid fa-phone mr-1.5" />{profile.phone}</p>}
                </div>
                <button
                    onClick={() => { dispatch(logout()); router.push('/'); }}
                    className="z-10 shrink-0 flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-3 py-2 rounded-xl transition-all border border-white/20"
                >
                    <i className="fa-solid fa-arrow-right-from-bracket" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>

            {/* ── Tab Bar ── */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide bg-white rounded-2xl p-1.5 shadow-sm">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all flex-shrink-0 ${activeTab === tab.key
                            ? 'bg-[#0c5c2b] text-white shadow-md'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                    >
                        <i className={`fa-solid ${tab.icon} text-xs`} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Tab Content ── */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

                {/* ── ACCOUNT DETAILS ── */}
                {activeTab === 'details' && (
                    <div className="p-5 md:p-7">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-bold text-gray-800">Personal Information</h2>
                            {!isEditing && (
                                <button onClick={() => setIsEditing(true)} className="text-sm text-[#0c5c2b] font-bold flex items-center gap-1.5 hover:underline">
                                    <i className="fa-solid fa-pen" /> Edit
                                </button>
                            )}
                        </div>

                        {!isEditing ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { label: 'Username', value: profile?.username, icon: 'fa-user' },
                                    { label: 'Email', value: profile?.email, icon: 'fa-envelope' },
                                    { label: 'Phone', value: profile?.phone || 'Not provided', icon: 'fa-phone' },
                                    { label: 'Address', value: profile?.address || 'Not provided', icon: 'fa-location-dot' },
                                ].map(item => (
                                    <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                            <i className={`fa-solid ${item.icon}`} /> {item.label}
                                        </p>
                                        <p className="text-gray-800 font-medium text-sm break-words">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Phone Number</label>
                                    <input
                                        type="text" value={editForm.phone}
                                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-2.5 px-4 focus:border-[#0c5c2b] outline-none text-sm transition-colors"
                                        placeholder="+91 00000 00000"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="text-sm font-bold text-gray-700">Delivery Address</label>
                                        <button type="button" onClick={handleGetLocation} disabled={locating}
                                            className="text-xs bg-[#FBB21B] text-black font-bold px-3 py-1 rounded-full hover:bg-yellow-400 transition-colors disabled:opacity-50">
                                            {locating ? 'Locating...' : '📍 Use Location'}
                                        </button>
                                    </div>
                                    <textarea
                                        rows={3} value={editForm.address}
                                        onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-2.5 px-4 focus:border-[#0c5c2b] outline-none resize-none text-sm transition-colors"
                                        placeholder="Enter your full delivery address"
                                    />
                                </div>
                                <div className="flex gap-3 pt-1">
                                    <button type="button" onClick={() => setIsEditing(false)}
                                        className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 text-sm transition-colors">Cancel</button>
                                    <button type="submit"
                                        className="flex-1 py-2.5 rounded-xl font-bold text-black bg-[#FBB21B] hover:bg-yellow-400 text-sm transition-colors shadow-sm">Save Changes</button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {/* ── ORDERS ── */}
                {activeTab === 'orders' && (
                    <div className="p-5 md:p-7">
                        <h2 className="text-lg font-bold text-gray-800 mb-5">My Orders</h2>
                        {tabLoading ? (
                            <div className="space-y-3">
                                {[1, 2].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-14">
                                <i className="fa-solid fa-box-open text-5xl text-gray-200 mb-4 block" />
                                <h3 className="text-lg font-bold text-gray-700 mb-1">No Orders Yet</h3>
                                <p className="text-gray-400 text-sm mb-5">Place your first order from the shop!</p>
                                <Link href="/shop" className="bg-[#0c5c2b] text-white font-bold px-6 py-2.5 rounded-full hover:bg-green-800 transition inline-block text-sm">
                                    Shop Now
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orders.map((order: any) => {
                                    const sc = STATUS_COLORS[order.status] || 'bg-gray-50 text-gray-700 border-gray-200';
                                    const currentIdx = STATUS_STEPS.indexOf(order.status ?? 'Pending');
                                    const isCancelled = order.status === 'Cancelled';
                                    return (
                                        <div key={order._id} className="border border-gray-100 rounded-2xl overflow-hidden">
                                            {/* Order header */}
                                            <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                                                <div>
                                                    <p className="text-[11px] text-gray-400 font-medium">Order ID</p>
                                                    <p className="font-bold font-mono text-sm text-gray-800">{order._id.slice(-8).toUpperCase()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[11px] text-gray-400">{order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</p>
                                                    <p className="font-black text-base text-[#0c5c2b]">₹{order.total_amount?.toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>
                                            <div className="px-5 py-4 space-y-3">
                                                {/* Status + payment */}
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${sc}`}>{order.status || 'Processing'}</span>
                                                    <span className="text-xs text-gray-400">{order.payment_mode} · {order.payment_status}</span>
                                                    <Link href={`/track?order=${order._id}`}
                                                        className="ml-auto text-xs font-bold text-[#0c5c2b] border border-[#0c5c2b] px-3 py-1 rounded-full hover:bg-[#0c5c2b] hover:text-white transition-colors">
                                                        <i className="fa-solid fa-truck-fast mr-1" /> Track
                                                    </Link>
                                                </div>
                                                {/* Progress stepper */}
                                                {!isCancelled && (
                                                    <div className="flex items-center gap-0 overflow-x-auto">
                                                        {STATUS_STEPS.map((s, idx) => {
                                                            const done = idx <= currentIdx;
                                                            const isLast = idx === STATUS_STEPS.length - 1;
                                                            return (
                                                                <React.Fragment key={s}>
                                                                    <div className="flex flex-col items-center shrink-0">
                                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${done ? 'bg-[#0c5c2b] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                                            {done ? <i className="fa-solid fa-check" /> : idx + 1}
                                                                        </div>
                                                                        <p className={`text-[9px] mt-0.5 font-medium text-center leading-none ${done ? 'text-[#0c5c2b]' : 'text-gray-300'}`}>{s}</p>
                                                                    </div>
                                                                    {!isLast && <div className={`flex-1 h-0.5 mx-0.5 mb-3 ${idx < currentIdx ? 'bg-[#0c5c2b]' : 'bg-gray-100'}`} />}
                                                                </React.Fragment>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                                {/* Items breakdown */}
                                                {order.items?.length > 0 && (
                                                    <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                                                        {order.items.map((it: any, idx: number) => (
                                                            <div key={idx} className="flex items-center justify-between text-xs">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="w-5 h-5 bg-[#0c5c2b]/10 text-[#0c5c2b] rounded font-bold flex items-center justify-center text-[10px]">{idx + 1}</span>
                                                                    <span className="font-semibold text-gray-700">{it.name || it.product_name || 'Item'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-3 text-gray-500">
                                                                    <span>×{it.quantity}</span>
                                                                    <span className="font-semibold text-gray-800">₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {/* Cancel button (only for Pending/Accepted) */}
                                                {!isCancelled && (order.status === 'Pending' || order.status === 'Accepted' || order.status === 'Order placed') && (
                                                    <button
                                                        onClick={() => cancelOrder(order._id)}
                                                        className="text-xs font-bold text-red-500 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors"
                                                    >
                                                        <i className="fa-solid fa-xmark mr-1" /> Cancel Order
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ── WISHLIST ── */}
                {activeTab === 'wishlist' && (
                    <div className="p-5 md:p-7">
                        <h2 className="text-lg font-bold text-gray-800 mb-5">My Wishlist</h2>
                        {tabLoading ? (
                            <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-[#0c5c2b] border-t-transparent rounded-full animate-spin" /></div>
                        ) : wishlistProducts.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {wishlistProducts.map(p => <ProductCard key={p.id || p._id} product={p} />)}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <i className="fa-solid fa-heart-crack text-5xl text-gray-200 mb-5 block" />
                                <h3 className="text-lg font-bold text-gray-700 mb-1">Wishlist is Empty</h3>
                                <p className="text-gray-400 text-sm mb-5">Save your favorite cashews for later!</p>
                                <Link href="/shop" className="bg-[#0c5c2b] text-white font-bold px-6 py-2.5 rounded-full hover:bg-green-800 transition text-sm inline-block">Discover Products</Link>
                            </div>
                        )}
                    </div>
                )}

                {/* ── REVIEWS ── */}
                {activeTab === 'reviews' && (
                    <div className="p-5 md:p-7">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Write a Review</h2>
                        <p className="text-sm text-gray-400 mb-5">Share your experience with Crunchy Cashews — your review will appear on the homepage after approval.</p>

                        {reviewStatus === 'success' ? (
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                                <i className="fa-solid fa-circle-check text-4xl text-green-500 mb-3 block" />
                                <p className="font-bold text-green-800 text-lg">Review Submitted!</p>
                                <p className="text-green-600 text-sm mt-1">It will be visible on the homepage once approved.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleReviewSubmit} className="space-y-4">
                                {/* Star Rating */}
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Your Rating</label>
                                    <StarPicker value={reviewForm.rating} onChange={v => setReviewForm(r => ({ ...r, rating: v }))} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 block mb-1.5">Name</label>
                                        <input required type="text" value={reviewForm.name}
                                            onChange={e => setReviewForm(r => ({ ...r, name: e.target.value }))}
                                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-2.5 px-4 focus:border-[#0c5c2b] outline-none text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 block mb-1.5">City</label>
                                        <input required type="text" value={reviewForm.city}
                                            onChange={e => setReviewForm(r => ({ ...r, city: e.target.value }))}
                                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-2.5 px-4 focus:border-[#0c5c2b] outline-none text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 block mb-1.5">State</label>
                                        <input required type="text" value={reviewForm.state}
                                            onChange={e => setReviewForm(r => ({ ...r, state: e.target.value }))}
                                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-2.5 px-4 focus:border-[#0c5c2b] outline-none text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Your Review</label>
                                    <textarea required rows={4} value={reviewForm.description}
                                        onChange={e => setReviewForm(r => ({ ...r, description: e.target.value }))}
                                        placeholder="Tell us about your experience with our cashews..."
                                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-2.5 px-4 focus:border-[#0c5c2b] outline-none resize-none text-sm transition-colors" />
                                </div>
                                {reviewStatus === 'error' && (
                                    <p className="text-red-500 text-sm"><i className="fa-solid fa-circle-exclamation mr-1" /> Something went wrong. Please try again.</p>
                                )}
                                <button type="submit" disabled={reviewStatus === 'loading'}
                                    className="w-full bg-[#0c5c2b] text-white py-3 rounded-xl font-bold hover:bg-green-800 transition text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                                    {reviewStatus === 'loading' ? <><i className="fa-solid fa-spinner animate-spin" /> Submitting...</> : <><i className="fa-solid fa-paper-plane" /> Submit Review</>}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {/* ── QUERIES ── */}
                {activeTab === 'queries' && (
                    <div className="p-5 md:p-7">
                        <h2 className="text-lg font-bold text-gray-800 mb-5">My Queries & Requests</h2>
                        {tabLoading ? (
                            <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-[#0c5c2b] border-t-transparent rounded-full animate-spin" /></div>
                        ) : enquiries.length === 0 && visits.length === 0 ? (
                            <div className="text-center py-12">
                                <i className="fa-solid fa-file-circle-question text-5xl text-gray-200 mb-5 block" />
                                <h3 className="text-lg font-bold text-gray-700 mb-1">No Active Queries</h3>
                                <p className="text-gray-400 text-sm mb-5">You have no pending queries or visit requests.</p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link href="/contact" className="bg-gray-800 text-white font-bold px-6 py-2.5 rounded-full hover:bg-gray-700 transition text-sm">Contact Us</Link>
                                    <Link href="/bulk" className="bg-[#FBB21B] text-black font-bold px-6 py-2.5 rounded-full hover:bg-yellow-400 transition text-sm">Wholesale Inquiry</Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {enquiries.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2"><i className="fa-solid fa-envelope text-[#0c5c2b]" /> Enquiries</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {enquiries.map((enq, i) => (
                                                <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="text-xs text-gray-400">{new Date(enq.created_at).toLocaleDateString()}</div>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${enq.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{enq.status || 'Pending'}</span>
                                                    </div>
                                                    <h4 className="font-bold text-sm mb-1 line-clamp-1">{enq.subject}</h4>
                                                    <p className="text-xs text-gray-500 line-clamp-2 italic">"{enq.message}"</p>
                                                    {enq.admin_notes && (
                                                        <div className="mt-3 p-3 bg-white border-l-2 border-[#0c5c2b] rounded-r-lg">
                                                            <span className="font-bold text-[10px] text-gray-500 uppercase block mb-0.5">Admin Reply:</span>
                                                            <p className="text-xs text-gray-700">{enq.admin_notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {visits.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2"><i className="fa-solid fa-industry text-[#0c5c2b]" /> Factory Visits</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {visits.map((vis, i) => (
                                                <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                                                    <div className="flex justify-between mb-3">
                                                        <p className="text-xs font-bold text-[#0c5c2b]">Date: {vis.preferred_date}</p>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${vis.status === 'Approved' ? 'bg-green-100 text-green-700' : vis.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{vis.status || 'Pending'}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-600"><strong>Attendees:</strong> {vis.number_of_people}</p>
                                                    <p className="text-xs text-gray-500 mt-1 italic">"{vis.purpose_of_visit}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
