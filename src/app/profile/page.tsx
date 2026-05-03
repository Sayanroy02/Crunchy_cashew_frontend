'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { login, logout } from '@/lib/store/features/authSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard, { Product } from '@/components/products/ProductCard';
import { API } from '@/constants/api';
import { ORDER_STATUS_CLASSES, PAYMENT_STATUS_CLASSES, CANCELLABLE_STATUSES, COLORS } from '@/constants/styles';
import CustomerBlogs from '@/components/profile/CustomerBlogs';

interface UserProfile {
    username: string;
    email: string;
    phone?: string;
    address?: string;
    role: string;
}

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
                    <i className={`${(hover || value) >= star ? 'fa-solid fa-star text-amber' : 'fa-regular fa-star text-gray-300'}`} />
                </button>
            ))}
        </div>
    );
}

const STATUS_STEPS = ['Pending', 'Accepted', 'Dispatched', 'Shipped', 'Delivered'];

type TabKey = 'home' | 'details' | 'orders' | 'wishlist' | 'queries' | 'reviews' | 'blogs';

const SIDEBAR_TABS: { key: TabKey; label: string; icon: string }[] = [
    { key: 'details', label: 'My Accounts', icon: 'fa-user' },
    { key: 'orders', label: 'My Orders', icon: 'fa-box' },
    { key: 'wishlist', label: 'My Wishlist', icon: 'fa-heart' },
    { key: 'reviews', label: 'My Rating & Reviews', icon: 'fa-star' },
    { key: 'blogs', label: 'My Blogs', icon: 'fa-blog' },
    { key: 'queries', label: 'Queries & Contact', icon: 'fa-clipboard-question' },
];

// ── Mobile grid items ──
// NOTE: key matches the TabKey or a filter value.
// 'blogs' now correctly maps to the 'blogs' tab directly.
const MOBILE_GRID = [
    { key: 'Pending', label: 'Pending\nPayment', icon: 'fa-wallet', color: 'text-blue-500', tab: 'orders', filter: 'Pending' },
    { key: 'Delivered', label: 'Delivered', icon: 'fa-truck-fast', color: 'text-yellow-500', tab: 'orders', filter: 'Delivered' },
    { key: 'Processing', label: 'Processing', icon: 'fa-arrows-rotate', color: 'text-orange-500', tab: 'orders', filter: 'Processing' },
    { key: 'Cancelled', label: 'Cancelled', icon: 'fa-ban', color: 'text-red-500', tab: 'orders', filter: 'Cancelled' },
    { key: 'wishlist', label: 'Wishlist', icon: 'fa-heart', color: 'text-pink-500', tab: 'wishlist', filter: null },
    { key: 'blogs', label: 'My Blogs', icon: 'fa-blog', color: 'text-amber-500', tab: 'blogs', filter: null },
    { key: 'queries', label: 'Customer Care', icon: 'fa-headset', color: 'text-purple-500', tab: 'queries', filter: null },
];

export default function ProfilePage() {
    return (
        <Suspense fallback={
            <div className={`min-h-screen py-8 px-4 flex justify-center ${COLORS.bg}`}>
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ProfileContent />
        </Suspense>
    );
}

function ProfileContent() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabKey>('home');
    const [mobileOrderFilter, setMobileOrderFilter] = useState<string>('All');

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ username: '', phone: '', address: '' });
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

    const [reviewForm, setReviewForm] = useState({ name: '', city: '', state: '', description: '', rating: 5 });
    const [reviewStatus, setReviewStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        if (!isAuthenticated) { router.push('/login'); return; }
        const fetchProfile = async () => {
            try {
                const localToken = localStorage.getItem('access_token');
                const res = await fetch(API.AUTH_ME, {
                    headers: { 'Authorization': `Bearer ${token || localToken}` }
                });
                if (!res.ok) throw new Error('Failed');
                const data = await res.json();
                setProfile(data);
                setEditForm({
                    username: data.username || '',
                    phone: data.phone || '',
                    address: data.address || ''
                });
                setReviewForm(prev => ({ ...prev, name: data.username || '' }));
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchProfile();
    }, [isAuthenticated, router, token]);

    useEffect(() => {
        if (activeTab === 'wishlist') fetchWishlist();
        else if (activeTab === 'queries') fetchQueries();
        else if (activeTab === 'orders' || activeTab === 'home') fetchOrders();
    }, [activeTab]);

    const fetchWishlist = async () => {
        try {
            setTabLoading(true);
            const saved = localStorage.getItem('wishlistItems');
            if (saved) {
                const list: string[] = JSON.parse(saved);
                if (list.length > 0) {
                    const res = await fetch(API.PRODUCTS);
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
            const res = await fetch(API.MY_ORDERS, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setOrders(await res.json());
        } catch (e) { console.error(e); } finally { setTabLoading(false); }
    };

    const cancelOrder = async (orderId: string) => {
        const order = orders.find(o => o._id === orderId);
        if (order?.status === 'Dispatched') {
            alert(`Cannot cancel, order is already ${order.status}`);
            return;
        }

        if (!confirm('Are you sure you want to cancel this order?')) return;
        try {
            const res = await fetch(API.ORDER_CANCEL(orderId), {
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
                fetch(API.MY_ENQUIRIES, { headers }),
                fetch(API.MY_VISITS, { headers })
            ]);
            if (enqRes.ok) setEnquiries(await enqRes.json());
            if (visRes.ok) setVisits(await visRes.json());
        } catch (e) { console.error(e); } finally { setTabLoading(false); }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(API.AUTH_PROFILE, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            if (res.ok) {
                const data = await res.json();
                if (data.access_token) {
                    dispatch(login(data.access_token));
                }
                setIsEditing(false);
                const meRes = await fetch(API.AUTH_ME, {
                    headers: { 'Authorization': `Bearer ${data.access_token || token}` }
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
            const res = await fetch(API.TESTIMONIALS, {
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
        <div className="min-h-screen bg-[#f8f9fa] py-8 px-4 flex justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const initials = profile?.username.charAt(0).toUpperCase() || '?';
    const currentDesktopTab = activeTab === 'home' ? 'details' : activeTab;

    // Filter logic for Mobile Order views
    let displayedOrders = orders;
    if (activeTab === 'orders' && mobileOrderFilter !== 'All') {
        displayedOrders = orders.filter((o: any) => {
            if (mobileOrderFilter === 'Pending') return o.status === 'Pending' || o.status === 'Order placed';
            if (mobileOrderFilter === 'Processing') return o.status === 'Accepted' || o.status === 'Dispatched' || o.status === 'Shipped';
            if (mobileOrderFilter === 'Delivered') return o.status === 'Delivered';
            if (mobileOrderFilter === 'Cancelled') return o.status === 'Cancelled';
            return true;
        });
    }

    // ── Mobile grid tap handler ──
    const handleMobileGridTap = (item: typeof MOBILE_GRID[number]) => {
        setActiveTab(item.tab as TabKey);
        if (item.filter) setMobileOrderFilter(item.filter);
        else setMobileOrderFilter('All');
    };

    return (
        <div className="min-h-screen bg-[#FFF9E7] font-sans">

            {/* ── Order Success Modal ── */}
            {showSuccessModal && successOrderId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center">
                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-5">
                            <i className="fa-solid fa-circle-check text-4xl text-primary" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Order Placed! 🎉</h2>
                        <code className="block text-xs bg-gray-100 text-primary font-mono font-bold px-4 py-2 rounded-xl mt-3 mb-6 select-all">
                            #{successOrderId.slice(-10).toUpperCase()}
                        </code>
                        <div className="flex flex-col gap-3">
                            <Link href={`/track?order=${successOrderId}`}
                                className="block bg-primary text-white font-bold py-3 rounded-xl hover:bg-black transition flex items-center justify-center gap-2">
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

            {/* ══════════════════════════════════════
                DESKTOP VIEW
            ══════════════════════════════════════ */}
            <div className="hidden md:flex max-w-[1200px] mx-auto pt-10 pb-20 px-6 gap-8 items-start">

                {/* Desktop Sidebar */}
                <div className="w-72 shrink-0 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                        {/* Profile Info Card — NO camera icon */}
                        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                            <div className="w-16 h-16 bg-[#F6B000] rounded-full flex items-center justify-center text-2xl font-black text-black">
                                {initials}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Hello</p>
                                <h2 className="text-base font-black text-gray-800 line-clamp-1">{profile?.username}</h2>
                            </div>
                        </div>

                        {/* Sidebar Navigation */}
                        <div className="flex flex-col p-3 gap-1">
                            {SIDEBAR_TABS.map(tab => (
                                <button key={tab.key} onClick={() => { setActiveTab(tab.key); setMobileOrderFilter('All'); }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentDesktopTab === tab.key ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                                    <i className={`fa-solid ${tab.icon} w-5 text-center ${currentDesktopTab === tab.key ? 'text-white' : 'text-gray-400'}`}></i>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={() => { dispatch(logout()); router.push('/'); }}
                        className="bg-white rounded-2xl px-4 py-3.5 border border-gray-100 shadow-sm flex items-center gap-3 font-bold text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                        <i className="fa-solid fa-right-from-bracket w-5 text-center text-gray-400"></i> Logout
                    </button>
                </div>

                {/* Desktop Content Panel */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[600px]">
                    {currentDesktopTab === 'details' && (
                        <div className="animate-in fade-in duration-300">
                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                <h2 className="text-xl font-black text-gray-800">Personal Information</h2>
                                {!isEditing && (
                                    <button onClick={() => setIsEditing(true)}
                                        className="text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-xl transition-colors" style={{ color: '#000000', backgroundColor: '#F6B000' }}>
                                        <i className="fa-solid fa-pen-to-square" /> Change Information
                                    </button>
                                )}
                            </div>

                            <div className="flex gap-10">
                                {/* Profile Picture — NO camera overlay */}
                                <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-black text-black shadow-lg border-4 border-white ring-1 ring-gray-100 flex-shrink-0" style={{ backgroundColor: '#F6B000' }}>
                                    {initials}
                                </div>

                                {/* Info Form / Display */}
                                <div className="flex-1">
                                    {!isEditing ? (
                                        <div className="grid grid-cols-2 gap-y-8 gap-x-8">
                                            <div>
                                                <p className="text-xs font-bold text-gray-800 mb-2">Name</p>
                                                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600">{profile?.username}</div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800 mb-2">Role</p>
                                                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 capitalize">{profile?.role}</div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800 mb-2">Phone Number</p>
                                                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 flex items-center gap-2">
                                                    <span className="text-gray-400">🇮🇳 +91</span> {profile?.phone || 'Missing'}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800 mb-2">Email</p>
                                                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 truncate">{profile?.email}</div>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-xs font-bold text-gray-800 mb-2">Address</p>
                                                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 min-h-[80px]">
                                                    {profile?.address || 'Not provided. Update to receive orders.'}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                                            <div className="grid grid-cols-2 gap-y-6 gap-x-6">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-800 mb-2 block">Display Name</label>
                                                    <input type="text" value={editForm.username}
                                                        onChange={e => setEditForm(r => ({ ...r, username: e.target.value }))}
                                                        className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 outline-none text-sm transition-colors font-semibold focus:border-black"
                                                        style={{ '--tw-ring-color': '#F6B000' } as any}
                                                        placeholder="Your full name" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-800 mb-2 block">Phone Number</label>
                                                    <input type="text" value={editForm.phone}
                                                        onChange={e => setEditForm(r => ({ ...r, phone: e.target.value }))}
                                                        className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 outline-none text-sm transition-colors font-semibold focus:border-black"
                                                        style={{ '--tw-ring-color': '#F6B000' } as any}
                                                        placeholder="10-digit mobile number" />
                                                </div>
                                                <div className="col-span-2">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="text-xs font-bold text-gray-800">Complete Address</label>
                                                        <button type="button" onClick={handleGetLocation}
                                                            className="text-[10px] bg-gray-100 text-gray-600 font-bold px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors uppercase tracking-widest">
                                                            <i className="fa-solid fa-location-crosshairs mr-1"></i> Auto-locate
                                                        </button>
                                                    </div>
                                                    <textarea rows={4} value={editForm.address}
                                                        onChange={e => setEditForm(r => ({ ...r, address: e.target.value }))}
                                                        className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 outline-none text-sm transition-colors resize-none font-semibold focus:border-black"
                                                        style={{ '--tw-ring-color': '#F6B000' } as any}
                                                        placeholder="Enter flat/house no, street, area, city, pincode" />
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button type="submit"
                                                    className="px-8 py-3 rounded-xl font-bold transition-all text-sm active:scale-95"
                                                    style={{ backgroundColor: '#000000', color: '#F6B000' }}>
                                                    Save Complete Info
                                                </button>
                                                <button type="button" onClick={() => setIsEditing(false)}
                                                    className="px-8 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 text-sm">
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentDesktopTab === 'orders' && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-black text-gray-800 mb-6 border-b border-gray-100 pb-4">My Orders</h2>
                            <OrderListRenderer orders={orders} tabLoading={tabLoading} cancelOrder={cancelOrder} />
                        </div>
                    )}
                    {currentDesktopTab === 'wishlist' && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-black text-gray-800 mb-6 border-b border-gray-100 pb-4">My Wishlist</h2>
                            <WishlistRenderer wishlistProducts={wishlistProducts} tabLoading={tabLoading} />
                        </div>
                    )}
                    {currentDesktopTab === 'queries' && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-black text-gray-800 mb-6 border-b border-gray-100 pb-4">Queries & Factory Visits</h2>
                            <QueriesRenderer enquiries={enquiries} visits={visits} tabLoading={tabLoading} />
                        </div>
                    )}
                    {currentDesktopTab === 'reviews' && (
                        <div className="animate-in slide-in-from-right-4 duration-300 max-w-2xl">
                            <h2 className="text-xl font-black text-gray-800 mb-2">My Reviews</h2>
                            <p className="text-sm text-gray-400 mb-6 border-b border-gray-100 pb-4">Share your experience with Crunchy Cashews on our homepage.</p>
                            <ReviewFormRenderer
                                reviewForm={reviewForm}
                                setReviewForm={setReviewForm}
                                reviewStatus={reviewStatus}
                                handleReviewSubmit={handleReviewSubmit}
                            />
                        </div>
                    )}
                    {currentDesktopTab === 'blogs' && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <CustomerBlogs />
                        </div>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════
                MOBILE VIEW  (redesigned)
            ══════════════════════════════════════ */}
            <div className="md:hidden">
                {activeTab === 'home' ? (
                    /* ── Home Screen ── */
                    <div className="animate-in fade-in duration-300 bg-[#f8f9fa] min-h-screen">

                        {/* Wavy Header */}
                        <div className="relative text-black pt-8 pb-[140px] shadow-sm overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9E7] to-[#FFFE71]"></div>
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

                            <div className="relative z-10 flex justify-between items-center px-6">
                                <button onClick={() => router.push('/')}
                                    className="w-10 h-10 flex items-center justify-center text-lg active:scale-95 transition-transform">
                                    <i className="fa-solid fa-chevron-left" />
                                </button>
                                <span className="text-base font-bold tracking-widest uppercase">Profile</span>
                                <div className="w-10"></div>
                            </div>

                            {/* Wavy bottom */}
                            <svg className="absolute bottom-0 left-0 w-full translate-y-[1px] text-[#f8f9fa]"
                                viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '70px' }}>
                                <path fill="currentColor" fillOpacity="1"
                                    d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,106.7C672,96,768,128,864,154.7C960,181,1056,203,1152,181.3C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                            </svg>
                        </div>

                        {/* Avatar — NO camera icon */}
                        <div className="flex flex-col items-center -mt-[90px] relative z-20 px-6">
                            <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center text-4xl font-black text-black border-4 border-[#f8f9fa] shadow-xl shadow-gray-200" style={{ backgroundColor: '#F6B000' }}>
                                {initials}
                            </div>
                            <h2 className="text-2xl font-black text-gray-800 mt-3">{profile?.username}</h2>
                            <p className="text-xs font-semibold text-gray-400 capitalize">{profile?.role}</p>
                        </div>

                        {/* Mobile Grid Section */}
                        <div className="px-6 mt-8 mb-6">
                            <h3 className="text-lg font-black text-gray-800 mb-5 pl-1 shadow-[inset_0_-8px_0_0_var(--theme-amber)] inline-block -ml-1 pr-2">
                                Quick Access
                            </h3>
                            <div className="grid grid-cols-3 gap-y-8 gap-x-4">
                                {MOBILE_GRID.map(item => (
                                    <button
                                        key={item.key}
                                        onClick={() => handleMobileGridTap(item)}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className={`w-14 h-14 bg-white rounded-[20px] flex items-center justify-center shadow-[0_8px_16px_-4px_rgba(0,0,0,0.05)] border border-gray-100 group-active:scale-95 transition-transform ${item.color}`}>
                                            <i className={`fa-solid ${item.icon} text-2xl group-active:scale-110 transition-transform`} />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-600 text-center leading-tight whitespace-pre-wrap">
                                            {item.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* List Actions */}
                        <div className="px-6 space-y-3 pb-10">
                            <button onClick={() => setActiveTab('details')}
                                className="w-full bg-white rounded-[20px] p-5 flex items-center justify-between shadow-sm border border-gray-100 active:scale-95 transition-transform">
                                <span className="font-bold text-gray-700 text-sm flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                        <i className="fa-solid fa-user text-gray-400" />
                                    </div>
                                    Edit Profile
                                </span>
                                <i className="fa-solid fa-chevron-right text-xs text-gray-300"></i>
                            </button>
                            <button onClick={() => setActiveTab('details')}
                                className="w-full bg-white rounded-[20px] p-5 flex items-center justify-between shadow-sm border border-gray-100 active:scale-95 transition-transform">
                                <span className="font-bold text-gray-700 text-sm flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                        <i className="fa-solid fa-location-dot text-gray-400" />
                                    </div>
                                    Shipping Address
                                </span>
                                <i className="fa-solid fa-chevron-right text-xs text-gray-300"></i>
                            </button>

                            <div className="pt-6 pb-6 flex justify-center mt-4">
                                <button onClick={() => { dispatch(logout()); router.push('/'); }}
                                    className="flex items-center gap-2 text-gray-400 font-bold text-sm bg-white border border-gray-200 px-6 py-2.5 rounded-full active:bg-gray-50 transition-colors">
                                    <i className="fa-solid fa-right-from-bracket"></i> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── Detail / Sub-screen ── */
                    <div className="animate-in slide-in-from-right-8 duration-300 bg-white min-h-screen">

                        {/* Detail Header */}
                        <div className="flex items-center justify-between bg-white px-5 py-4 sticky top-0 z-30 shadow-sm border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <button onClick={() => { setActiveTab('home'); setMobileOrderFilter('All'); }}
                                    className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 active:scale-95 transition-transform">
                                    <i className="fa-solid fa-chevron-left text-sm"></i>
                                </button>
                                <h2 className="text-xl font-black text-gray-800 tracking-tight">
                                    {activeTab === 'orders' ? 'My Orders' :
                                        activeTab === 'blogs' ? 'My Blogs' :
                                            SIDEBAR_TABS.find(t => t.key === activeTab)?.label || 'Profile'}
                                </h2>
                            </div>
                            <button className="text-gray-400">
                                <i className="fa-solid fa-magnifying-glass font-bold" />
                            </button>
                        </div>

                        {/* Order Filters (only for orders tab) */}
                        {activeTab === 'orders' && (
                            <div className="flex gap-2 overflow-x-auto px-5 py-3 border-b border-gray-100 scrollbar-hide bg-white sticky top-[65px] z-20 -mx-1">
                                {['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'].map(f => (
                                    <button key={f} onClick={() => setMobileOrderFilter(f)}
                                        className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap flex-shrink-0 transition-colors ${mobileOrderFilter === f ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        {f}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Content Area */}
                        <div className="p-5 bg-white min-h-[calc(100vh-65px)] pb-10">

                            {/* ── Details tab ── */}
                            {activeTab === 'details' && (
                                <div className="space-y-6">
                                    {!isEditing ? (
                                        <div className="space-y-6 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                                                <div className="flex items-center gap-3">
                                                    {/* Avatar in detail view — NO camera icon */}
                                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl font-black text-primary">
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-black text-sm text-gray-800">{profile?.username}</h3>
                                                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">{profile?.email}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setIsEditing(true)}
                                                    className="text-primary bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                                                    <i className="fa-solid fa-pen text-xs" />
                                                </button>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Phone</p>
                                                <p className="text-sm font-semibold text-gray-800">{profile?.phone || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Address</p>
                                                <p className="text-sm font-semibold text-gray-800">{profile?.address || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleUpdateProfile}
                                            className="space-y-5 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                            <div>
                                                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1.5">Full Name</label>
                                                <input type="text" value={editForm.username}
                                                    onChange={e => setEditForm(r => ({ ...r, username: e.target.value }))}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none text-sm font-semibold focus:border-primary mb-4" />

                                                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1.5">Phone</label>
                                                <input type="text" value={editForm.phone}
                                                    onChange={e => setEditForm(r => ({ ...r, phone: e.target.value }))}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none text-sm font-semibold focus:border-primary" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1.5">Address</label>
                                                <textarea rows={3} value={editForm.address}
                                                    onChange={e => setEditForm(r => ({ ...r, address: e.target.value }))}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none text-sm font-semibold focus:border-primary resize-none" />
                                                <button type="button" onClick={handleGetLocation}
                                                    className="mt-2 text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 border border-primary/10 px-4 py-2 rounded-full inline-flex items-center gap-1.5">
                                                    <i className="fa-solid fa-location-crosshairs"></i> Auto Locate
                                                </button>
                                            </div>
                                            <div className="flex gap-3 pt-2">
                                                <button type="submit"
                                                    className="flex-1 py-3.5 rounded-xl font-bold text-sm shadow-md active:scale-95"
                                                    style={{ backgroundColor: '#000000', color: '#F6B000' }}>
                                                    Save
                                                </button>
                                                <button type="button" onClick={() => setIsEditing(false)}
                                                    className="px-6 bg-gray-100 text-gray-600 font-bold text-sm rounded-xl">
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}

                            {/* ── Orders tab ── */}
                            {activeTab === 'orders' && (
                                <OrderListRenderer
                                    orders={displayedOrders}
                                    tabLoading={tabLoading}
                                    cancelOrder={cancelOrder}
                                    isMobile
                                />
                            )}

                            {/* ── Wishlist tab ── */}
                            {activeTab === 'wishlist' && (
                                <WishlistRenderer
                                    wishlistProducts={wishlistProducts}
                                    tabLoading={tabLoading}
                                    isMobile
                                />
                            )}

                            {/* ── Queries tab ── */}
                            {activeTab === 'queries' && (
                                <QueriesRenderer
                                    enquiries={enquiries}
                                    visits={visits}
                                    tabLoading={tabLoading}
                                    isMobile
                                />
                            )}

                            {/* ── Reviews tab ── */}
                            {activeTab === 'reviews' && (
                                <ReviewFormRenderer
                                    reviewForm={reviewForm}
                                    setReviewForm={setReviewForm}
                                    reviewStatus={reviewStatus}
                                    handleReviewSubmit={handleReviewSubmit}
                                    isMobile
                                />
                            )}

                            {/* ── Blogs tab ── FIXED: now renders CustomerBlogs correctly ── */}
                            {activeTab === 'blogs' && (
                                <div className="p-2">
                                    <CustomerBlogs />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════
// RENDER SUB-COMPONENTS
// ══════════════════════════════════════════════════════

function OrderListRenderer({ orders, tabLoading, cancelOrder, isMobile }: any) {
    if (tabLoading) return (
        <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
    );
    if (orders.length === 0) return (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <i className="fa-solid fa-box-open text-4xl text-gray-200 mb-4 block" />
            <h3 className="text-lg font-black text-gray-800 mb-1">No Orders Yet</h3>
            <p className="text-gray-400 text-sm mb-6">You haven't placed any orders.</p>
            <Link href="/shop"
                className="font-bold px-6 py-2.5 rounded-full text-sm inline-block shadow-lg active:scale-95 transition-transform"
                style={{ backgroundColor: '#000000', color: '#F6B000' }}>
                Explore Store
            </Link>
        </div>
    );

    return (
        <div className={`space-y-4 ${isMobile ? '' : 'grid grid-cols-1 gap-4'}`}>
            {orders.map((order: any) => {
                const statusClass = ORDER_STATUS_CLASSES[order.status] || 'bg-gray-50 text-gray-700 border-gray-200';
                const paymentStatus = order.payment_status || (order.payment_mode === 'COD' ? 'COD' : 'Pending');
                const paymentStatusClass = PAYMENT_STATUS_CLASSES[paymentStatus] || PAYMENT_STATUS_CLASSES.Pending;
                const canCancel = CANCELLABLE_STATUSES.includes(order.status);
                return (
                    <div key={order._id}
                        className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm shadow-gray-100/50 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 flex-wrap gap-2">
                            <div className="flex items-center gap-2 font-black text-gray-800 text-sm">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Order No:</span>
                                {order._id.slice(-8).toUpperCase()}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${paymentStatusClass}`}>
                                    {paymentStatus}
                                </span>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusClass}`}>
                                    {order.status || 'Pending'}
                                </span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">
                                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                                </span>
                            </div>
                        </div>
                        <div className="px-5 py-4 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 font-semibold">
                                    Ref: <span className="font-bold text-gray-800 ml-1">UW{order._id.slice(0, 10).toUpperCase()}</span>
                                </span>
                                <span className="text-gray-500 font-semibold">{order.payment_mode || 'COD'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="text-gray-500">Items: <span className="font-bold text-gray-800 ml-1">{order.items?.length || 0}</span></span>
                                <span className="font-black text-sm" style={{ color: '#000000' }}>
                                    ₹{order.total_amount?.toLocaleString('en-IN')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between pt-3 gap-2">
                                <Link href={`/profile/orders/${order._id}`}
                                    className="text-xs font-bold text-gray-600 border-2 border-gray-100 px-5 py-2 rounded-full hover:bg-gray-50 transition-colors">
                                    View Details
                                </Link>
                                <Link href={`/profile/orders/${order._id}?download=true`}
                                    className="text-xs font-bold text-primary border-2 border-primary/20 px-5 py-2 rounded-full hover:bg-primary/5 transition-colors">
                                    Download Bill (PDF)
                                </Link>
                                {canCancel && order.status !== 'Cancelled' && (
                                    <button onClick={() => cancelOrder(order._id)}
                                        className="text-xs font-bold text-red-500 border-2 border-red-100 px-5 py-2 rounded-full hover:bg-red-50 transition-colors">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function WishlistRenderer({ wishlistProducts, tabLoading, isMobile }: any) {
    if (tabLoading) return (
        <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (wishlistProducts.length === 0) return (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <i className="fa-solid fa-heart-crack text-4xl text-gray-200 mb-5 block" />
            <h3 className="text-lg font-black text-gray-800 mb-1">Wishlist is Empty</h3>
            <p className="text-gray-400 text-sm mb-6">Save your favorite items here.</p>
            <Link href="/shop"
                className="bg-primary text-white font-bold px-6 py-2.5 rounded-full text-sm inline-block shadow-lg shadow-primary/20">
                Start Exploring
            </Link>
        </div>
    );
    return (
        <div className={`grid grid-cols-2 gap-4 ${isMobile ? '' : 'md:grid-cols-3 xl:grid-cols-4'}`}>
            {wishlistProducts.map((p: any) => <ProductCard key={p.id || p._id} product={p} />)}
        </div>
    );
}

function QueriesRenderer({ enquiries, visits, tabLoading, isMobile }: any) {
    if (tabLoading) return (
        <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (enquiries.length === 0 && visits.length === 0) return (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <i className="fa-solid fa-file-circle-question text-4xl text-gray-200 mb-5 block" />
            <h3 className="text-lg font-black text-gray-800 mb-1">No Active Queries</h3>
            <p className="text-gray-400 text-sm mb-6">You have no pending tickets or visit requests.</p>
            <div className="flex justify-center gap-3">
                <Link href="/contact" className="bg-gray-800 text-white font-bold px-6 py-2.5 rounded-full text-sm">
                    Contact Us
                </Link>
            </div>
        </div>
    );
    return (
        <div className="space-y-6">
            {enquiries.length > 0 && (
                <div>
                    <h3 className="text-[10px] font-bold tracking-widest text-primary uppercase mb-3 px-2 border-l-2 border-primary">Enquiries</h3>
                    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {enquiries.map((enq: any, i: any) => (
                            <div key={i} className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-black text-sm text-gray-800 line-clamp-1">
                                            {enq.subject || enq.enquiry_type || 'General Enquiry'}
                                        </h4>
                                        <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${enq.status === 'Resolved' || enq.status === 'Accepted' ? 'bg-primary/20 text-black' :
                                            enq.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>{enq.status || 'Pending'}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2 italic mb-4 leading-relaxed">"{enq.message}"</p>
                                    {enq.admin_notes && (
                                        <div className="mb-4 bg-primary/10 border border-primary/20 rounded-xl p-3">
                                            <p className="text-[10px] font-bold text-black/60 uppercase tracking-widest mb-1">Admin Reply</p>
                                            <p className="text-xs text-black font-semibold">{enq.admin_notes}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                    {new Date(enq.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {visits.length > 0 && (
                <div>
                    <h3 className="text-[10px] font-bold tracking-widest text-primary uppercase mb-3 px-2 border-l-2 border-primary">Visits</h3>
                    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {visits.map((vis: any, i: any) => (
                            <div key={i} className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-center mb-3 border-b border-gray-50 pb-2">
                                        <p className="text-xs font-black text-gray-800 bg-gray-50 px-2 py-1 rounded-md">
                                            {vis.date || vis.preferred_date || vis.desired_date || 'N/A'}
                                        </p>
                                        <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${vis.status === 'Approved' || vis.status === 'Accepted' ? 'bg-primary/20 text-black' :
                                            vis.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                vis.status === 'Rescheduled' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>{vis.status || 'Pending'}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-1 font-semibold">
                                        <span className="text-gray-400">Company/Attendees:</span> {vis.company || vis.company_name || vis.number_of_people || 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-500 italic mb-4">"{vis.purpose || vis.purpose_of_visit || 'Factory Visit'}"</p>
                                    {vis.admin_notes && (
                                        <div className="mb-4 bg-primary/10 border border-primary/20 rounded-xl p-3">
                                            <p className="text-[10px] font-bold text-black/60 uppercase tracking-widest mb-1">Admin Remarks</p>
                                            <p className="text-xs text-black font-semibold">{vis.admin_notes}</p>
                                        </div>
                                    )}
                                </div>
                                {vis.created_at && (
                                    <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                        {new Date(vis.created_at).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function ReviewFormRenderer({ reviewForm, setReviewForm, reviewStatus, handleReviewSubmit, isMobile }: any) {
    if (reviewStatus === 'success') return (
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 text-center animate-in zoom-in duration-300">
            <i className="fa-solid fa-circle-check text-4xl text-primary mb-3 block" />
            <p className="font-black text-black text-lg">Thank You!</p>
            <p className="text-black/60 text-sm mt-1">Your review helps us improve.</p>
        </div>
    );
    return (
        <form onSubmit={handleReviewSubmit}
            className={`space-y-5 ${isMobile ? 'bg-white rounded-2xl p-5 shadow-sm border border-gray-100' : ''}`}>
            <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Rating</label>
                <StarPicker value={reviewForm.rating} onChange={(v: any) => setReviewForm((r: any) => ({ ...r, rating: v }))} />
            </div>
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div>
                    <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block mb-1">Name</label>
                    <input required type="text" value={reviewForm.name}
                        onChange={e => setReviewForm((r: any) => ({ ...r, name: e.target.value }))}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 focus:border-primary outline-none text-sm font-bold" />
                </div>
                <div>
                    <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block mb-1">City</label>
                    <input required type="text" value={reviewForm.city}
                        onChange={e => setReviewForm((r: any) => ({ ...r, city: e.target.value }))}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 focus:border-primary outline-none text-sm font-bold" />
                </div>
                <div className={isMobile ? '' : 'col-span-2'}>
                    <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block mb-1">State</label>
                    <input required type="text" value={reviewForm.state}
                        onChange={e => setReviewForm((r: any) => ({ ...r, state: e.target.value }))}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 focus:border-primary outline-none text-sm font-bold" />
                </div>
            </div>
            <div>
                <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block mb-1">Your Review</label>
                <textarea required rows={4} value={reviewForm.description}
                    onChange={e => setReviewForm((r: any) => ({ ...r, description: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 focus:border-primary outline-none resize-none text-sm font-semibold"
                    placeholder="Share your experience..." />
            </div>
            {reviewStatus === 'error' && (
                <p className="text-red-500 text-xs font-bold">
                    <i className="fa-solid fa-circle-exclamation mr-1" /> Error submitting review.
                </p>
            )}
            <button type="submit" disabled={reviewStatus === 'loading'}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-transform disabled:opacity-60 flex items-center justify-center gap-2 uppercase tracking-widest">
                {reviewStatus === 'loading'
                    ? <><i className="fa-solid fa-spinner animate-spin" /> Submitting...</>
                    : <><i className="fa-solid fa-paper-plane" /> Submit Review</>
                }
            </button>
        </form>
    );
}